import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { RiArrowDownSLine, RiMailLine } from '@remixicon/react'
import { useRef, useState } from 'react'
import useBreakpoints from '../hooks/useBreakpoints'
import { Button } from '../Button'
import { Input } from '../Input'
import { Typography } from '../Typography'
import { Combobox } from './Combobox'
import styles from './Combobox.module.scss'
import type { ComboboxProps } from './Combobox.types'

const meta: Meta<typeof Combobox> = {
  title: 'UI-KIT/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    onValueChange: fn(),
    onInputValueChange: fn(),
    onClear: fn(),
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Combobox>

type Callbacks = Pick<
  ComboboxProps,
  'onValueChange' | 'onInputValueChange' | 'onClear'
>

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Japan',
  'China',
  'India',
  'Brazil',
  'Australia',
  'Mexico',
  'Russia',
  'South Korea',
]

const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
]

const programmingLanguages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'PHP',
]

const BasicCombobox = ({
  items = countries,
  ...args
}: { items?: string[] } & Callbacks) => {
  const [value, setValue] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  return (
    <div style={{ width: '300px' }}>
      <Combobox
        options={items}
        value={value}
        inputValue={inputValue}
        onValueChange={(v) => {
          setValue(v)
          setInputValue(v ?? '')
          args.onValueChange?.(v)
        }}
        onInputValueChange={(v) => {
          setInputValue(v)
          args.onInputValueChange?.(v)
        }}
        placeholder="Select an option..."
        onClear={() => {
          setValue(null)
          setInputValue('')
          args.onClear?.()
        }}
      />
    </div>
  )
}

const DisabledCombobox = (args: Callbacks) => (
  <div style={{ width: '300px' }}>
    <Combobox
      options={countries}
      placeholder="Disabled combobox"
      disabled
      onValueChange={args.onValueChange}
      onInputValueChange={args.onInputValueChange}
    />
  </div>
)

const ComboboxWithDefaultValue = (args: Callbacks) => {
  const [value, setValue] = useState<string | null>('Canada')
  const [inputValue, setInputValue] = useState('Canada')

  return (
    <div style={{ width: '300px' }}>
      <Combobox
        options={countries}
        value={value}
        inputValue={inputValue}
        onValueChange={(v) => {
          setValue(v)
          setInputValue(v ?? '')
          args.onValueChange?.(v)
        }}
        onInputValueChange={(v) => {
          setInputValue(v)
          args.onInputValueChange?.(v)
        }}
        placeholder="Select a country..."
        onClear={() => {
          setValue(null)
          setInputValue('')
          args.onClear?.()
        }}
      />
    </div>
  )
}

const ComboboxDemo = ({
  size,
  colorScheme,
  error,
  placeholder = 'Select an option...',
  ...args
}: Pick<ComboboxProps, 'size' | 'colorScheme' | 'error' | 'placeholder'> &
  Callbacks) => {
  const [value, setValue] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  return (
    <div style={{ width: '300px' }}>
      <Combobox
        options={countries}
        value={value}
        inputValue={inputValue}
        onValueChange={(v) => {
          setValue(v)
          setInputValue(v ?? '')
          args.onValueChange?.(v)
        }}
        onInputValueChange={(v) => {
          setInputValue(v)
          args.onInputValueChange?.(v)
        }}
        placeholder={placeholder}
        size={size}
        colorScheme={colorScheme}
        error={error}
        onClear={() => {
          setValue(null)
          setInputValue('')
          args.onClear?.()
        }}
      />
    </div>
  )
}

// Free-text field whose options are derived from the query instead of being a
// fixed list to pick from: the user types an email, the dropdown offers the
// popular domains and narrows them as the domain is typed. `value` mirrors
// `inputValue` so text the user never picked from the list — a pasted email —
// survives the popup closing, `forceMobile={false}` keeps the inline popup on
// mobile (the default read-only trigger + search modal would block typing) and
// `openOnFocus` reopens the list on keyboard/programmatic focus, which base-ui
// alone only does on click.
//
// The typo map below is a short demo of the pattern; the real one lives with
// the consuming screen.
const EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
]
const EMAIL_TYPOS: Record<string, string> = {
  'gmail.con': 'gmail.com',
  'gmial.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  // Past the mobile cut-off, yet its typo still resolves.
  'hotmial.com': 'hotmail.com',
  'iclould.com': 'icloud.com',
}

const EmailCombobox = (args: Callbacks) => {
  const [inputValue, setInputValue] = useState('')
  const [incomplete, setIncomplete] = useState(false)
  // Fewer suggestions on mobile, where the keyboard eats the space below.
  const { isMobile } = useBreakpoints()
  const limit = isMobile ? 3 : undefined

  const atIndex = inputValue.indexOf('@')
  const localPart = (
    atIndex === -1 ? inputValue : inputValue.slice(0, atIndex)
  ).trim()
  const domainQuery =
    atIndex === -1 ? '' : inputValue.slice(atIndex + 1).toLowerCase()
  const prefixed = EMAIL_DOMAINS.filter((d) => d.startsWith(domainQuery))
  const typo = prefixed.length ? undefined : EMAIL_TYPOS[domainQuery]
  // A detected typo is answered by the hint below, so the list stays empty.
  const options =
    localPart && !typo
      ? prefixed
          .map((domain) => `${localPart}@${domain}`)
          .filter((option) => option !== inputValue.trim())
          .slice(0, limit)
      : []

  // Bad characters are flagged while typing; an unfinished address waits for
  // blur (`incomplete`). Same split as the consuming screen.
  const badChars = /[^A-Za-z0-9.!$%&'*+/=?^_`{|}~@-]/.test(inputValue)
  const error =
    badChars || incomplete
      ? 'This does not look like an email address'
      : undefined

  // A typo is a suggestion, not an error: normal field styling, helper slot,
  // and the fix is one tap away.
  const typoHint = typo ? (
    <Typography variant="t3" color="greyscale.500">
      Did you mean{' '}
      <Typography
        component="span"
        variant="t3"
        color="blue.300"
        className={styles.inlineSuggestion}
        onClick={() => setInputValue(`${localPart}@${typo}`)}
      >
        {`${localPart}@${typo}`}
      </Typography>
      ?
    </Typography>
  ) : undefined

  return (
    <div style={{ width: '300px' }}>
      <Combobox
        className={styles.emailField}
        options={options}
        value={inputValue}
        inputValue={inputValue}
        onInputValueChange={(v) => {
          setIncomplete(false)
          setInputValue(v)
          args.onInputValueChange?.(v)
        }}
        onValueChange={(v) => {
          if (v) {
            setInputValue(v)
          }
          args.onValueChange?.(v)
        }}
        filter={null}
        forceMobile={false}
        openOnFocus
        hideTrigger
        startIcon={<RiMailLine size={16} />}
        placeholder="Your email"
        size="big"
        colorScheme="grey"
        error={!!error}
        errorText={error}
        helperText={typoHint}
        inputProps={{
          type: 'email',
          inputMode: 'email',
          autoComplete: 'email',
          onFocus: (e) => {
            // Same two resets as the app: the scrolling shell and the window.
            const shell = e.currentTarget.closest('#shell')
            shell?.scrollTo({ top: 0, behavior: 'smooth' })
            window.scrollTo({ top: 0, behavior: 'smooth' })
          },
          onBlur: () =>
            setIncomplete(!!inputValue && !/^\S+@\S+\.\S+$/.test(inputValue)),
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <BasicCombobox {...args} />,
}

// Field low inside a scrolling shell, mirroring the onboarding step: focusing
// it must bring the shell back to the top so the keyboard can't cover the field
// and its suggestions.
const EmailInScrollShell = (args: Callbacks) => (
  <div
    id="shell"
    style={{
      height: 260,
      width: 320,
      overflow: 'auto',
      border: '1px solid #E2E6EB',
    }}
  >
    <div style={{ height: 320 }} />
    <EmailCombobox {...args} />
    <div style={{ height: 320 }} />
  </div>
)

export const EmailScrollsShellOnFocus: Story = {
  render: (args) => <EmailInScrollShell {...args} />,
}

export const EmailWithDomainSuggestions: Story = {
  render: (args) => <EmailCombobox {...args} />,
}

export const ShortList: Story = {
  render: (args) => <BasicCombobox {...args} items={fruits} />,
}

export const LongList: Story = {
  render: (args) => <BasicCombobox {...args} items={programmingLanguages} />,
}

export const Disabled: Story = {
  render: (args) => <DisabledCombobox {...args} />,
}

export const WithDefaultValue: Story = {
  render: (args) => <ComboboxWithDefaultValue {...args} />,
}

export const MultipleComboboxes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <label
          style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
        >
          Select Country
        </label>
        <BasicCombobox {...args} items={countries.slice(0, 5)} />
      </div>
      <div>
        <label
          style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
        >
          Select Fruit
        </label>
        <BasicCombobox {...args} items={fruits} />
      </div>
      <div>
        <label
          style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
        >
          Select Language
        </label>
        <BasicCombobox {...args} items={programmingLanguages.slice(0, 6)} />
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          small
        </p>
        <ComboboxDemo {...args} size="small" placeholder="Small" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          medium (default)
        </p>
        <ComboboxDemo {...args} size="medium" placeholder="Medium" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          big
        </p>
        <ComboboxDemo {...args} size="big" placeholder="Big" />
      </div>
    </div>
  ),
}

export const AllColorSchemes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          grey
        </p>
        <ComboboxDemo {...args} colorScheme="grey" placeholder="Grey" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          grey-blue (default)
        </p>
        <ComboboxDemo
          {...args}
          colorScheme="grey-blue"
          placeholder="Grey-blue"
        />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          white
        </p>
        <ComboboxDemo {...args} colorScheme="white" placeholder="White" />
      </div>
      <div
        style={{ background: '#F7D6A5', padding: '16px', borderRadius: '12px' }}
      >
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#86847F' }}>
          beige
        </p>
        <ComboboxDemo {...args} colorScheme="beige" placeholder="Beige" />
      </div>
    </div>
  ),
}

export const Error: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          grey
        </p>
        <ComboboxDemo
          {...args}
          colorScheme="grey"
          error
          placeholder="Error — grey"
        />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          grey-blue
        </p>
        <ComboboxDemo
          {...args}
          colorScheme="grey-blue"
          error
          placeholder="Error — grey-blue"
        />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#919CAD' }}>
          white
        </p>
        <ComboboxDemo
          {...args}
          colorScheme="white"
          error
          placeholder="Error — white"
        />
      </div>
      <div
        style={{ background: '#F7D6A5', padding: '16px', borderRadius: '12px' }}
      >
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#86847F' }}>
          beige
        </p>
        <ComboboxDemo
          {...args}
          colorScheme="beige"
          error
          placeholder="Error — beige"
        />
      </div>
    </div>
  ),
}

const MobileModalCombobox = (args: Callbacks) => {
  const [value, setValue] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  return (
    <div style={{ width: '343px' }}>
      <Combobox
        forceMobile
        options={countries}
        value={value}
        inputValue={inputValue}
        onValueChange={(v) => {
          setValue(v)
          setInputValue(v ?? '')
          args.onValueChange?.(v)
        }}
        onInputValueChange={(v) => {
          setInputValue(v)
          args.onInputValueChange?.(v)
        }}
        placeholder="Select a country..."
        mobileLabel="Select country"
        searchPlaceholder="Search"
        emptyValue="No countries found"
        onClear={() => {
          setValue(null)
          setInputValue('')
          args.onClear?.()
        }}
      />
    </div>
  )
}

export const MobileModal: Story = {
  render: (args) => <MobileModalCombobox {...args} />,
}

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(null)
    const [inputValue, setInputValue] = useState('')

    return (
      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Selected value:</strong> {value || 'None'}
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Input value:</strong> {inputValue || 'Empty'}
          </p>
        </div>
        <Combobox
          options={countries}
          value={value}
          inputValue={inputValue}
          onValueChange={(v) => {
            setValue(v)
            setInputValue(v ?? '')
            args.onValueChange?.(v)
          }}
          onInputValueChange={(v) => {
            setInputValue(v)
            args.onInputValueChange?.(v)
          }}
          placeholder="Type to search countries..."
          emptyValue="No countries found"
          onClear={() => {
            setValue(null)
            setInputValue('')
            args.onClear?.()
          }}
        />
      </div>
    )
  },
}

const TriggerCombobox = (args: Callbacks) => {
  const [value, setValue] = useState<string | null>('Germany')
  const fieldRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ width: '300px' }}>
      <Input
        fullWidth
        size="big"
        colorScheme="grey"
        placeholder="Anything else"
        controlWrapperRef={fieldRef}
        startIcon={
          <Combobox
            options={countries}
            value={value}
            onValueChange={(v) => {
              setValue(v)
              args.onValueChange?.(v)
            }}
            mobileLabel="Select a country"
            anchor={fieldRef}
            trigger={
              <Button
                size="small"
                variant="ghost"
                colorScheme="grey"
                aria-label={`Country: ${value ?? 'not selected'}`}
              >
                {value ?? 'Country'}
                <RiArrowDownSLine size={16} />
              </Button>
            }
          />
        }
      />
    </div>
  )
}

// `trigger` embeds the combobox in another control: the popup carries its own
// search field (desktop) or opens the usual bottom-sheet (mobile), and `anchor`
// stretches it across the enclosing field instead of the small trigger.
export const CustomTrigger: Story = {
  render: (args) => <TriggerCombobox {...args} />,
}
