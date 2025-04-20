import { useState } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [transformResult, setTransformResult] = useState("")

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
    setTransformResult(await invoke("run_transform", { source: JSON.stringify(
      {"id":"1125899906842654","data":{"label":"Website","color":"#1D1DB8","icon":"world-www","elements":[{"value":"github.com","icon":"world-www","label":"Domain","type":"text"}]},"position":{"x":5275.072364647034,"y":3488.8488109543805},"transform":"To IP"}
    )}))
    console.log('transformResult', transformResult)
  }

  return (
    <main class="container">
      <h1>Welcome to Tauri + Preact</h1>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and Preact logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
