import { NAV_ITEMS } from '../../data/navItems';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../theme/colors';

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;

  return (
    <aside style={{
      width: 205,
      background: C.sidebar,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
      overflowY: "auto"
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "9px",
            background: "rgba(200,168,75,0.18)",
            border: "1.5px solid rgba(200,168,75,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            color: C.gold
          }}>✦</div>
          <div>
            <div style={{ fontSize: "19px", fontWeight: 700, color: "#FFF", letterSpacing: "0.04em", lineHeight: 1 }}>NOUR</div>
            <div style={{ fontSize: "13px", color: C.gold, fontFamily: "serif", lineHeight: 1.2 }}>نور</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "8px 0", flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 16px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                background: active ? "rgba(255,255,255,0.10)" : "transparent",
                borderLeft: `3px solid ${active ? C.gold : "transparent"}`,
                color: active ? "#FFFFFF" : C.textSidebar,
                fontSize: "12.5px",
                fontWeight: active ? 600 : 400,
              }}
            >
              <span style={{ width: "18px", textAlign: "center", flexShrink: 0, fontSize: "14px" }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Rappel du jour */}
      <div style={{ margin: "0 12px 10px", padding: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "9px", border: `1px solid ${C.sidebarBorder}` }}>
        <p style={{ margin: "0 0 5px", fontSize: "9.5px", color: C.gold, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Rappel du jour</p>
        <p style={{ margin: "0 0 5px", fontSize: "11.5px", color: "rgba(255,255,255,0.78)", fontStyle: "italic", lineHeight: 1.5 }}>
          « Allah a 99 noms, celui qui les connaît entrera au Paradis. »
        </p>
        <p style={{ margin: 0, fontSize: "10px", color: C.textSidebar }}>Sahih Muslim (2677)</p>
      </div>

      {/* Bouton don */}
      <button style={{
        margin: "0 12px 18px",
        padding: "8px",
        background: "rgba(255,255,255,0.07)",
        border: `1px solid ${C.sidebarBorder}`,
        borderRadius: "8px",
        color: C.textSidebar,
        fontSize: "11.5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px"
      }}>
        🤍 Faire un don
      </button>
    </aside>
  );
}