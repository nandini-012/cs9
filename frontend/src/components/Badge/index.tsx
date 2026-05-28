import { Award, Lock, CheckCircle, Play } from 'lucide-react'

interface BadgeProps {
  level?: 'bronze' | 'silver' | 'gold' | 'platinum'
  status?: 'locked' | 'in-progress' | 'completed'
  title?: string
  subtitle?: string
  compact?: boolean
}

const THEME = {
  bronze: { bg: 'bg-amber-800', text: '🥉 Bronze', phase: 'Phase 1' },
  silver: { bg: 'bg-slate-500', text: '🥈 Silver', phase: 'Phase 2' },
  gold: { bg: 'bg-amber-600', text: '🥇 Gold', phase: 'Phase 3' },
  platinum: { bg: 'bg-purple-700', text: '🏆 Platinum', phase: 'Phase 4' },
}

export default function Badge({ level = 'bronze', status = 'locked', title, subtitle, compact = false }: BadgeProps) {
  const theme = THEME[level]

  return (
    <div
      className={`
        relative flex flex-col p-5 rounded-2xl text-left
        bg-white/45 backdrop-blur-[20px] saturate-[190%]
        border border-white/50
        shadow-[0_10px_30px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.5)]
        transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:bg-white/55 hover:border-white/70 hover:shadow-[0_20px_48px_rgba(0,0,0,0.04)]
        hover:-translate-y-0.5
        ${status === 'locked' ? 'opacity-50 grayscale-[0.5]' : ''}
        ${status === 'in-progress' ? 'border-accent/20 bg-amber-50/55' : ''}
        ${status === 'completed' ? 'border-green-300/20 bg-green-50/45' : ''}
        ${compact ? 'p-3.5 rounded-xl min-h-[140px]' : 'min-h-[270px]'}
        sm:min-h-auto
      `}
    >
      {/* Icon */}
      <div className={`
        flex items-center justify-center rounded-full text-white mb-4 flex-shrink-0
        ${theme.bg} ${compact ? 'w-8 h-8 mb-2' : 'w-11 h-11'}
      `}>
        <Award size={compact ? 16 : 20} />
      </div>

      {/* Content */}
      <h3 className={`font-display font-bold text-slate-800 flex items-center gap-2 mb-1 ${compact ? 'text-sm' : 'text-base'}`}>
        {theme.text}
      </h3>
      <h4 className={`font-sans font-bold text-slate-800 leading-snug mb-2 ${compact ? 'text-sm' : 'text-[0.94rem]'}`}>
        {title}
      </h4>
      {!compact && (
        <p className="font-sans text-xs text-slate-500 italic leading-relaxed mb-4 flex-1">
          {subtitle}
        </p>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-slate-200/40 pt-3 mt-auto">
        <span className={`font-sans font-bold text-slate-400 uppercase tracking-wider ${compact ? 'text-[0.62rem]' : 'text-[0.7rem]'}`}>
          {theme.phase}
        </span>
        <div className={`
          inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-extrabold uppercase tracking-wide
          ${status === 'locked' ? 'text-slate-500 bg-slate-100/70 border border-slate-200/80' : ''}
          ${status === 'in-progress' ? 'text-blue-600 bg-blue-50/75 border border-blue-200/80' : ''}
          ${status === 'completed' ? 'text-green-600 bg-green-50/80 border border-green-200/85' : ''}
        `}>
          {status === 'locked' && <Lock size={10} />}
          {status === 'in-progress' && <Play size={10} className="animate-pulse" />}
          {status === 'completed' && <CheckCircle size={10} />}
          <span>{status === 'in-progress' ? 'IN PROGRESS' : status.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}