import { LockClosedIcon, QuestionMarkCircleIcon, ExclamationTriangleIcon, KeyIcon, EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/20/solid";
import { open } from '@tauri-apps/plugin-dialog';
import { useEffect, useState } from "preact/hooks";
import { LazyStore } from '@tauri-apps/plugin-store';
import { invoke } from "@tauri-apps/api/core";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import DirectoryInput from "../components/inputs/DirectoryInput";
import Button from "../components/buttons/Button";
import GhostButton from "../components/buttons/GhostButton";
import { useMountEffect } from "../app/hooks";


interface DatabaseOptionProps {
  filename: string
  mtime: string
  setShowDeleteDialog: Function
  setActiveFilename: Function
}

function DatabaseOption({ filename, mtime, setShowDeleteDialog, setActiveFilename }: DatabaseOptionProps) {
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState<"text" | "password">("password")

  return (
    <li className="text-slate-400 px-4 h-15  relative border-slate-900 bg-mirage-300/20 hover:bg-mirage-300/15 transition-colors duration-150 ease-in-out hover:bg-mirage-4000/25 border-y py-1.5 flex items-center justify-between">
      <button
        onClick={() => {
          setShowDeleteDialog(true)
          setActiveFilename(filename)
        }}
        className="hover:rotate-5 rotate-0 self-end mb-2"
      >
        <TrashIcon className="btn-icon !mx-0 !mr-3 text-danger-500/60 scale-100 hover:scale-105 hover:text-danger-500" />
      </button>
      <h3 class="text-slate-400 w-52 text-lg relative top-2"><span class="text-sm text-slate-600 absolute -top-4 -left-0.5">Filename</span>{filename.split("/").pop()}
      </h3>
      <h3 class="text-slate-400 w-64 text-lg relative top-2"><span class="text-sm text-slate-600 absolute -top-4 -left-0.5">Modified</span>{mtime}
      </h3>
      <div className="relative flex">
        <input
          onInput={(e) => setPassword(e.currentTarget.value)}
          type={hidePassword}
          class="mr-4 -top-4 hover:border-primary border w-64 border-slate-800 focus:bg-mirage-900/60 from-mirage-300/20 to-mirage-400/20 bg-linear-to-br not-last-of-type:text-lg transition-colors duration-150 px-3 rounded outline-1 outline-slate-900 focus:outline-2  focus:outline-primary py-1 border-r-none"
          placeholder="Your password"
          value={password}
        />
        <button onClick={() => hidePassword === 'password' ? setHidePassword("text") : setHidePassword("password")}>
          {hidePassword === "password" ? <EyeIcon className="h-5 text-slate-600 right-6 absolute top-1.5" /> : <EyeSlashIcon className="h-5 text-slate-600 right-6 absolute top-1.5" />}
        </button>
      </div>
      <GhostButton btnStyle="primary" onClick={() => invoke("unlock_db", { filename, password })}>
        Unlock
        <KeyIcon className="btn-icon" />
      </GhostButton>
    </li>
  )
}

export default function DatabasesPage() {
  const store = new LazyStore(".settings.json");

  let [showCreateDialog, setShowCreateDialog] = useState(false)
  let [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [venvValue, setVenvValue] = useState("");
  const [pluginsValue, setPluginsValue] = useState("");

  const [databases, setDatabases] = useState([]);

  const refreshDbList = () => invoke("ls_dbs").then((dbs: object[]) => {
    setDatabases(dbs)
  })

  useMountEffect(() => {
    store.get("venv_path").then((venvPath: string) => setVenvValue(venvPath))
    store.get("plugins_path").then((pluginsPath: string) => setPluginsValue(pluginsPath))
    refreshDbList()
  })
  
  const [createPassword, setCreatePassword] = useState("")
  const [createFilename, setCreateFilename] = useState("")
  const [activeFilename, setActiveFilename] = useState("");

  return (
    <>
      <main className="mt-40 flex items-center w-full flex-col h-full relative ">
        <section className="flex flex-col bg-gray-700/55 backdrop-blur-sm rounded-lg shadow-sm shadow-gray-600/60 py-6 p-10 min-w-[60rem]">
          <div className="flex justify-between mb-6">
            <h2 className="text-slate-300/90 text-2xl mr-64 font-display border-b-4 border-b-primary pr-2 relative">
              Databases
              <QuestionMarkCircleIcon
                title="View a list of the encrypted databases you have access to"
                className="h-5 text-slate-600 -top-1 absolute -right-4"
              />
            </h2>
            <div className="flex">
              <Button btnStyle="primary" onClick={() => setShowCreateDialog(true)}>
                Create Database
                <LockClosedIcon className="btn-icon" />
              </Button>
            </div>
          </div>
          <ul className="pb-6 h-72 flex flex-col  justify-start ">
            {databases && databases?.length === 0 ? (
              <li className="text-slate-400 px-4 h-full border-slate-900 rounded-md bg-mirage-400/20 hover:bg-mirage-4000/25 border-y py-4 flex items-end relative ">
                <h3 class="text-slate-600 text-lg">No databases found.
                  <ExclamationTriangleIcon className="h-6 bottom-4 mr-3 right-0 absolute text-slate-600/70" />
                </h3>
              </li>
            ) : (
              <li class="overflow-y-scroll">
                {databases.map((db) =>
                  <DatabaseOption
                    setActiveFilename={setActiveFilename}
                    filename={db.name}
                    mtime={new Date(db.mtime).toLocaleString()}
                    setShowDeleteDialog={setShowDeleteDialog}
                  />
                )}
              </li>
            )}
          </ul>
          <hr className="pt-6 text-mirage-400/60" />
          <div className="flex justify-between">
            <h2 className="text-slate-300/90 text-2xl relative font-display border-b-4 border-b-primary pr-2 ">
              Local Plugins
              <QuestionMarkCircleIcon
                title="Learn how to setup your local plugins by reading the OSINTBuddy manual."
                className="h-5 absolute -top-2 -right-3 text-slate-600"
              />
            </h2>
          </div>
          <ul>
            <li className="text-slate-300/90 flex flex-col pt-6">
              <h3 class="font-display mb-2">Python Virtual Environment Path</h3>
              <div className="flex relative">
                <DirectoryInput
                  value={venvValue}
                  onChange={(e) => setVenvValue(e.currentTarget.value)}
                  onBtnClick={() => open({
                    multiple: false,
                    directory: true,
                  }).then((venvDirectory: string) => {
                    if (venvDirectory) {
                      store.set("venv_path", venvDirectory)
                      setVenvValue(venvDirectory)
                    }
                  })}
                />
                <QuestionMarkCircleIcon
                  title="Select the python3 virtual environment (venv) where the osintbuddy package is installed."
                  className="h-5 text-slate-600 -top-7 absolute right-0"
                />
              </div>
            </li>
            <li className="text-slate-300/90 flex flex-col pt-5">
              <h3 class="font-display mb-2">Entity Plugins Path</h3>
              <div className="flex relative">
                <DirectoryInput
                  onChange={(e) => setPluginsValue(e.currentTarget.value)}
                  value={pluginsValue}
                  onBtnClick={() => open({
                    multiple: false,
                    directory: true,
                  }).then((pluginsDirectory: string) => {
                    if (pluginsDirectory) {
                      store.set("plugins_path", pluginsDirectory)
                      setPluginsValue(pluginsDirectory)
                    }
                  })}
                />
                <QuestionMarkCircleIcon
                  title="Select the directory that contains OSINTBuddy Python plugins."
                  className="h-5 text-slate-600 -top-7 absolute right-0"
                />
              </div>
            </li>
          </ul>
        </section>
      </main>

      <Dialog
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false)
          setCreateFilename("")
          setCreatePassword("")
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center bg-gray-900/95 backdrop-blur-2xl  justify-center px-4">
          <DialogPanel className="relative flex flex-col from-gray-700/90 to-gray-800/80 bg-gradient-to-br rounded-lg shadow-sm shadow-gray-600/60 pt-6">
            <DialogTitle className="text-slate-300 font-bold text-lg flex mb-3 px-6">
              <h3 class="border-b-2 border-b-primary">
                Create database
              </h3>
            </DialogTitle>
            <Description className="text-slate-300 mb-4 relative px-6">
              Create an encrypted database and set <br />a password to keep your data safe
            </Description>
            <section class="px-6">
              <h3 class=" text-lg relative w-full mb-6 px-6 ">
                <span class="text-sm text-slate-600 absolute -left-0.5">Name</span>
              </h3>
              <input value={createFilename} onInput={(e) => setCreateFilename(e.currentTarget.value)} type="text" class="hover:border-primary border  border-slate-900 focus:bg-mirage-900/60 bg-mirage-300/20 w-full transition-colors duration-150 px-2 rounded outline-1 outline-slate-900 text-slate-300/80 focus:outline-2 focus:stroke-primary focus:outline-primary py-1" placeholder="Your database name" />
              <h3 class="text-slate-400 text-lg relative w-full mb-6 mt-10">
                <span class="text-sm text-slate-600 absolute -top-6 -left-0.5">Password</span>
                <input value={createPassword} onInput={(e) => setCreatePassword(e.currentTarget.value)} type="password" class="hover:border-primary border border-slate-900 focus:bg-mirage-900/60 bg-mirage-300/20 w-full transition-colors duration-150 px-2 rounded outline-1 outline-slate-900 text-slate-300/80 focus:outline-2 focus:stroke-primary focus:outline-primary py-1 mb-3" placeholder="Your password" />
              </h3>
            </section>
            <section className="flex bottom-4 right-15">
              <button
                className="w-full flex items-centers justify-center py-2  border-danger-600 rounded-bl-lg border-2 text-slate-300"
                onClick={() => {
                  setShowCreateDialog(false)
                  setCreateFilename("")
                  setCreatePassword("")
              }}>
                Cancel
              </button>
              <button
                className="w-full flex items-centers justify-center py-2  border-primary bg-primary hover:bg-primary-500 transition-colors ease-in-out rounded-br-lg border-2 text-slate-300 mb-0.5"
                onClick={() => {
                  invoke("create_db", { filename: createFilename, password: createPassword })
                  setShowCreateDialog(false)
                  refreshDbList()
                  setCreateFilename("")
                  setCreatePassword("")
                }}>
                Create
              </button>
            </section>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setActiveFilename("")
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center bg-gray-900/95 backdrop-blur-2xl  justify-center px-4">
          <DialogPanel className="relative flex flex-col from-gray-700/90 to-gray-800/80 bg-gradient-to-br rounded-lg shadow-sm shadow-gray-600/60 pt-6">
            <DialogTitle className="text-slate-300 font-bold text-lg flex mb-3 px-6">
              <h3 class="border-b-2 border-b-danger-500">
                Delete database
              </h3>
            </DialogTitle>
            <Description className="text-slate-300 mb-4 relative px-6">
              Are you sure you want delete this database?
            </Description>
            <section className="flex items-center">
              <button
                className="w-full flex items-centers justify-center py-2  rounded-bl-lg border-2 text-slate-300 border-primary bg-primary hover:bg-primary-500"
                onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </button>
              <button
                className="w-full border-danger-600 bg-danger-600 hover:bg-danger-500 flex items-centers justify-center py-2  transition-colors ease-in-out rounded-br-lg border-2 text-slate-300"
                onClick={() => {
                  console.log(activeFilename)
                  invoke("delete_file", { filename: activeFilename })
                  refreshDbList()
                  setShowDeleteDialog(false)
                }}>
                Confirm delete
              </button>
            </section>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}