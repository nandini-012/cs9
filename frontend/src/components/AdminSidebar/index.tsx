import { LayoutGrid, BookOpen, MessageSquare, Award, Settings, X, LogOut } from 'lucide-react'

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  onClose: () => void
  onLogout?: () => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'queries', label: 'Queries Management', icon: MessageSquare },
  { id: 'leaderboard', label: 'Spurti Leaderboard', icon: Award },
  { id: 'faq', label: 'FAQ Management', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, onClose, onLogout }: AdminSidebarProps) {
  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-[260px] z-40 flex flex-col
        bg-white/45 backdrop-blur-[24px] saturate-[190%]
        border-r border-white/50
        shadow-[10px_0_30px_rgba(0,0,0,0.015),inset_0_1px_0_rgba(255,255,255,0.6)]
        px-5 py-9 text-slate-800
        transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:shadow-[10px_0_40px_rgba(0,0,0,0.15)]
      `}
    >
      {/* Brand */}
      <div className="mb-10 pl-1.5">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-sans font-extrabold text-lg tracking-tight text-slate-800">Vicharanashala</h2>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="w-7 h-7 rounded-full inline-flex items-center justify-center
              bg-white/45 border border-white/50 text-slate-500 cursor-pointer
              transition-all duration-200 hover:bg-white/75 hover:text-slate-800"
          >
            <X size={15} />
          </button>
        </div>
        <span className="
          inline-block mt-2 text-[0.68rem] font-extrabold uppercase tracking-widest
          text-accent bg-accent/10 px-2 py-0.5 rounded
          border border-accent/20
        ">
          Admin Control Portal
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              group flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left
              font-sans font-semibold text-sm transition-all duration-200
              ${activeTab === id
                ? 'bg-gradient-to-br from-accent to-accent-dark text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                : 'text-slate-500 hover:text-slate-800 hover:bg-accent/8'
              }
            `}
          >
            <Icon size={20} className={`flex-shrink-0 ${activeTab === id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Logout footer */}
      <div className="border-t border-slate-200/60 pt-4 mt-auto">
        <button
          onClick={onLogout}
          className="
            group flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left
            font-sans font-semibold text-sm transition-all duration-200
            text-red-500 hover:bg-red-50 hover:text-red-600
          "
        >
          <LogOut size={20} className="opacity-70 group-hover:opacity-100" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}