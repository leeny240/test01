import { useState } from 'react'
import { StatusChip, StepBadge, Tile, type ChipTone, type DotColor } from './elements'

// Figma: Stat Card — Trend (Up, Flat)
export function StatCard({ label, value, delta, trend = 'up' }: { label: string; value: string; delta: string; trend?: 'up' | 'flat' }) {
  return (
    <section className="stat-card">
      <p className="text-caption-regular stat-card__label">{label}</p>
      <p className="text-display-bold">{value}</p>
      <p className={`stat-card__delta stat-card__delta--${trend} text-caption-sm-medium`}>
        <span className="stat-card__dot" />
        {delta}
      </p>
    </section>
  )
}

const DETECTED_CHIP = {
  default: { tone: 'muted', label: 'Queued' },
  selected: { tone: 'neutral', label: 'Deciding' },
  saved: { tone: 'success', label: 'Saved' },
} as const

// Figma: Detected Item — State (Default, Selected, Saved)
export function DetectedItem({
  letter,
  name,
  price,
  state = 'default',
  onClick,
}: {
  letter: string
  name: string
  price: string
  state?: 'default' | 'selected' | 'saved'
  onClick?: () => void
}) {
  const chip = DETECTED_CHIP[state]
  return (
    <button type="button" className="detected-item" data-state={state} aria-current={state === 'selected'} onClick={onClick}>
      <Tile letter={letter} />
      <span className="detected-item__text">
        <span className="text-body-medium">{name}</span>
        <span className="text-caption-regular detected-item__price">{price}</span>
      </span>
      <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
    </button>
  )
}

const DECISION_CHIP: Record<'today' | 'scheduled' | 'new', { tone: ChipTone; label: string; dot?: DotColor }> = {
  today: { tone: 'ink', label: 'Decide today' },
  scheduled: { tone: 'neutral', label: 'Scheduled', dot: 'success' },
  new: { tone: 'accent', label: 'Just added' },
}

// Figma: Decision Card — Type (Today, Scheduled, Just added)
export function DecisionCard({
  type,
  alert,
  name,
  charges,
}: {
  type: 'today' | 'scheduled' | 'new'
  alert: string
  name: string
  charges: string
}) {
  const chip = DECISION_CHIP[type]
  return (
    <article className="decision-card" data-type={type}>
      <span className="text-caption-sm-regular decision-card__alert">{alert}</span>
      <span className="text-title-md-bold">{name}</span>
      <span className="text-caption-regular decision-card__charges">{charges}</span>
      <StatusChip tone={chip.tone} dot={chip.dot}>
        {chip.label}
      </StatusChip>
    </article>
  )
}

const USAGE_FILLED = { High: 28, Medium: 16, Low: 6 } as const
const USAGE_BARS = 36

// Figma: Usage Meter — Level (High, Medium, Low)
export function UsageMeter({ level }: { level: keyof typeof USAGE_FILLED }) {
  return (
    <div className="usage-meter" role="meter" aria-label="Usage" aria-valuetext={level}>
      <span className="text-caption-sm-regular usage-meter__label">Usage</span>
      <span className="usage-meter__bars" aria-hidden="true">
        {Array.from({ length: USAGE_BARS }, (_, i) => (
          <span key={i} className={i < USAGE_FILLED[level] ? 'usage-meter__bar is-on' : 'usage-meter__bar'} />
        ))}
      </span>
      <span className="text-caption-semibold">{level}</span>
    </div>
  )
}

// Figma: Upload Dropzone — State (Default, Drag over)
export function UploadDropzone({ onFiles, previewDragOver }: { onFiles?: (files: FileList) => void; previewDragOver?: boolean }) {
  const [dragging, setDragging] = useState(false)
  return (
    <label
      className="dropzone"
      data-state={dragging || previewDragOver ? 'drag-over' : undefined}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (e.dataTransfer.files.length) onFiles?.(e.dataTransfer.files)
      }}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        className="visually-hidden"
        onChange={(e) => e.target.files?.length && onFiles?.(e.target.files)}
      />
      <span className="dropzone__step text-caption-sm-regular">
        <StepBadge step={1} />
        Upload
      </span>
      <span className="dropzone__art" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="text-body-lg-semibold">Drop your screenshots here</span>
      <span className="text-caption-sm-regular dropzone__caption">Payment texts · Receipts · App Store screens</span>
    </label>
  )
}
