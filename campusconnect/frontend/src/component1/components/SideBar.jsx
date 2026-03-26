import { Sun, Moon, LogOut } from "lucide-react";

export default function Sidebar({
  t,
  isDark,
  toggleTheme,
  active,
  setActive,
  onLogoutClick,
  SIDEBAR_GROUPS
}) {
  return (
    <aside className={`w-64 ${t.sidebarBg} border-r ${t.sidebarBorder} transition-all duration-300 flex flex-col`}>

      {/* LOGO */}
      <div className={`h-20 flex items-center px-6 border-b ${t.sidebarFooterBorder}`}>
        <div className="h-10 w-10 bg-[#5478FF] rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-[#5478FF]/30">
          CC
        </div>
        <span className={`ml-3 font-bold tracking-tight ${t.textPrimary}`}>
          CampusConnect
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-5">
        {SIDEBAR_GROUPS.map(group => (
          <div key={group.id}>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 px-2 ${t.sidebarGroup}`}>
              {group.label}
            </p>

            {group.children.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1 text-sm font-semibold ${
                  active === item.id ? t.sidebarActive : t.sidebarItem
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div className={`p-4 border-t ${t.sidebarFooterBorder} space-y-1`}>

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${t.sidebarItem}`}
        >
          {isDark ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} />
          )}
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* LOGOUT */}
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-xl text-sm font-semibold"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}