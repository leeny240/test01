import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type Ref } from 'react'
import { Icon, type IconName } from './Icon'

/** Forces a pseudo state for documentation (hover / pressed / focus). Real interaction works without it. */
export type PreviewState = 'hover' | 'pressed' | 'focus'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  icon?: IconName
  iconPosition?: 'start' | 'end'
  previewState?: PreviewState
}

// Figma: Button — Variant × Size × State (Default, Hover, Pressed, Focus, Disabled)
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  previewState,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const iconNode = icon && <Icon name={icon} />
  return (
    <button
      type="button"
      className={`button button--${variant} button--${size} ${className}`}
      data-state={previewState}
      {...rest}
    >
      {iconPosition === 'start' && iconNode}
      <span>{children}</span>
      {iconPosition === 'end' && iconNode}
    </button>
  )
}

// Figma: Icon Button — State (Default, Hover)
export function IconButton({
  icon,
  label,
  previewState,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string; previewState?: PreviewState }) {
  return (
    <button type="button" className={`icon-button ${className}`} aria-label={label} data-state={previewState} {...rest}>
      <Icon name={icon} />
    </button>
  )
}

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  ref?: Ref<HTMLInputElement>
  label: string
  showLabel?: boolean
  error?: string
  previewState?: PreviewState
}

// Figma: Input Field — State (Default, Hover, Focus, Read-only, Disabled, Error)
export function InputField({ label, showLabel = true, error, previewState, className = '', ...rest }: InputFieldProps) {
  const id = useId()
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className={`field__label text-caption-sm-regular ${showLabel ? '' : 'visually-hidden'}`}>
        {label}
      </label>
      <input
        id={id}
        className="field__input text-body-regular"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        data-state={previewState}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="field__error text-caption-sm-regular">
          {error}
        </p>
      )}
    </div>
  )
}

// Figma: Option — State (Default, Hover, Selected, Disabled)
export function Option({
  selected,
  previewState,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; previewState?: PreviewState }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={!!selected}
      className={`option ${selected ? 'text-body-sm-medium' : 'text-body-sm-regular'}`}
      data-state={previewState}
      {...rest}
    >
      {children}
    </button>
  )
}

export function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}) {
  return (
    <div className="option-group" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <Option key={option} selected={option === value} disabled={disabled} onClick={() => onChange(option)}>
          {option}
        </Option>
      ))}
    </div>
  )
}

// Figma: Toggle — On (True, False)
export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className="toggle"
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__knob" />
    </button>
  )
}
