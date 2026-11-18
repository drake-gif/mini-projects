/* Demo wiring: connects the page to CookieConsent */
function renderStatus(c) {
  const rows = CookieConsent.categories.map(cat => {
    const on = c ? !!c[cat.id] : cat.locked;
    return `<tr><td>${cat.label}</td><td class="${on ? "on" : "off"}">${on ? "Allowed" : "Blocked"}</td></tr>`;
  });
  document.getElementById("status").innerHTML = rows.join("");
}
CookieConsent.onChange(renderStatus);
document.getElementById("open-prefs").onclick = () => CookieConsent.open();
document.getElementById("reset").onclick = () => { CookieConsent.reset(); renderStatus(null); };
renderStatus(CookieConsent.get());
CookieConsent.init();
