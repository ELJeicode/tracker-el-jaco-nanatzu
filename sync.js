// ================= Sincronización con Supabase =================
// Sube y baja todo el progreso EXCEPTO las finanzas (transactions), que se quedan
// solo en el dispositivo donde se registran.
//
// La clave "publishable" (o "anon") está hecha para ir en el código público: lo que
// protege los datos son las reglas RLS de la tabla (ver supabase.sql) y que el
// registro de usuarios nuevos está desactivado.
const SUPABASE_URL = 'https://gqqqcsebtvhahnbbllrr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zZojq41H3J2bzHwPC4Ti9Q_TYbMEAmK';

(() => {
    const TABLE = 'tracker_state';
    const BASE_KEY = 'nanatsu_sync_base';   // última versión acordada con la nube (para combinar cambios)
    const LAST_KEY = 'nanatsu_sync_last';   // hora de la última sincronización correcta

    let sb = null, user = null, busy = false, again = false, timer = null;

    // ---------- Utilidades ----------
    const $ = id => document.getElementById(id);
    const clone = o => JSON.parse(JSON.stringify(o));
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const cloudCopy = s => { const { transactions, ...rest } = s; return clone(rest); };
    const hasProgress = s => s && ((s.totalXP || 0) > 0 || (s.weights || []).length > 0 || Object.keys(s.days || {}).length > 0);

    function loadBase() {
        try {
            const b = JSON.parse(localStorage.getItem(BASE_KEY));
            return b && user && b.uid === user.id ? b.data : null;
        } catch { return null; }
    }
    function saveBase(data) {
        try { localStorage.setItem(BASE_KEY, JSON.stringify({ uid: user.id, data: cloudCopy(data) })); } catch {}
    }

    // ---------- Estado visible ----------
    const STATUS = {
        off:     ['☁️', 'Apagada'],
        out:     ['☁️', 'Entrar'],
        busy:    ['⏳', 'Sincronizando'],
        ok:      ['✅', 'Al día'],
        offline: ['📴', 'Sin red'],
        err:     ['⚠️', 'Error']
    };
    let lastError = '';
    function setStatus(kind, err = '') {
        const [icon, text] = STATUS[kind];
        $('sync-icon').textContent = icon;
        $('sync-text').textContent = text;
        lastError = err;
        if (kind === 'ok') try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch {}
        renderModal();
    }

    function renderModal() {
        const configured = !!sb;
        $('sync-off').hidden = configured;
        $('sync-login').hidden = !configured || !!user;
        $('sync-account').hidden = !configured || !user;
        if (user) {
            $('sync-user').textContent = user.email;
            let last = 0;
            try { last = Number(localStorage.getItem(LAST_KEY)) || 0; } catch {}
            $('sync-last').textContent = last ? `Última sincronización: ${new Date(last).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}` : 'Aún no se ha sincronizado';
            $('sync-err2').textContent = lastError;
        }
    }

    // ---------- Combinar dos versiones ----------
    // B = base (última versión común), L = este dispositivo, R = nube.
    // Contadores (XP, oro, XP por día, veces canjeado): se suman los avances de ambos lados.
    // Listas (pesos, recompensas): se unen; lo borrado en un lado se borra.
    function merge3(B, L, R) {
        const newer = (L.updatedAt || 0) >= (R.updatedAt || 0) ? L : R;
        const out = clone(newer);
        const ctr = (b, l, r) => Math.max(0, (l ?? 0) + (r ?? 0) - (b ?? 0));
        const pick = (b, l, r) => (same(l, b) ? r : l);

        out.totalXP = ctr(B.totalXP, L.totalXP, R.totalXP);
        out.spentXP = ctr(B.spentXP, L.spentXP, R.spentXP);
        out.shields = ctr(B.shields, L.shields, R.shields);

        out.days = {};
        const keys = new Set([...Object.keys(L.days || {}), ...Object.keys(R.days || {})]);
        for (const k of keys) {
            const b = B.days?.[k], l = L.days?.[k], r = R.days?.[k];
            out.days[k] = {
                xp: ctr(b?.xp, l?.xp, r?.xp),
                complete: !!pick(b?.complete, l?.complete, r?.complete),
                shielded: !!pick(b?.shielded, l?.shielded, r?.shielded)
            };
            const via = pick(b?.via, l?.via, r?.via);
            if (out.days[k].shielded && via) out.days[k].via = via;
            const bonus = pick(b?.bonus, l?.bonus, r?.bonus);   // bono de racha del día
            if (bonus && out.days[k].complete) out.days[k].bonus = bonus;
            const done = pick(b?.done, l?.done, r?.done);       // qué hábitos se marcaron
            if (Array.isArray(done)) out.days[k].done = done;
            if (l?.corrected || r?.corrected) out.days[k].corrected = true;
        }

        if (L.day === R.day) {
            const bHabits = B.day === L.day ? (B.habits || []) : [];
            const doneIn = (list, id) => !!(list || []).find(h => h.id === id)?.done;
            out.day = L.day;
            out.habits = newer.habits.map(h => ({ ...h, done: pick(doneIn(bHabits, h.id), doneIn(L.habits, h.id), doneIn(R.habits, h.id)) }));
        } else {
            const later = L.day > R.day ? L : R;
            out.day = later.day;
            out.habits = clone(later.habits);
        }

        out.weights = mergeList(B.weights, L.weights, R.weights, w => w.date).sort((a, b) => a.date.localeCompare(b.date));
        out.rewards = mergeList(B.rewards, L.rewards, R.rewards, r => r.id).map(r => {
            const find = list => (list || []).find(x => x.id === r.id);
            return { ...r, times: ctr(find(B.rewards)?.times, find(L.rewards)?.times, find(R.rewards)?.times) };
        });
        out.lastRank = Math.max(L.lastRank || 1, R.lastRank || 1);
        return out;
    }

    function mergeList(B = [], L = [], R = [], key) {
        const mb = new Map(B.map(x => [key(x), x])), ml = new Map(L.map(x => [key(x), x])), mr = new Map(R.map(x => [key(x), x]));
        const out = [];
        for (const k of new Set([...ml.keys(), ...mr.keys()])) {
            const b = mb.get(k), l = ml.get(k), r = mr.get(k);
            if (l && r) out.push(same(l, b) ? r : l);
            else if (l && !b) out.push(l);        // nuevo en este dispositivo
            else if (r && !b) out.push(r);        // nuevo en la nube
            // si estaba en la base y falta en un lado → se borró allá
        }
        return out;
    }

    // ---------- Aplicar / subir ----------
    function adopt(cloudData) {
        const transactions = state.transactions;            // las finanzas locales no se tocan
        state = { ...clone(cloudData), transactions };
        normalizeState();
        rollover();
        persist();                                          // guarda sin marcarlo como cambio nuevo
        render();
        saveBase(cloudData);
    }

    async function upload(data) {
        const payload = cloudCopy(data);
        const { error } = await sb.from(TABLE).upsert({ user_id: user.id, data: payload, updated_at: new Date().toISOString() });
        if (error) throw error;
        saveBase(payload);
    }

    function askChoice(local, remote) {
        const describe = s => `XP: <b>${fmtNum(s.totalXP || 0)}</b>Días registrados: ${Object.keys(s.days || {}).length}<br>Pesos: ${(s.weights || []).length}`;
        $('sync-compare').innerHTML = `<div><b>Este dispositivo</b>${describe(local)}</div><div><b>La nube</b>${describe(remote)}</div>`;
        $('sync-choice').classList.add('show');
        return new Promise(resolve => {
            $('sync-choice').onclick = e => {
                const b = e.target.closest('[data-choice]');
                if (!b) return;
                $('sync-choice').classList.remove('show');
                resolve(b.dataset.choice);
            };
        });
    }

    // ---------- Sincronizar ----------
    async function syncNow() {
        if (!sb || !user) return;
        if (busy) { again = true; return; }
        if (!navigator.onLine) { setStatus('offline'); return; }
        busy = true;
        setStatus('busy');
        try {
            const { data: row, error } = await sb.from(TABLE).select('data').eq('user_id', user.id).maybeSingle();
            if (error) throw error;
            const local = cloudCopy(state);
            const base = loadBase();

            if (!row) {
                await upload(local);                                    // primera vez: la nube está vacía
            } else {
                const remote = row.data;
                if (!base) {
                    // Primera vez en este dispositivo con esta cuenta.
                    if (!hasProgress(local) || same(local, remote)) adopt(remote);
                    else if (!hasProgress(remote)) await upload(local);
                    else if ((await askChoice(local, remote)) === 'cloud') adopt(remote);
                    else await upload(local);
                } else {
                    const localChanged = (local.updatedAt || 0) !== (base.updatedAt || 0);
                    const remoteChanged = (remote.updatedAt || 0) !== (base.updatedAt || 0);
                    if (remoteChanged && !localChanged) adopt(remote);
                    else if (localChanged && !remoteChanged) await upload(local);
                    else if (localChanged && remoteChanged) {
                        const merged = merge3(base, local, remote);
                        merged.updatedAt = Date.now();
                        adopt(merged);
                        await upload(merged);
                        toast('☁️ Cambios de tus dos dispositivos combinados');
                    }
                }
            }
            setStatus('ok');
        } catch (e) {
            setStatus(navigator.onLine ? 'err' : 'offline', e.message || String(e));
        } finally {
            busy = false;
            if (again) { again = false; syncNow(); }
        }
    }

    // Llamado por persist(true) en cada cambio hecho por la persona.
    window.syncSoon = () => {
        if (!sb || !user) return;
        clearTimeout(timer);
        timer = setTimeout(syncNow, 1500);
    };

    // ---------- Sesión ----------
    async function login(e) {
        e.preventDefault();
        const btn = $('sync-login-btn');
        btn.disabled = true;
        $('sync-err').textContent = '';
        const { error } = await sb.auth.signInWithPassword({ email: $('sync-email').value.trim(), password: $('sync-pass').value });
        btn.disabled = false;
        if (error) {
            $('sync-err').textContent = /invalid/i.test(error.message) ? 'Correo o contraseña incorrectos.' : error.message;
            return;
        }
        $('sync-pass').value = '';
        $('sync-modal').classList.remove('show');
    }

    async function logout() {
        if (!confirm('¿Cerrar sesión en este dispositivo? Tus datos locales se quedan aquí, pero dejan de sincronizarse.')) return;
        await sb.auth.signOut();
        try { localStorage.removeItem(BASE_KEY); localStorage.removeItem(LAST_KEY); } catch {}
    }

    // ---------- Inicio ----------
    $('sync-btn').addEventListener('click', () => { renderModal(); $('sync-modal').classList.add('show'); });
    $('sync-close').addEventListener('click', () => $('sync-modal').classList.remove('show'));
    $('sync-login').addEventListener('submit', login);
    $('sync-now').addEventListener('click', syncNow);
    $('sync-logout').addEventListener('click', logout);

    if (!SUPABASE_URL || !SUPABASE_KEY || !window.supabase) {
        setStatus('off');
        return;
    }

    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    sb.auth.onAuthStateChange((event, session) => {
        user = session?.user || null;
        if (!user) { setStatus('out'); return; }
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') setTimeout(syncNow, 0);
    });

    document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
    window.addEventListener('online', syncNow);
    window.addEventListener('offline', () => user && setStatus('offline'));
    setInterval(() => { if (!document.hidden) syncNow(); }, 60000);
})();
