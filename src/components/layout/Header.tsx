import { C } from '../../theme/colors';

export function Header() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(245,240,232,0.97)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}`, padding: "0 26px", height: "50px", display: "flex", alignItems: "center", gap: "24px" }}>
      {["Accueil","Compteur Dhikr","Hadith du Jour","Invocations","Qibla","Réglages"].map((item, i) => (
        <button key={item} style={{ background: "none", border: "none", cursor: "pointer", color: i === 0 ? C.green : C.textMid, fontSize: "12.5px", fontWeight: i === 0 ? 600 : 400, padding: "0 0 1px", borderBottom: i === 0 ? `2px solid ${C.gold}` : "2px solid transparent", whiteSpace: "nowrap" }}>
          {item}
        </button>
      ))}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ position: "relative" }}>
          <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "7px", padding: "5px 7px", cursor: "pointer", color: C.textMid, fontSize: "14px" }}>🔔</button>
          <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "15px", height: "15px", background: "#E74C3C", borderRadius: "50%", fontSize: "8px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>3</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "3px 10px 3px 4px", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: "20px", cursor: "pointer" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white" }}>M</div>
          <span style={{ fontSize: "12px", color: C.textDark, fontWeight: 500 }}>Bonjour, Mohamed</span>
          <span style={{ fontSize: "9px", color: C.textLight }}>▾</span>
        </div>
        <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "7px", padding: "5px 7px", cursor: "pointer", color: C.textMid, fontSize: "14px" }}>🌙</button>
      </div>
    </header>
  );
}