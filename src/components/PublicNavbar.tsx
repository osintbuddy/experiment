import { Link } from 'react-router-dom';
import { useEffect, useState } from 'preact/hooks';
import classNames from 'classnames';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Icon } from './Icons.tsx';
import Logo from '../assets/images/logo.svg';
import { JSX } from 'preact/jsx-runtime';

const themes = [
  { name: 'Light', value: 'light', icon: LightIcon },
  { name: 'Dark', value: 'dark', icon: DarkIcon },
  { name: 'System', value: 'system', icon: SystemIcon },
]

function LightIcon(props: any) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 1a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0V1Zm4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm2.657-5.657a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Zm-1.415 11.313-.707-.707a1 1 0 0 1 1.415-1.415l.707.708a1 1 0 0 1-1.415 1.414ZM16 7.999a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1ZM7 14a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm-2.536-2.464a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Zm0-8.486A1 1 0 0 1 3.05 4.464l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707ZM3 8a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Z"
      />
    </svg>
  )
}

function DarkIcon(props: any) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.23 3.333C7.757 2.905 7.68 2 7 2a6 6 0 1 0 0 12c.68 0 .758-.905.23-1.332A5.989 5.989 0 0 1 5 8c0-1.885.87-3.568 2.23-4.668ZM12 5a1 1 0 0 1 1 1 1 1 0 0 0 1 1 1 1 0 1 1 0 2 1 1 0 0 0-1 1 1 1 0 1 1-2 0 1 1 0 0 0-1-1 1 1 0 1 1 0-2 1 1 0 0 0 1-1 1 1 0 0 1 1-1Z"
      />
    </svg>
  )
}

function SystemIcon(props: any) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-1.5l.31 1.242c.084.333.36.573.63.808.091.08.182.158.264.24A1 1 0 0 1 11 15H5a1 1 0 0 1-.704-1.71c.082-.082.173-.16.264-.24.27-.235.546-.475.63-.808L5.5 11H4a3 3 0 0 1-3-3V4Zm3-1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z"
      />
    </svg>
  )
}

interface Props {
  active?: boolean
  selected: boolean
}

export function ThemeSelector(props: any) {
  let [selectedTheme, setSelectedTheme] = useState()

  useEffect(() => {
    if (selectedTheme) {
      // @ts-ignore
      document.documentElement.setAttribute('data-theme', selectedTheme.value)
    } else {
      setSelectedTheme(
        // @ts-ignore
        themes.find((theme) => theme.value === document.documentElement.getAttribute('data-theme')))
    }
  }, [selectedTheme])

  useEffect(() => {
    let handler = () =>

      setSelectedTheme(
        // @ts-ignore
        themes.find((theme) => theme.value === (window.localStorage.theme ?? 'system')))

    window.addEventListener('storage', handler)

    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <Listbox
      as="div"
      value={selectedTheme}
      onChange={setSelectedTheme}
      {...props}
    >
      <Label className="sr-only">Theme</Label>
      <ListboxButton
        className="flex h-6 w-6 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
      >
        <LightIcon className="hidden h-4 w-4 fill-sky-400 [[data-theme=light]_&]:block" />
        <DarkIcon className="hidden h-4 w-4 fill-sky-400 [[data-theme=dark]_&]:block" />
        <LightIcon className="hidden h-4 w-4 fill-slate-400 [:not(.dark)[data-theme=system]_&]:block" />
        <DarkIcon className="hidden h-4 w-4 fill-slate-400 [.dark[data-theme=system]_&]:block" />
      </ListboxButton>
      <ListboxOptions className="absolute top-full left-1/2 mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5">
        {themes.map((theme) => (
          <ListboxOption
            key={theme.value}
            value={theme}
            className={({ active, selected }: Props) =>
              classNames(
                'flex cursor-pointer select-none items-center rounded-[0.625rem] p-1',
                {
                  'text-sky-500': selected,
                  'text-slate-900 dark:text-white': active && !selected,
                  'text-slate-700 dark:text-slate-400': !active && !selected,
                  'bg-slate-100 dark:bg-slate-900/40': active,
                }
              )
            }
          >
            {({ selected }: Props) => (
              <>
                <div className="rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5">
                  <theme.icon
                    className={classNames(
                      'h-4 w-4',
                      selected
                        ? 'fill-sky-400 dark:fill-sky-400'
                        : 'fill-slate-400'
                    )}
                  />
                </div>
                <div className="ml-3">{theme.name}</div>
              </>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

export default function PublicNavbar(): JSX.Element {
  let [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={classNames(
        'absolute w-full  bottom-3 z-50 flex sm:flex-wrap items-end justify-between flex-nowrap shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none px-4',
        isScrolled
          ? 'dark:bg-slate-800/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
          : 'dark:bg-transparent'
      )}
    >
      <div className="relative flex flex-grow basis-0 items-center">
        <Link to="/" replace>
          <img className="hidden h-10 fill-slate-600 lg:block" src={Logo} />
        </Link>
      </div>
      <div className="ml-auto relative flex  basis-0 justify-end mr-2 gap-6 sm:gap-8 md:flex-grow">
        <a
          title="OSINTBuddy on Discord"
          href="https://discord.gg/gsbbYHA3K3"
          className="group"
          aria-label="Discord"
        >
          <Icon icon="brand-discord" className="h-6 w-6 transition-colors duration-150 ease-in-out text-slate-500 hover:text-slate-300 focus:text-slate-300" />
        </a>
      </div>
      <div className="relative flex mr-2 ">
        <a
          title="OSINTBuddy on Matrix"
          href="https://todooooooooooo.com"
          className="group"
          aria-label="Matrix"
        >
          <Icon icon="brand-matrix" className="h-6 w-6 transition-colors duration-150 ease-in-out text-slate-500 hover:text-slate-300 focus:text-slate-300" />
        </a>
      </div>
      <div className="relative flex mr-2 ">
        <a
          title="OSINTBuddy on Codeberg"
          href="https://codeberg.org/osintbuddy"
          className="group"
          aria-label="Codeberg"
        >
          <Icon icon="brand-git" className="h-6 w-6 transition-colors duration-150 ease-in-out text-slate-500 hover:text-slate-300 focus:text-slate-300" />
        </a>
      </div>
      <div className="relative flex justify-end">
        <a
          title="OSINTBuddy on Github"
          href="https://github.com/jerlendds/osintbuddy"
          className="group"
          aria-label="GitHub"
        >
          <Icon icon="brand-github" className="h-6 w-6 transition-colors duration-150 ease-in-out text-slate-500 hover:text-slate-300 focus:text-slate-300" />
        </a>
      </div>
    </header>
  );
}
