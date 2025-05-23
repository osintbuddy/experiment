import { useAtom } from "jotai"
import { graphsAtom } from "../app/atoms"
import { useMountEffect } from "../app/hooks";
import { invoke } from "@tauri-apps/api/core";

export default function DashboardPage() {
  
  const [graphs, setGraphs] = useAtom(graphsAtom);
  
  useMountEffect(() => {
    invoke("select_graphs", { offset: 0 }).then((data: object[]) => {
      console.log('graphs', data)
      setGraphs(data)
    }).catch(err => console.warn(err))
  })

  return (
    <>
      <h2>Dashboard</h2>
      <button>

      </button>
    </>
  )
}