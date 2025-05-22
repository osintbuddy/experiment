import { FolderIcon } from '@heroicons/react/20/solid';

import type { JSX } from "preact";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  onBtnClick: Function
}

export default function DirectoryInput(props: InputProps) {
  const { onBtnClick } = props;

  return (
    <div className="flex relative w-full ">
      <input
        type="text"
        class="hover:border-primary border border-slate-900 bg-mirage-300/20 w-full transition-colors duration-150 px-2 rounded-l border-r-0  outline-1 outline-slate-900 focus:outline-2 focus:outline-primary py-1 -mr-0.5 focus:bg-mirage-900 text-slate-300/80"
        {...props}
      />
      <button
        onClick={() => onBtnClick()}
        title="Select directory" 
        className="inset-ring-1 inset-ring-primary-400/95 whitespace-nowrap focus:ring-primary-300/90 hover:inset-ring-primary-400 text-left text-sm font-medium tracking-wide scale-100 hover:scale-[99%]  flex items-center border-2 border-primary-400/95 focus:border-primary-300/90 hover:border-primary-400 px-5 font-display  hover:shadow justify-center transition-all duration-75 ease-linear  rounded-xs text-slate-400 hover:text-slate-300/70 hover:scale-105 group"
      >
        <FolderIcon className="h-5 text-slate-400/80 group-hover:text-slate-300/70 group-hover:rotate-5 rotate-0 absolute left-2.5 top-[5px]" />
      </button>
    </div>
  )
}
