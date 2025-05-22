import type { JSX } from "preact";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: any
}

export default function DangerGhostBtn(props: ButtonProps): JSX.Element {
  const { children, className } = props;

  return (
      <button {...props} className={`ring-1 ring-danger-500/95 whitespace-nowrap focus:ring-danger-400/90 hover:ring-danger-400/80 text-left text-sm font-medium tracking-wide hover:text-slate-300/70 text-slate-300/80 scale-100 hover:scale-[99%]  flex items-center border hover:ring-inset border-danger-500/95 focus:border-danger-400/90 hover:border-danger-400/80 py-2 px-3 font-display rounded-md  hover:shadow justify-center transition-all duration-75 ease-linear hover:stroke-danger-400/80 stroke-danger-500/95 ${className ? className : ''}`}>
        {children}
      </button>
  )
}