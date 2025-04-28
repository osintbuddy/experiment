import { LockClosedIcon, QuestionMarkCircleIcon, ExclamationTriangleIcon, KeyIcon, FolderIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { open } from '@tauri-apps/plugin-dialog';
import { useEffect, useState } from "preact/hooks";
import { LazyStore } from '@tauri-apps/plugin-store';
import { invoke } from "@tauri-apps/api/core";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'


function DatabaseOption({ name, mtime }: any) {
  const [password, setPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<"text" | "password">("password")

  return (
    <li className="text-slate-400 px-4 h-15  relative border-slate-900 bg-mirage-300/20 hover:bg-mirage-300/30 transition-colors duration-150 ease-in-out hover:bg-mirage-4000/25 border-y py-1.5 flex items-center justify-between">
      <h3 class="text-slate-400 w-52 text-lg relative top-2"><span class="text-sm text-slate-600 absolute -top-4 -left-0.5">Filename</span>{name}
      </h3>
      <h3 class="text-slate-400 w-64 text-lg relative top-2"><span class="text-sm text-slate-600 absolute -top-4 -left-0.5">Modified</span>25 Apr, 2025 12:46AM
      </h3>
      <div className="relative flex">
        <input onInput={(e) => setPassword(e.currentTarget.value)} type={hidePassword} class="mr-4 -top-4 hover:border-primary border w-64 border-slate-800 focus:bg-mirage-900/60 from-mirage-300/20 to-mirage-400/20 bg-linear-to-br not-last-of-type:text-lg transition-colors duration-150 px-3 rounded outline-1 outline-slate-900 focus:outline-2  focus:outline-primary py-1 border-r-none" placeholder="Your password" value={password} />
        <button onClick={() => hidePassword === 'password' ? setHidePassword("text") : setHidePassword("password")}>
          {hidePassword === "password" ? <EyeIcon className="h-5 text-slate-600 right-6 absolute top-1.5" /> : <EyeSlashIcon className="h-5 text-slate-600 right-6 absolute top-1.5" />}
        </button>
      </div>
      <button className="btn-primary mb-0.5">
        Unlock
        <KeyIcon />
      </button>
    </li>
  )
}

export default function LandingPage() {
  const store = new LazyStore(".settings.json");

  let [isOpen, setIsOpen] = useState<boolean>(false)
  const [venvValue, setVenvValue] = useState<string>("");
  const [pluginsValue, setPluginsValue] = useState<string>("");

  const [databases, setDatabases] = useState<any[]>([]);

  useEffect(() => {
    async function doOnce() {
      let venvPath: string | undefined = await store.get("venv_path")
      if (venvPath) setVenvValue(venvPath)
      let pluginsPath: string | undefined = await store.get("plugins_path")
      if (pluginsPath) setPluginsValue(pluginsPath)
      let dbs: any[] | undefined = await invoke("ls_dbs")
      if (dbs) setDatabases(dbs)
    }
    doOnce()

  }, [])

  const [createPassword, setCreatePassword] = useState<string>("");

  return (
    <>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center bg-gray-900/80 backdrop-blur-lg justify-center p-4">
          <DialogPanel className="flex flex-col bg-gray-600/95   rounded-lg shadow-sm shadow-gray-600/60 py-10 px-15">
            <DialogTitle className="text-slate-300 font-bold text-lg my-1">Create database</DialogTitle>
            <Description className="text-slate-300 mb-14">This will create an encrypted database, set a <br />password to keep your data safe</Description>
            <h3 class="text-slate-400 text-lg relative w-full mb-6"><span class="text-sm text-slate-600 absolute -top-6 -left-0.5">Password</span>
              <input value={createPassword} onInput={(e) => setCreatePassword(e.currentTarget.value)} type="password" class="hover:border-primary border border-slate-900 focus:bg-mirage-900/60 bg-mirage-300/20 w-full transition-colors duration-150 px-2 rounded outline-1 outline-slate-900 text-slate-300/80 focus:outline-2 focus:stroke-primary focus:outline-primary py-1" placeholder="Your password" />
            </h3><div className="flex gap-4 self-end">
              <button className="btn-danger" onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="btn-primary-solid mb-0.5" onClick={() => setIsOpen(false)}>Create</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <main className="mt-40 flex items-center w-full flex-col h-full relative ">

        <section className="flex flex-col bg-gray-700/55 backdrop-blur-sm rounded-lg shadow-sm shadow-gray-600/60 py-6 p-10 min-w-[60rem]">
          <div className="flex justify-between mb-6">
            <h2 className="text-slate-300/90 text-2xl mr-64 font-display border-b-4 border-b-primary pr-2 relative">
              Databases
              <QuestionMarkCircleIcon title="todo" className="h-5 text-slate-600 -top-1 absolute -right-4" />
            </h2>
            <div className="flex">
              <button onClick={() => setIsOpen(true)} className="btn-primary-solid">
                Create database
                <LockClosedIcon />
              </button>
            </div>
          </div>
          <ul className="pb-6 h-64 flex flex-col  justify-start ">
            {databases && databases?.length == 0 ? (
              <li className="text-slate-400 px-4 h-full border-slate-900 rounded-md bg-mirage-400/20 hover:bg-mirage-4000/25 border-y py-4 flex items-end relative">
                <h3 class="text-slate-600 text-lg">No databases found.
                  <ExclamationTriangleIcon className="h-6 bottom-4 mr-3 right-0 absolute text-slate-600/70" />
                </h3>
              </li>
            ) : databases.map((db) => 
              <DatabaseOption name={db.name.split('/').slice(-1)} mtime={db.mtime} />
            )}
          </ul>
          <hr className="pt-6 text-mirage-400/60" />
          <div className="flex justify-between">
            <h2 className="text-slate-300/90 text-2xl relative font-display border-b-4 border-b-primary pr-2 ">
              Local Plugins
              <QuestionMarkCircleIcon title="todo" className="h-5 absolute -top-2 -right-3 text-slate-600" />
            </h2>
          </div>
          <ul>
            <li className="text-slate-300/90 flex flex-col pt-6">
              <h3 class="font-display  mb-2">Python Virtual Environment Path</h3>
              <div className="flex relative">
                <div className="flex relative w-full">
                  <input value={venvValue} type="text" class="hover:border-primary border border-slate-900 focus:bg-mirage-900/60 bg-mirage-300/20 w-full transition-colors duration-150 px-2 rounded outline-1 outline-slate-900 text-slate-300/80 focus:outline-2 focus:stroke-primary focus:outline-primary py-1" placeholder="./Your python folder/.../" />
                  <button onClick={async () => {
                    const venvDirectory = await open({
                      multiple: false,
                      directory: true,
                    });
                    if (venvDirectory) {
                      await store.set("venv_path", venvDirectory)
                      setVenvValue(venvDirectory)
                    }
                  }} class="btn-primary rounded-xs! text-slate-400 hover:text-slate-300/70 ">
                    <FolderIcon title="Select directory" className="h-5 text-slate-400/80 absolute -left-1.5 top-1.5" /> </button>
                </div>
                <QuestionMarkCircleIcon title="todo" className="h-5 text-slate-600 -top-7 absolute right-0" />
              </div>
            </li>
            <li className="text-slate-300/90 flex flex-col pt-5">
              <h3 class="font-display mb-2">Entity Plugins Path</h3>
              <div className="flex relative">
                <div className="flex relative w-full">
                  <input type="text" class="hover:border-primary border border-slate-900 bg-mirage-300/20 w-full transition-colors duration-150 px-2 rounded outline-1 outline-slate-900 focus:outline-2 focus:stroke-primary focus:outline-primary py-1 focus:bg-mirage-900 text-slate-300/80" placeholder="./Your plugins folder/.../" value={pluginsValue} />
                  <button onClick={async () => {
                    const pluginDirectory = await open({
                      multiple: false,
                      directory: true,
                    });
                    if (pluginDirectory) {
                      await store.set("plugins_path", pluginDirectory)
                      setPluginsValue(pluginDirectory)
                    }
                  }} className="btn-primary rounded-xs! text-slate-400 hover:text-slate-300/70 ">
                    <FolderIcon title="Select directory" className="h-5 text-slate-400/80 absolute  -left-1.5 top-1.5" />
                  </button>

                </div>
                <QuestionMarkCircleIcon title="todo" className="h-5 text-slate-600 -top-7 absolute right-0" />
              </div>
            </li>
          </ul>
        </section>

      </main>
    </>
  )
}