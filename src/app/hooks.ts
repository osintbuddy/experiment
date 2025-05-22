import { useEffect } from "preact/hooks";

const useMountEffect = (fun) => useEffect(fun, [])

export {
  useMountEffect
}