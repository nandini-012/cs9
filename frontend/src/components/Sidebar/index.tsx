import { LayoutGrid, BookOpen, MessageSquare, MessageCircle, Settings, X } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userEmail?: string
  onLogout?: () => void
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'faq', label: 'FAQ Library', icon: BookOpen },
  { id: 'resolve', label: 'Resolve Query', icon: MessageSquare },
  { id: 'myqueries', label: 'My Queries', icon: MessageCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
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
              transition-all duration-200 hover:bg-white/75 hover:text-slate-800 hover:border-white/80"
          >
            <X size={15} />
          </button>
        </div>
        <span className="block text-[0.72rem] font-bold text-slate-500 uppercase tracking-widest mt-1">
          Lab Internship Hub
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
    </aside>
  )
}