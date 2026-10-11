import { useMemo, useRef, useState } from 'react'
import {
  Avatar,
  Button,
  DecisionCard,
  DetectedItem,
  Icon,
  IconButton,
  InputField,
  NavItem,
  OptionGroup,
  StatusChip,
  StepBadge,
  Tile,
  Toggle,
  UploadDropzone,
  UsageMeter,
} from '../components'
import { TODAY, detectedSubscriptions, scheduledDecisions } from '../data'
import { formatKrw, formatLongDate, formatShortDate, formatUsd, formatWeekdayDate, subtractDays } from '../format'

const USAGE = ['Often', 'Sometimes', 'Rarely'] as const
const LEADS = ['D-7', 'D-3', 'D-1'] as const
const CHANNELS = ['Mobile push', 'Email', 'Browser'] as const
type Usage = (typeof USAGE)[number]
type Lead = (typeof LEADS)[number]
type Channel = (typeof CHANNELS)[number]
type Status = 'deciding' | 'queued' | 'saved' | 'skipped'
type Decision = { usage: Usage; alertOn: boolean; lead: Lead; channels: Channel[] }

const LEAD_DAYS: Record<Lead, number> = { 'D-7': 7, 'D-3': 3, 'D-1': 1 }
const USAGE_LEVEL = { Often: 'High', Sometimes: 'Medium', Rarely: 'Low' } as const
const NAV = [
  { label: 'Home', icon: 'Home' },
  { label: 'What Changed', icon: 'TrendingUp' },
  { label: 'Decision Alerts', icon: 'Bell', badge: 1 },
  { label: 'Add Subscription', icon: 'PlusSquare', active: true },
  { label: 'Settings', icon: 'Settings' },
] as const

export default function AddSubscription() {
  const subs = detectedSubscriptions
  const [selectedId, setSelectedId] = useState(subs[0].id)
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(subs.map((s, i) => [s.id, i === 0 ? 'deciding' : 'queued'])),
  )
  const [decisions, setDecisions] = useState<Record<string, Decision>>(() =>
    Object.fromEntries(subs.map((s) => [s.id, { usage: 'Often', alertOn: true, lead: 'D-3', channels: ['Mobile push'] }])),
  )
  const [toast, setToast] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const firstField = useRef<HTMLInputElement>(null)

  const index = subs.findIndex((s) => s.id === selectedId)
  const sub = subs[index]
  const decision = decisions[sub.id]
  const done = subs.every((s) => statuses[s.id] === 'saved' || statuses[s.id] === 'skipped')
  const alertDateOf = (id: string) => {
    const s = subs.find((x) => x.id === id)!
    return subtractDays(s.nextPayment, LEAD_DAYS[decisions[id].lead])
  }

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }
  const update = (patch: Partial<Decision>) => setDecisions((prev) => ({ ...prev, [sub.id]: { ...prev[sub.id], ...patch } }))
  const toggleChannel = (c: Channel) =>
    update({ channels: decision.channels.includes(c) ? decision.channels.filter((x) => x !== c) : [...decision.channels, c] })
  const select = (id: string) => {
    setSelectedId(id)
    setStatuses((prev) => ({ ...prev, [id]: prev[id] === 'saved' ? 'saved' : 'deciding' }))
  }
  const advance = (result: 'saved' | 'skipped') => {
    const next = subs.find((s) => s.id !== sub.id && statuses[s.id] === 'queued')
    setStatuses((prev) => ({ ...prev, [sub.id]: result }))
    if (result === 'saved') flash(decision.alertOn ? `${sub.name} saved · we'll ask on ${formatWeekdayDate(alertDateOf(sub.id))}` : `${sub.name} saved`)
    if (next) select(next.id)
  }

  const upcoming = useMemo(() => {
    const added = subs
      .filter((s) => (s.id === selectedId || statuses[s.id] === 'saved') && decisions[s.id].alertOn)
      .map((s) => ({ name: s.name, alertDate: alertDateOf(s.id), chargeDate: s.nextPayment, amount: `≈ ${formatKrw(s.krw)}`, added: true }))
    const names = new Set(added.map((a) => a.name))
    return [...scheduledDecisions.filter((d) => !names.has(d.name)).map((d) => ({ ...d, added: false })), ...added].sort((a, b) =>
      a.alertDate.localeCompare(b.alertDate),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisions, selectedId, statuses])

  const fields = [
    { label: 'Amount (original)', value: `${formatUsd(sub.usd)} USD` },
    { label: 'In KRW', value: `≈ ${formatKrw(sub.krw)}`, readOnly: true },
    { label: 'Billing cycle', value: sub.cycle },
    { label: 'Next payment', value: formatWeekdayDate(sub.nextPayment) },
    { label: 'Paid via', value: sub.paidVia },
  ]
  const positionLabel = done ? 'All reviewed' : `${index + 1} / ${subs.length} in progress`

  return (
    <div className="proto">
      <aside className="proto-sidebar">
        <button type="button" className="proto-workspace">
          <Avatar type="workspace" initials="S" />
          <span className="proto-workspace__text">
            <span className="text-micro-regular proto-subtle">Personal</span>
            <span className="text-body-sm-semibold">SubNote</span>
          </span>
          <Icon name="ChevronsUpDown" className="proto-muted-icon" />
        </button>
        <nav className="proto-nav" aria-label="Main">
          {NAV.map((n) => (
            <NavItem key={n.label} label={n.label} icon={n.icon} active={'active' in n} badge={'badge' in n ? n.badge : undefined} />
          ))}
        </nav>
        <div className="proto-privacy">
          <span className="proto-privacy__badge text-caption-semibold">
            <Icon name="Lock" />
            Private by design
          </span>
          <p className="text-body-semibold">No card or bank link needed</p>
          <p className="text-caption-sm-regular proto-subtle">Add by screenshot or type it in</p>
        </div>
      </aside>

      <div className="proto-main">
        <header className="proto-topbar">
          <span className="proto-appbar-brand">
            <Avatar type="workspace" initials="S" />
            <span className="text-body-semibold">SubNote</span>
          </span>
          <label className="proto-search">
            <Icon name="Search" />
            <input className="text-body-sm-regular" type="search" placeholder="Search..." aria-label="Search" />
            <kbd className="text-micro-medium">⌘ K</kbd>
          </label>
          <IconButton icon="Search" label="Search" className="proto-search-button" />
          <IconButton icon="Bell" label="Notifications" />
          <Avatar initials="AK" />
        </header>

        <main className="proto-content">
          <div className="proto-header">
            <div>
              <p className="text-body-sm-regular proto-subtle">{formatLongDate(TODAY)}</p>
              <h1 className="text-display-bold">Add Subscription · First Decision</h1>
              <p className="text-caption-regular proto-subtle">Add it from a screenshot and set when we'll check in before you're charged.</p>
            </div>
            <div className="proto-header__actions">
              <StatusChip tone="success">No card or bank linking</StatusChip>
              <Button icon="Upload" onClick={() => fileInput.current?.click()}>
                Upload
              </Button>
              <Button variant="secondary" icon="Pencil" onClick={() => firstField.current?.focus()}>
                Enter manually
              </Button>
            </div>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => e.target.files?.length && flash(`${e.target.files.length} screenshot(s) received — prototype uses sample data`)}
          />

          <div className="proto-grid">
            <div className="proto-side">
              <section className="proto-card proto-card--upload">
                <UploadDropzone onFiles={(f) => flash(`${f.length} screenshot(s) received — prototype uses sample data`)} />
              </section>
              <section className="proto-card">
                <header className="proto-card__header">
                  <h2 className="text-title-md-medium">
                    Detected <span className="proto-faint">{subs.length}</span>
                  </h2>
                  <span className="text-caption-regular proto-subtle">{positionLabel}</span>
                </header>
                <div className="proto-list">
                  {subs.map((s) => (
                    <DetectedItem
                      key={s.id}
                      letter={s.letter}
                      name={s.name}
                      price={`${formatUsd(s.usd)} ≈ ${formatKrw(s.krw)}`}
                      state={s.id === selectedId && !done ? 'selected' : statuses[s.id] === 'saved' ? 'saved' : 'default'}
                      onClick={() => select(s.id)}
                    />
                  ))}
                </div>
              </section>
            </div>

            <section className="proto-card proto-review" aria-label={`Review ${sub.name}`}>
              <header className="proto-card__header proto-review__header">
                <Tile letter={sub.letter} size="md" />
                <div className="proto-review__title">
                  <div className="proto-review__name">
                    <h2 className="text-title-lg-semibold">{sub.name}</h2>
                    <StatusChip tone="success">Recognized</StatusChip>
                  </div>
                  <p className="text-caption-regular proto-subtle">Read from your screenshot · Fix anything that looks off</p>
                </div>
                <IconButton icon="More" label="More actions" />
              </header>

              <div className="proto-review__body">
                <div className="proto-fields">
                  {fields.map((f, i) => (
                    <InputField
                      key={`${sub.id}-${f.label}`}
                      ref={i === 0 ? firstField : undefined}
                      label={f.label}
                      defaultValue={f.value}
                      readOnly={f.readOnly}
                      className={i === fields.length - 1 ? 'proto-fields__wide' : undefined}
                    />
                  ))}
                </div>

                <div className="proto-panels">
                  <section className="proto-panel" aria-labelledby="self-check">
                    <header className="proto-panel__header">
                      <StepBadge step={2} />
                      <h3 id="self-check" className="text-title-sm-semibold">
                        How often do you use it lately?
                      </h3>
                    </header>
                    <p className="text-caption-sm-regular proto-subtle">Check once now — we'll compare it in your pre-payment alert.</p>
                    <OptionGroup label="Usage" options={USAGE} value={decision.usage} onChange={(usage) => update({ usage })} />
                    <UsageMeter level={USAGE_LEVEL[decision.usage]} />
                  </section>

                  <section className="proto-panel" aria-labelledby="alert">
                    <header className="proto-panel__header">
                      <StepBadge step={3} />
                      <h3 id="alert" className="text-title-sm-semibold">
                        Pre-payment alert
                      </h3>
                      <Toggle checked={decision.alertOn} onChange={(alertOn) => update({ alertOn })} label="Pre-payment alert" />
                    </header>
                    <OptionGroup label="Alert timing" options={LEADS} value={decision.lead} onChange={(lead) => update({ lead })} disabled={!decision.alertOn} />
                    <div className="proto-chips">
                      {CHANNELS.map((c) => {
                        const on = decision.channels.includes(c)
                        return (
                          <StatusChip key={c} as="button" tone={on ? 'accent' : 'subtle'} showDot={on} pressed={on} onClick={() => toggleChannel(c)}>
                            {c}
                          </StatusChip>
                        )
                      })}
                    </div>
                    <p className="text-caption-regular proto-muted">
                      {decision.alertOn ? (
                        <>
                          We'll ask "Keep paying?" on <strong className="proto-strong">{formatWeekdayDate(alertDateOf(sub.id))}</strong>.
                        </>
                      ) : (
                        'Pre-payment alert is off for this subscription.'
                      )}
                    </p>
                  </section>
                </div>

                <div className="proto-actions">
                  <Button variant="secondary" size="sm" onClick={() => advance('skipped')} disabled={done}>
                    Skip
                  </Button>
                  <Button size="sm" icon="ArrowRight" iconPosition="end" onClick={() => advance('saved')} disabled={done}>
                    {done ? 'All set' : 'Save & next subscription'}
                  </Button>
                </div>
              </div>
            </section>
          </div>

          <section className="proto-card">
            <header className="proto-card__header">
              <div className="proto-inline">
                <StepBadge step={4} />
                <h2 className="text-section-semibold">Upcoming Decisions</h2>
              </div>
              <span className="text-body-sm-regular proto-subtle">Alert day → Payment day</span>
            </header>
            <div className="proto-decisions">
              {upcoming.map((d) => (
                <DecisionCard
                  key={d.name}
                  type={d.added ? 'new' : d.alertDate === TODAY ? 'today' : 'scheduled'}
                  alert={`Alert · ${formatWeekdayDate(d.alertDate)}`}
                  name={d.name}
                  charges={`Charges ${formatShortDate(d.chargeDate)} · ${d.amount}`}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      {toast && (
        <div className="proto-toast text-body-sm-medium" role="status">
          <Icon name="Check" />
          {toast}
        </div>
      )}
      <a className="proto-gallery-link text-caption-semibold" href="#components">
        View components
      </a>
    </div>
  )
}
