import TypeScript from "../../components/TypeScript"

export default function Render(){

  const TSDOM = document.querySelector('#TS') as HTMLDivElement | null

  {TSDOM && TypeScript(TSDOM)}

}