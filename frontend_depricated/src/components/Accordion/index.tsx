import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  id: string
  question: string
  answer: string
}

interface AccordionProps {
  faq: FaqItem
  isOpen: boolean
  onToggle: () => void
  searchQuery?: string
}

export default function Accordion({ faq, isOpen, onToggle, searchQuery }: AccordionProps) {
  const getHighlightedContent = (html: string, query: string) => {
    if (!query?.trim()) return html
    const escaped = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
    return html.replace(new RegExp(`(?![^<>]*>)(${escaped})`, 'gi'), '<mark class="bg-yellow-200/50 border-b-2 border-amber-400/50 text-slate-800 px-0.5 rounded-sm">$1</mark>')
  }

  const getHighlightedText = (text: string, query: string) => {
    if (!query?.trim()) return text
    const escaped = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
    return text.split(new RegExp(`(${escaped})`, 'gi')).map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-yellow-200/50 border-b-2 border-amber-400/50 text-slate-800 px-0.5 rounded-sm">{part}</mark>
        : part
    )
  }

  return (
    <div
      id={faq.id}
      className={`
        relative rounded-2xl border border-white/45 border-l-4 border-l-transparent
        bg-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.01),inset_0_1px_0_rgba(255,255,255,0.4)]
        transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:border-white/60 hover:bg-white/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.025),inset_0_1.5px_0.5px_rgba(255,255,255,0.5)]
        hover:-translate-y-0.5 hover:scale-[1.008]
        ${isOpen ? 'open border-l-accent bg-white/35 border-white/60 shadow-[0_20px_40px_rgba(160,90,44,0.04),inset_0_1px_0_rgba(255,255,255,0.5)]' : ''}
      `}
    >
      {/* Trigger Row */}
      <div className="relative flex items-center justify-between gap-6 min-h-[70px] px-4 py-3">
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex-1 text-left cursor-pointer bg-transparent border-none text-slate-800 font-sans font-semibold text-[1.02rem] leading-relaxed transition-colors duration-200 hover:text-accent p-0"
        >
          {getHighlightedText(faq.question, searchQuery || '')}
        </button>

        <div className="flex-shrink-0">
          <button
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
            aria-expanded={isOpen}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              bg-white/35 border border-white/50 text-slate-400
              transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              hover:text-accent hover:bg-white/65 hover:border-white/80 hover:scale-110
            `}
          >
            <ChevronDown
              size={18}
              className={`transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-180 scale-110 text-accent' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`
              px-4 text-slate-500 text-sm leading-relaxed font-sans
              opacity-0 -translate-y-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
              prose prose-sm max-w-none
              [[&_p]:mt-3_[&_p:first-child]:mt-0 [&_p]:mb-3]
              [[&_ul]:mt-3_[&_ol]:mt-3 [&_li]:mt-1 [&_ul]:pl-5]
              [[&_hr]:border-t-border [&_hr]:my-5]
              ${isOpen ? '!opacity-100 !translate-y-0 !pb-4' : ''}
            `}
            dangerouslySetInnerHTML={{ __html: getHighlightedContent(faq.answer, searchQuery || '') }}
          />
        </div>
      </div>
    </div>
  )
}