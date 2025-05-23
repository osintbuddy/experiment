import type { JSX, ComponentChildren } from "preact";

export type ButtonStyle = "primary" | "danger"

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren,
  btnStyle: ButtonStyle
}

const styles = {
  primary: "ring-primary-400/95 hover:ring-primary-400/80 bg-primary-400/95 hover:bg-primary-400/80 focus:bg-primary-400/90",
  danger: "ring-danger-500/95 hover:ring-danger-400/80 bg-danger-500/95 hover:bg-danger-400/80 focus:bg-danger-400/90"
}

export default function PrimaryBtn(props: ButtonProps): JSX.Element {
  const { children, className, btnStyle } = props;

  return (
      <button
        {...props}
        className={`ring-1 whitespace-nowrap text-left text-sm font-medium tracking-wide  flex scale-100 hover:scale-[99%] items-center hover:ring-inset py-2 px-5 font-display rounded-md  hover:shadow justify-center transition-all duration-75 ease-linear text-slate-200/90 hover:text-slate-200 group ${styles[btnStyle]} ${className ?? ''}`}
      >
        {children}
      </button>
  )
}