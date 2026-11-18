/* ============ CookieConsent: drop this block into any site ============ */
const CookieConsent = (() => {
  const CONFIG = {
    cookieName: "cookie_consent",
    version: 1,            // bump to ask everyone again after a policy change
    days: 180,
    categories: [
      { id: "necessary",   label: "Essential",   desc: "Keeps the site secure and remembers this choice. Always on.", locked: true },
      { id: "preferences", label: "Preferences", desc: "Remembers settings such as language or theme." },
      { id: "analytics",   label: "Analytics",   desc: "Shows us which pages are used so we can improve them." },
      { id: "marketing",   label: "Marketing",   desc: "Used to show relevant offers on this and other sites." }
    ]
  };
  const $ = s => document.querySelector(s);
  const listeners = [];
  let state = null, lastFocus = null;

  /* storage */
  function read() {
    const m = document.cookie.split("; ").find(r => r.startsWith(CONFIG.cookieName + "="));
    if (!m) return null;
    try {
      const d = JSON.parse(decodeURIComponent(m.split("=").slice(1).join("=")));
      return d.v === CONFIG.version ? d : null;
    } catch { return null; }
  }
  function write(choices) {
    state = { v: CONFIG.version, t: new Date().toISOString(), ...choices, necessary: true };
    const exp = new Date(Date.now() + CONFIG.days * 864e5).toUTCString();
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONFIG.cookieName}=${encodeURIComponent(JSON.stringify(state))}; expires=${exp}; path=/; SameSite=Lax${secure}`;
  }
  function clear() {
    document.cookie = `${CONFIG.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    state = null;
  }

  /* choices */
  const all = value => Object.fromEntries(CONFIG.categories.map(c => [c.id, c.locked ? true : value]));
  const allowed = cat => !!(state && state[cat]);

  /* run blocked scripts once their category is allowed */
  function activateScripts() {
    document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(old => {
      if (!allowed(old.dataset.consent) || old.dataset.done) return;
      const s = document.createElement("script");
      [...old.attributes].forEach(a => { if (a.name !== "type") s.setAttribute(a.name, a.value); });
      s.text = old.text;
      old.dataset.done = "1";
      old.after(s);
    });
  }

  function emit() {
    activateScripts();
    listeners.forEach(fn => { try { fn({ ...state }); } catch (e) { console.error(e); } });
  }

  /* UI */
  function buildList() {
    $("#cc-list").innerHTML = CONFIG.categories.map(c => `
      <li class="cc-item">
        <div><strong>${c.label}</strong><span>${c.desc}</span></div>
        <label class="cc-switch">
          <input type="checkbox" data-cat="${c.id}" ${c.locked ? "checked disabled" : ""} aria-label="${c.label} cookies">
          <i></i>
        </label>
      </li>`).join("");
  }
  function syncSwitches() {
    document.querySelectorAll("#cc-list input").forEach(i => {
      i.checked = i.disabled ? true : !!(state && state[i.dataset.cat]);
    });
  }
  function readSwitches() {
    const out = {};
    document.querySelectorAll("#cc-list input").forEach(i => out[i.dataset.cat] = i.checked);
    return out;
  }
  function showBanner(show) { $("#cc-banner").hidden = !show; }
  function openPrefs() {
    lastFocus = document.activeElement;
    syncSwitches();
    $("#cc-dialog").showModal();
  }
  function closePrefs() {
    const d = $("#cc-dialog");
    if (d.open) d.close();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function commit(choices) {
    write(choices);
    showBanner(false);
    closePrefs();
    emit();
  }

  function init() {
    buildList();
    document.addEventListener("click", e => {
      const act = e.target.closest("[data-cc]")?.dataset.cc;
      if (!act) return;
      if (act === "accept") commit(all(true));
      else if (act === "reject") commit(all(false));
      else if (act === "save") commit(readSwitches());
      else if (act === "open") openPrefs();
    });
    $("#cc-dialog").addEventListener("click", e => { if (e.target.id === "cc-dialog") closePrefs(); });

    state = read();
    if (state) emit(); else showBanner(true);
  }

  return {
    init,
    open: openPrefs,
    reset() { clear(); showBanner(true); emit(); },
    get: () => (state ? { ...state } : null),
    allowed,
    categories: CONFIG.categories,
    onChange(fn) { listeners.push(fn); if (state) fn({ ...state }); }
  };
})();
/* ======================== end CookieConsent ========================= */
