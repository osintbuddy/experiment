import type { JSX } from "preact";
import { ButtonProps } from "./Button";



const styles = {
  primary: "ring-primary-400/95 focus:ring-primary-300/90 hover:ring-primary-400 focus:border-primary-300/90 border-primary-400/95 hover:border-primary-400 hover:stroke-primary-400 stroke-primary-400/95",
  danger: "ring-danger-500/95 focus:ring-danger-400/90 hover:ring-danger-400/80 border-danger-500/95 focus:border-danger-400/90 hover:border-danger-400/80 stroke-danger-500/95 hover:stroke-danger-400/80"
}

export default function GhostButton(props: ButtonProps): JSX.Element {
  const { children, className, btnStyle } = props;
  return (
      <button 
        {...props}
        className={`ring-1 whitespace-nowrap  text-left text-sm font-medium tracking-wide hover:text-slate-300/70 text-slate-300/80 scale-100 hover:scale-[99%]  flex items-center border hover:ring-inset   py-2 px-5 font-display rounded-md  hover:shadow justify-center transition-all duration-75 ease-linear  ${styles[btnStyle]} ${className ? className : ''}`}>
        {children}
      </button>
  )
}