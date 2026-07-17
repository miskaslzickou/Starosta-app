import { app as s, Menu as N, BrowserWindow as $, powerMonitor as E, Tray as I, ipcMain as c, dialog as _, Notification as b } from "electron";
import { fileURLToPath as R } from "node:url";
import n from "fs";
import l from "node:path";
const p = l.join(s.getPath("userData"), "projects.json"), h = l.join(s.getPath("userData"), "vehicles.json"), v = l.join(s.getPath("userData"), "buildings.json"), y = l.join(s.getPath("userData"), "smlouvy.json"), g = l.join(s.getPath("userData"), "usneseni.json"), m = l.join(s.getPath("userData"), "settings.json");
N.setApplicationMenu(null);
s.requestSingleInstanceLock() || s.quit();
s.on("second-instance", () => {
  o && (o.isMinimized() && o.restore(), o.show(), o.focus());
});
const F = l.dirname(R(import.meta.url)), S = /* @__PURE__ */ new Set();
function k() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function M() {
  return n.existsSync(p) ? JSON.parse(n.readFileSync(p, "utf-8")) : [];
}
function U(e) {
  n.writeFileSync(p, JSON.stringify(e, null, 2));
}
function V() {
  return n.existsSync(h) ? JSON.parse(n.readFileSync(h, "utf-8")) : [];
}
function L(e) {
  n.writeFileSync(h, JSON.stringify(e, null, 2));
}
function A() {
  return n.existsSync(v) ? JSON.parse(n.readFileSync(v, "utf-8")) : [];
}
function B(e) {
  n.writeFileSync(v, JSON.stringify(e, null, 2));
}
function C() {
  return n.existsSync(y) ? JSON.parse(n.readFileSync(y, "utf-8")) : [];
}
function q(e) {
  n.writeFileSync(y, JSON.stringify(e, null, 2));
}
function W() {
  return n.existsSync(g) ? JSON.parse(n.readFileSync(g, "utf-8")) : [];
}
function K(e) {
  n.writeFileSync(g, JSON.stringify(e, null, 2));
}
function Q() {
  return n.existsSync(m) ? JSON.parse(n.readFileSync(m, "utf-8")) : null;
}
function Z(e) {
  n.writeFileSync(m, JSON.stringify(e, null, 2));
}
async function G(e) {
  const { filePath: i, canceled: t } = await _.showSaveDialog(e, {
    title: "Exportovat zálohu",
    defaultPath: `zaloha-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`,
    filters: [{ name: "JSON záloha", extensions: ["json"] }]
  });
  if (t || !i) return { success: !1 };
  const u = {}, r = {
    projects: p,
    vehicles: h,
    buildings: v,
    smlouvy: y,
    usneseni: g,
    settings: m
  };
  for (const [a, d] of Object.entries(r))
    u[a] = n.existsSync(d) ? JSON.parse(n.readFileSync(d, "utf-8")) : [];
  return n.writeFileSync(i, JSON.stringify(u, null, 2)), { success: !0 };
}
async function H(e) {
  const { filePaths: i, canceled: t } = await _.showOpenDialog(e, {
    title: "Importovat zálohu",
    filters: [{ name: "JSON záloha", extensions: ["json"] }],
    properties: ["openFile"]
  });
  if (t || !i[0]) return { success: !1 };
  const u = JSON.parse(n.readFileSync(i[0], "utf-8")), r = {
    projects: p,
    vehicles: h,
    buildings: v,
    smlouvy: y,
    usneseni: g,
    settings: m
  };
  for (const [a, d] of Object.entries(r))
    u[a] !== void 0 && n.writeFileSync(d, JSON.stringify(u[a], null, 2));
  return { success: !0 };
}
const X = {
  projekt: "Projekt",
  vyberoveRizeni: "Výběrové řízení",
  dotace: "Dotace",
  zhotovitel: "Zhotovitel"
};
function Y() {
  if (!n.existsSync(h)) return;
  const e = JSON.parse(n.readFileSync(h, "utf-8")), i = /* @__PURE__ */ new Date();
  e.forEach((t) => {
    const u = [
      { field: "technicka", title: "STK – Brzy vyprší" },
      { field: "pojisteni", title: "Vozidlo – Pojištění" }
    ];
    for (const { field: r, title: a } of u) {
      if (!t[r] || !t.upozorneni) continue;
      const d = new Date(t[r]), f = `${t.id}-${r}-${k()}`, w = d.getTime() - i.getTime();
      if (w <= t.upozorneni && w > -864e5 * 30 && !S.has(f)) {
        S.add(f);
        let O;
        if (r === "technicka") {
          const D = Math.round(Math.abs(w) / 864e5);
          O = w >= 0 ? `${t.nazev} (${t.spz}) – za ${D} dní` : `${t.nazev} (${t.spz}) – vypršela před ${D} dny`;
        } else
          O = `${t.nazev} (${t.spz})`;
        new b({ title: a, body: O }).show();
      }
    }
  });
}
function ee() {
  if (!n.existsSync(y)) return;
  const e = JSON.parse(n.readFileSync(y, "utf-8")), i = /* @__PURE__ */ new Date();
  e.forEach((t) => {
    if (!t.datumUkonceni || !t.upozorneni) return;
    const u = new Date(t.datumUkonceni), r = `smlouva-${t.id}-ukonceni-${k()}`, a = u.getTime() - i.getTime();
    if (a <= t.upozorneni && a > -864e5 * 30 && !S.has(r)) {
      S.add(r);
      const d = Math.round(Math.abs(a) / 864e5), f = a >= 0 ? `${t.najemnik} – za ${d} dní` : `${t.najemnik} – vypršela před ${d} dny`;
      new b({ title: "Smlouva – Blíží se ukončení", body: f }).show();
    }
  });
}
function ne() {
  if (!n.existsSync(p)) return;
  const e = JSON.parse(n.readFileSync(p, "utf-8")), i = /* @__PURE__ */ new Date();
  e.forEach((t) => {
    var u;
    for (const r of ["projekt", "vyberoveRizeni", "dotace", "zhotovitel"]) {
      const a = (u = t[r]) == null ? void 0 : u.terminy;
      if (!(a != null && a.upozorneni)) continue;
      const d = new Date(a.upozorneni), f = `${t.id}-${r}-${a.upozorneni}-${k()}`;
      i >= d && !S.has(f) && (S.add(f), new b({
        title: `Upozornění – ${X[r]}`,
        body: `${t.nazev}`
      }).show());
    }
  });
}
process.env.APP_ROOT = l.join(F, "..");
const z = process.env.VITE_DEV_SERVER_URL, ae = l.join(process.env.APP_ROOT, "dist-electron"), J = l.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = z ? l.join(process.env.APP_ROOT, "public") : J;
let T = !1, o;
function x() {
  o = new $({
    icon: l.join(process.env.VITE_PUBLIC, process.platform === "win32" ? "logo.ico" : "logo.png"),
    webPreferences: {
      preload: l.join(F, "preload.mjs")
    }
  }), o.on("close", (e) => {
    T || (e.preventDefault(), o == null || o.hide());
  }), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), z ? o.loadURL(z) : o.loadFile(l.join(J, "index.html")), c.handle("load-projects", () => M()), c.handle("save-projects", (e, i) => U(i)), c.handle("load-vehicles", () => V()), c.handle("save-vehicles", (e, i) => L(i)), c.handle("load-buildings", () => A()), c.handle("save-buildings", (e, i) => B(i)), c.handle("load-smlouvy", () => C()), c.handle("save-smlouvy", (e, i) => q(i)), c.handle("load-usneseni", () => W()), c.handle("save-usneseni", (e, i) => K(i)), c.handle("load-settings", () => Q()), c.handle("save-settings", (e, i) => Z(i)), c.handle("export-data", () => G(o)), c.handle("import-data", () => H(o)), c.handle("relaunch", () => {
    s.relaunch(), s.exit();
  });
}
s.on("window-all-closed", () => {
  process.platform !== "darwin" && (s.quit(), o = null);
});
s.on("activate", () => {
  $.getAllWindows().length === 0 && x();
});
let j = null;
function P() {
  ne(), Y(), ee();
}
s.whenReady().then(() => {
  s.setLoginItemSettings({ openAtLogin: !0 }), x(), P(), setInterval(P, 2 * 60 * 1e3), E.on("resume", P), j = new I(l.join(process.env.VITE_PUBLIC, process.platform === "win32" ? "logo.ico" : "logo.png")), j.setToolTip("Stavební povolení"), j.setContextMenu(N.buildFromTemplate([
    { label: "Otevřít", click: () => o == null ? void 0 : o.show() },
    { label: "Ukončit", click: () => s.quit() }
  ])), j.on("click", () => o == null ? void 0 : o.show());
});
s.setAppUserModelId("Starosta - Databáze věcí");
s.on("before-quit", () => {
  T = !0;
});
export {
  ae as MAIN_DIST,
  J as RENDERER_DIST,
  z as VITE_DEV_SERVER_URL,
  G as exportData,
  H as importData,
  A as loadBuildings,
  M as loadProjects,
  Q as loadSettings,
  C as loadSmlouvy,
  W as loadUsneseni,
  V as loadVehicles,
  B as saveBuildings,
  U as saveProjects,
  Z as saveSettings,
  q as saveSmlouvy,
  K as saveUsneseni,
  L as saveVehicles
};
