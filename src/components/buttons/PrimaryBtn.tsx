import type { JSX } from "preact";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: any
}

export default function PrimaryBtn(props: ButtonProps): JSX.Element {
  const { children, className } = props;

  return (
      <button {...props} className={`ring-1 ring-primary-400/95 hover:ring-primary-300/80 whitespace-nowrap text-left text-sm font-medium tracking-wide  flex scale-100 hover:scale-[99%] items-center hover:ring-inset bg-primary-400/95 hover:bg-primary-300/80 focus:bg-primary-300/90 py-2 px-5 font-display rounded-md  hover:shadow justify-center transition-all duration-75 ease-linear text-slate-200/90 hover:text-slate-200 ${className ? className : ''}`}>
        {children}
      </button>
  )
}