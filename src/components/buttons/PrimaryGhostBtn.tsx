import type { JSX } from "preact";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: any
}

export default function PrimaryGhostBtn(props: ButtonProps): JSX.Element {
  const { children, className } = props;

  return (
      <button 
        {...props}
        className={`ring-1 ring-primary-400/95 whitespace-nowrap focus:ring-primary-300/90 hover:ring-primary-300/80 text-left text-sm font-medium tracking-wide hover:text-slate-300/70 text-slate-300/80 scale-100 hover:scale-[99%]  flex items-center border hover:ring-inset border-primary-400/95 focus:border-primary-300/90 hover:border-primary-300/80 py-2 px-5 font-display rounded-md  hover:shadow justify-center transition-all duration-75 ease-linear hover:stroke-primary-300/80 stroke-primary-400/95 ${className ? className : ''}`}>
        {children}
      </button>
  )
}