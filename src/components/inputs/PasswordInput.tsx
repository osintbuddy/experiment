import { useState } from "preact/hooks";

import type { JSX } from "preact";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

interface PasswordInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export default function PasswordInput(props: PasswordInputProps) {
  const [hidePassword, setHidePassword] = useState<"text" | "password">("password")
  const { type: _, className } = props;

  return (
    <div className="flex relative">
      <input
        {...props}
        type={hidePassword}
        className={` hover:border-primary border  border-slate-800 focus:bg-mirage-900/60 from-mirage-300/20 to-mirage-400/20 bg-linear-to-br transition-colors duration-150 px-2 rounded outline-1 outline-slate-900 focus:outline-2  focus:outline-primary py-1 border-r-none w-64 ${className ?? ''}`}
      />
      <button
        className=" text-slate-600 w-0"
        onClick={() => setHidePassword(hidePassword === "password" ? "text" : "password") }>
        {
          hidePassword === "password" 
            ? <EyeIcon className="h-5 relative -left-7 scale-100 hover:scale-110 rotate-0 hover:rotate-5" /> 
            : <EyeSlashIcon className="h-5 relative -left-7 rotate-0 hover:rotate-5 scale-100 hover:scale-110" />
        }
      </button>
    </div>
  )
}