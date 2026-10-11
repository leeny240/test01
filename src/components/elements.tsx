import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type ChipTone = 'neutral' | 'muted' | 'accent' | 'success' | 'ink' | 'subtle'
export type DotColor = 'accent' | 'neutral' | 'success' | 'warning'

const TONE_DOT: Record<ChipTone, DotColor> = {
  neutral: 'accent',
  muted: 'neutral',
  accent: 'accent',
  success: 'success',
  ink: 'warning',
  subtle: 'neutral',
}

// Figma: Status Chip — Tone (Neutral, Muted, Accent, Success, Ink, Subtle)
export function StatusChip({
  tone = 'neutral',
  showDot = true,
  dot,
  children,
  as = 'span',
  pressed,
  onClick,
}: {
  tone?: ChipTone
  showDot?: boolean
  /** Overrides the tone's default dot color (e.g. Neutral chip with a green dot for "Scheduled"). */
  dot?: DotColor
  children: ReactNode
  as?: 'span' | 'button'
  pressed?: boolean
  onClick?: () => void
}) {
  const content = (
    <>
      {showDot && <span className={`chip__dot chip__dot--${dot ?? TONE_DOT[tone]}`} />}
      {children}
    </>
  )
  const className = `chip chip--${tone} text-caption-sm-medium`
  return as === 'button' ? (
    <button type="button" className={className} aria-pressed={pressed} onClick={onClick}>
      {content}
    </button>
  ) : (
    <span className={className}>{content}</span>
  )
}

// Figma: Step Badge
export function StepBadge({ step }: { step: number | string }) {
  return <span className="step-badge text-micro-bold">{step}</span>
}

// Figma: Tile — Size (SM, MD)
export function Tile({ letter, size = 'sm' }: { letter: string; size?: 'sm' | 'md' }) {
  return (
    <span className={`tile tile--${size} ${size === 'md' ? 'text-title-lg-semibold' : 'text-body-semibold'}`}>
      {letter}
    </span>
  )
}

// Figma: Avatar — Type (Workspace, User)
export function Avatar({ initials, type = 'user' }: { initials: string; type?: 'workspace' | 'user' }) {
  return (
    <span
      className={`avatar avatar--${type} ${type === 'workspace' ? 'text-body-semibold' : 'text-body-sm-semibold'}`}
    >
      {initials}
    </span>
  )
}

// Figma: Nav Item — State (Default, Hover, Active), optional count badge
export function NavItem({
  label,
  icon,
  active,
  badge,
  href = '#',
  previewHover,
}: {
  label: string
  icon: IconName
  active?: boolean
  badge?: number | string
  href?: string
  previewHover?: boolean
}) {
  return (
    <a
      href={href}
      className={`nav-item ${active ? 'text-body-semibold' : 'text-body-regular'}`}
      aria-current={active ? 'page' : undefined}
      data-state={previewHover ? 'hover' : undefined}
    >
      <Icon name={icon} />
      <span className="nav-item__label">{label}</span>
      {badge !== undefined && <span className="nav-item__badge text-micro-medium">{badge}</span>}
    </a>
  )
}
