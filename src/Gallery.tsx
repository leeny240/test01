import { useState, type ReactNode } from 'react'
import {
  Avatar,
  Button,
  DecisionCard,
  DetectedItem,
  ICON_NAMES,
  Icon,
  IconButton,
  InputField,
  NavItem,
  Option,
  OptionGroup,
  StatCard,
  StatusChip,
  StepBadge,
  Tile,
  Toggle,
  UploadDropzone,
  UsageMeter,
  type PreviewState,
} from './components'

type Mode = 'desktop' | 'mobile'
const BUTTON_STATES: { label: string; state?: PreviewState; disabled?: boolean }[] = [
  { label: 'Default' },
  { label: 'Hover', state: 'hover' },
  { label: 'Pressed', state: 'pressed' },
  { label: 'Focus', state: 'focus' },
  { label: 'Disabled', disabled: true },
]

function Section({ index, title, description, children }: { index: number; title: string; description: string; children: ReactNode }) {
  return (
    <section className="gallery-section">
      <header>
        <h2>
          {index} · {title}
        </h2>
        <p>{description}</p>
      </header>
      {children}
    </section>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="gallery-panel">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="gallery-labeled">
      <span>{label}</span>
      {children}
    </div>
  )
}

export default function Gallery() {
  const [mode, setMode] = useState<Mode>(() =>
    new URLSearchParams(window.location.search).get('mode') === 'mobile' ? 'mobile' : 'desktop',
  )
  const [usage, setUsage] = useState<'Often' | 'Sometimes' | 'Rarely'>('Often')
  const [lead, setLead] = useState<'D-7' | 'D-3' | 'D-1'>('D-3')
  const [alertOn, setAlertOn] = useState(true)
  const [push, setPush] = useState(true)
  const [selected, setSelected] = useState('chatgpt')

  return (
    <div className="gallery" data-mode={mode}>
      <header className="gallery-header">
        <div>
          <p className="gallery-eyebrow">
            SubNote Design System · <a href="#">← Back to prototype</a>
          </p>
          <h1>Components</h1>
          <p className="gallery-sub">Generated from Figma variables (tokens/tokens.json → src/styles/tokens.css). Hover, press and focus are live.</p>
        </div>
        <div className="gallery-mode" role="radiogroup" aria-label="Token mode">
          {(['desktop', 'mobile'] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)}>
              {m === 'desktop' ? 'Desktop mode' : 'Mobile mode'}
            </button>
          ))}
        </div>
      </header>

      <Section index={1} title="Button" description="Variant × Size × State — height, radius and icon size follow the token mode.">
        <Panel title="State matrix">
          <div className="state-matrix" style={{ gridTemplateColumns: `140px repeat(${BUTTON_STATES.length}, minmax(0, 1fr))` }}>
            <span />
            {BUTTON_STATES.map((s) => (
              <span key={s.label} className="state-matrix__head">
                {s.label}
              </span>
            ))}
            {(['primary', 'secondary'] as const).flatMap((variant) =>
              (['md', 'sm'] as const).map((size) => (
                <div key={variant + size} className="state-matrix__row">
                  <span className="state-matrix__label">
                    {variant === 'primary' ? 'Primary' : 'Secondary'} · {size.toUpperCase()}
                  </span>
                  {BUTTON_STATES.map((s) => (
                    <span key={s.label}>
                      <Button variant={variant} size={size} icon="Upload" previewState={s.state} disabled={s.disabled}>
                        Button
                      </Button>
                    </span>
                  ))}
                </div>
              )),
            )}
          </div>
        </Panel>
        <Panel title="In use">
          <div className="gallery-row">
            <Button icon="Upload">Upload</Button>
            <Button variant="secondary" icon="Pencil">
              Enter manually
            </Button>
            <Button variant="secondary" size="sm">
              Skip
            </Button>
            <Button size="sm" icon="ArrowRight" iconPosition="end">
              Save &amp; next subscription
            </Button>
          </div>
        </Panel>
      </Section>

      <Section index={2} title="Input" description="Input Field · Option · Toggle — states use color/input/*, color/option/*, color/toggle/*.">
        <Panel title="Input Field · State matrix">
          <div className="gallery-grid gallery-grid--fields">
            <Labeled label="Default">
              <InputField label="Amount (original)" defaultValue="$20.00 USD" />
            </Labeled>
            <Labeled label="Hover">
              <InputField label="Amount (original)" defaultValue="$20.00 USD" previewState="hover" />
            </Labeled>
            <Labeled label="Focus">
              <InputField label="Amount (original)" defaultValue="$20.00 USD" previewState="focus" />
            </Labeled>
            <Labeled label="Read-only">
              <InputField label="In KRW" defaultValue="≈ ₩28,240" readOnly />
            </Labeled>
            <Labeled label="Disabled">
              <InputField label="Amount (original)" defaultValue="$20.00 USD" disabled />
            </Labeled>
            <Labeled label="Error">
              <InputField label="Amount (original)" defaultValue="$20.00 USD" error="Enter a valid amount" />
            </Labeled>
          </div>
        </Panel>
        <Panel title="Option · State matrix">
          <div className="gallery-row">
            <Labeled label="Default">
              <Option>Often</Option>
            </Labeled>
            <Labeled label="Hover">
              <Option previewState="hover">Often</Option>
            </Labeled>
            <Labeled label="Selected">
              <Option selected>Often</Option>
            </Labeled>
            <Labeled label="Disabled">
              <Option disabled>Often</Option>
            </Labeled>
          </div>
        </Panel>
        <Panel title="Interactive">
          <div className="gallery-stack">
            <OptionGroup label="Usage" options={['Often', 'Sometimes', 'Rarely'] as const} value={usage} onChange={setUsage} />
            <div className="gallery-row">
              <Toggle checked={alertOn} onChange={setAlertOn} label="Pre-payment alert" />
              <span className="gallery-note">Pre-payment alert {alertOn ? 'on' : 'off'}</span>
            </div>
            <OptionGroup label="Alert timing" options={['D-7', 'D-3', 'D-1'] as const} value={lead} onChange={setLead} disabled={!alertOn} />
          </div>
        </Panel>
      </Section>

      <Section index={3} title="Dashboard Widgets" description="Built from Tile, Status Chip and Step Badge.">
        <div className="gallery-grid gallery-grid--widgets">
          <Panel title="Stat Card">
            <div className="gallery-row gallery-row--top">
              <StatCard label="Total this month" value="₩93,320" delta="+₩3,620 vs last month" />
              <StatCard label="Subscriptions" value="7" delta="No change vs last month" trend="flat" />
            </div>
          </Panel>
          <Panel title="Detected Item">
            <div className="gallery-stack">
              {[
                { id: 'chatgpt', letter: 'C', name: 'ChatGPT Plus', price: '$20.00 ≈ ₩28,240' },
                { id: 'notion', letter: 'N', name: 'Notion', price: '$10.00 ≈ ₩14,120' },
                { id: 'medium', letter: 'M', name: 'Medium', price: '$5.00 ≈ ₩7,060' },
              ].map((s) => (
                <DetectedItem key={s.id} {...s} state={selected === s.id ? 'selected' : 'default'} onClick={() => setSelected(s.id)} />
              ))}
              <DetectedItem letter="Y" name="YouTube Premium" price="₩14,900" state="saved" />
            </div>
          </Panel>
          <Panel title="Decision Card">
            <div className="gallery-row gallery-row--top">
              <DecisionCard type="today" alert="Alert · Sun, Oct 11" name="Netflix" charges="Charges Oct 14 · ₩17,000" />
              <DecisionCard type="scheduled" alert="Alert · Tue, Oct 13" name="Spotify" charges="Charges Oct 16 · ₩10,900" />
              <DecisionCard type="new" alert="Alert · Wed, Oct 21" name="ChatGPT Plus" charges="Charges Oct 24 · ≈ ₩28,240" />
            </div>
          </Panel>
          <Panel title="Usage Meter">
            <div className="gallery-stack">
              <UsageMeter level="High" />
              <UsageMeter level="Medium" />
              <UsageMeter level="Low" />
            </div>
          </Panel>
          <Panel title="Upload Dropzone">
            <div className="gallery-row gallery-row--top">
              <UploadDropzone />
              <UploadDropzone previewDragOver />
            </div>
          </Panel>
        </div>
      </Section>

      <Section index={4} title="Icons" description="Lucide style · stroke uses currentColor · size follows --size-icon.">
        <div className="icon-grid">
          {ICON_NAMES.map((name) => (
            <div key={name} className="icon-grid__cell">
              <Icon name={name} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section index={5} title="Elements" description="Status Chip · Step Badge · Tile · Avatar · Icon Button · Nav Item">
        <div className="gallery-grid gallery-grid--widgets">
          <Panel title="Status Chip">
            <div className="gallery-row">
              <StatusChip tone="neutral">Deciding</StatusChip>
              <StatusChip tone="muted">Queued</StatusChip>
              <StatusChip tone="accent">Just added</StatusChip>
              <StatusChip tone="success">Recognized</StatusChip>
              <StatusChip tone="ink">Decide today</StatusChip>
              <StatusChip tone="subtle" showDot={false}>
                Email
              </StatusChip>
              <StatusChip as="button" tone={push ? 'accent' : 'subtle'} showDot={push} pressed={push} onClick={() => setPush(!push)}>
                Mobile push (click)
              </StatusChip>
            </div>
          </Panel>
          <Panel title="Step Badge · Tile · Avatar · Icon Button">
            <div className="gallery-row">
              <StepBadge step={1} />
              <StepBadge step={2} />
              <Tile letter="C" />
              <Tile letter="C" size="md" />
              <Avatar type="workspace" initials="S" />
              <Avatar initials="AK" />
              <IconButton icon="Bell" label="Notifications" />
              <IconButton icon="More" label="More" previewState="hover" />
            </div>
          </Panel>
          <Panel title="Nav Item">
            <nav className="gallery-nav" aria-label="Example navigation">
              <NavItem label="Home" icon="Home" />
              <NavItem label="What Changed" icon="TrendingUp" previewHover />
              <NavItem label="Decision Alerts" icon="Bell" badge={1} />
              <NavItem label="Add Subscription" icon="PlusSquare" active />
              <NavItem label="Settings" icon="Settings" />
            </nav>
          </Panel>
        </div>
      </Section>
    </div>
  )
}
