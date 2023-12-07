import './assets/css/app.css';
import useURL from './components/useURL.func';

export default async function Start(DOM: HTMLElement): Promise<void> {
    
    DOM.innerHTML = (`
            <div>
                <input type='text' id='input-el' placeholder='&#128270; https://apple.domain.com'>
                <button id="input-btn">SAVE INPUT</button>
                <button id="cls-btn">CLEAR ALL</button>
                <div id='wrapper-el' class='wrapper'>
                    <p>List of urls</p>
                    <ul id='ul-el'></ul>
                </div>
                <div id='error'>
                </div>
            </div>
            `)

    useURL()
}
