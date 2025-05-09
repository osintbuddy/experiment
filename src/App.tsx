import { useState } from "preact/hooks";
import { invoke } from "@tauri-apps/api/core";
import AppRoutes from "./AppRoutes";
import "./index.css";

function App() {
  const [transformResult, setTransformResult] = useState<any>("")

  // @ts-ignore
  async function greet() {
    const data = await invoke("run_transform", { source: JSON.stringify(
      {"id":"1125899906842654","data":{"label":"Website","color":"#1D1DB8","icon":"world-www","elements":[{"value":"github.com","icon":"world-www","label":"Domain","type":"text"}]},"position":{"x":5275.072364647034,"y":3488.8488109543805},"transform":"To IP"}
    )})
    setTransformResult(data)
    console.log('transformResult', transformResult)
  }

  return (
    <AppRoutes />
  );
}

export default App;
