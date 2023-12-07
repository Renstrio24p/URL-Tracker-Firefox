
import { GitImg, TSImg, esbuildImg } from './Images';

export default function TypeScript(DOM: HTMLDivElement) {

    let counter = 0;

    function handleCounterChange(amount: number) {
    
        const newCount = counter + amount;
        counter = newCount < 0 ? 0 : newCount;
        counterSpan.textContent = counter.toString();
    }

    DOM.innerHTML = (`
    <div>
        <div class="ts-div">
            <div class="logo">
                <a href="http://ts.dev">
                    <img src=${TSImg.image} class="ts" alt="${TSImg.alt}" />
                </a>
            </div>
        <div>
            <h1 class='title'>Standalone TypeScript</h1>
        <div class="ts-div2">
          <p>Learn Vanilla TS </p>
          <div class="ts">
            <img src=${TSImg.image} alt="${TSImg.alt}"/>
          </div>
          at
          <pre class="apps">src/Start.ts</pre>
        </div>
        <div class="buttons">
            <button id="incrementBtn">+1</button>
            <button>Count : <span class="counter-span">${counter}</span></button>
            <button id="decrementBtn">-1</button>
        </div>
      </div>
      <div class="logo">
        <a href="http://esbuild.github.io">
          <img src=${esbuildImg.image} class="webpack" alt="${esbuildImg.alt}" />
        </a>
      </div>
    </div>
    <div class="footer">
      <div class="version">version 1.0.6</div>
      <div class="github">
        <div class="gitlogo">
          <img src=${GitImg.image} class="git" alt="${GitImg.alt}" />
        </div>
        <p>Codespace</p>
      </div>
    </div>
  </div>
      `);

    const incrementButton = DOM.querySelector('#incrementBtn') as HTMLButtonElement;
    incrementButton.addEventListener('click', () => handleCounterChange(1));

    const decrementButton = DOM.querySelector('#decrementBtn') as HTMLButtonElement;
    decrementButton.addEventListener('click', () => handleCounterChange(-1));

    const counterSpan = DOM.querySelector('.counter-span') as HTMLSpanElement;

}
