
export default function useURL() {

    
    let myLeads: string[] = [];
    const inputEl = document.getElementById('input-el') as HTMLInputElement | null;
    const ulEl = document.getElementById('ul-el') as HTMLUListElement | null;
    const inputBTN = document.getElementById('input-btn') as HTMLButtonElement | null;
    const deleteBTN = document.getElementById('cls-btn') as HTMLButtonElement | null;
    const wrapperDiv = document.getElementById('wrapper-el') as HTMLDivElement | null;
    const errorDiv = document.getElementById('error') as HTMLDivElement | null;

    inputBTN?.addEventListener('click', () => {
        Listener()
    });
    inputEl?.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            Listener()
        }
    });

    deleteBTN?.addEventListener('click',()=>{
        localStorage.removeItem('myLeads')
        renderLeads()
    })
    
    if(!myLeads.length){
        wrapperDiv!.style.display = 'none'
    }
    
    function applyStyling(text: string): string {
        let result = text.startsWith('https://') ?
            `<span class='secure'>https:</span><span class='slashes'>//</span><span class='domain_name'>${text.substring(8)}</span>` :
            `https:<span class='slashes'>//</span><span class='name-ph'>${text}`;
    
        const extensions = ['.com', '.net', '.org', '.app', '.edu', '.vercel', '.ph', '.github', '.dev', '.netlify'];
        for (const extension of extensions) {
            if (result.includes(extension)) {
                const parts = result.split(extension);
                let colorClass = '';
                
                if (extension === '.net' || extension === '.netlify') {
                    colorClass = 'name-net'; 
                } else {
                    colorClass = `name-${extension.slice(1)}`;
                }
    
                result = `<span class='name'>${parts[0]}</span><span class='${colorClass}' style='color: ${getUniqueColor(extension)};'>${extension}</span>`;
                
                if (parts[1]) {
                    result += `<span class="domain_name">${parts[1]}</span>`;
                }
                
                break;
            }
        }
    
        return `<span>${result}</span>`;
    }

    function getUniqueColor(extension: string): string {
        const colorMap: Record<string, string> = {
            '.com': 'lightblue',
            '.net': 'blueviolet',
            '.org': 'cyan',
            '.app': 'green',
            '.edu': 'lightgreen',
            '.vercel': 'yellow',
            '.netlify':'red',
            '.ph': 'orange',
            '.github': 'lightgreen',
            '.dev': 'blue',
            '.js': 'goldenrod'
        };

        return colorMap[extension] || 'black';
    }

    function isValidURL(url: string): boolean {
        try {
            const parsedUrl = new URL(`http://${url}`);
            const urlPathname = parsedUrl.pathname.toLowerCase();
            const validExtensions = ['.com', '.net', '.org', '.app', '.edu', '.vercel', '.ph','.github','.io','.dev','.js'];
    
            const isValidExtension = validExtensions.some((extension) => urlPathname.endsWith(extension.toLowerCase()));
            return isValidExtension;
        } catch (error) {
            console.error("Error validating URL:", error);
            inputEl!.value = '';
            return false;
        }
    }
    
    function Listener() {
        errorDiv!.style.display = 'block';

        let inputValue = `${inputEl!.value.trim()}`;
        inputValue = inputValue.replace(/^https?:\/\//i, '');

        if (inputValue === '') {
            showError('Please ensure it is not left empty');
            return;
        }

        const inputFormat = `https://${inputValue}`;

        if (!isValidURL(inputFormat)) {
            inputEl!.value = '';
            showError('Please enter a valid URL with a supported extension');
            return;
        }

        if (myLeads.some((url) => url.toLowerCase() === inputValue.toLowerCase())) {
            showError('URL already exists');
            return;
        }

        myLeads.push(inputValue.toLowerCase());

        // Save myLeads to localStorage after adding a new item
        saveToLocalStorage();

        if (myLeads.length) {
            inputEl!.value = '';
            wrapperDiv!.style.display = 'block';
            errorDiv!.style.display = 'none';
            renderLeads();
        } else {
            showError('No valid URLs to display');
            wrapperDiv!.style.display = 'none'
        }
    }

    function getItemLeads(): string {
        let getItems = localStorage.getItem('myLeads');
        if (!getItems) {
            wrapperDiv!.style.display = 'none';
        } else {
            wrapperDiv!.style.display = 'block';
        }
        return getItems ? getItems : '';
    }
    
    function createListItem(url: string, index: number): string {
        return `<li id='${index}'>
                    <a id='link' href='https://${url}' target='_blank'>
                        <pre>${applyStyling(url)}</pre>
                    </a>
                    <input type='button' class='remove' id='remove' data-index='${index}' value='remove'>
                </li>`;
    }
    
    function createListOfItems(items: string[]): string {
        return items.map((url, index) => createListItem(url, index + 1)).join('');
    }
    
    function renderLeads() {
        const getItems = getItemLeads();
        if (getItems) {
            myLeads = JSON.parse(getItems);
    
            // Check if myLeads is defined and not empty
            if (Array.isArray(myLeads) && myLeads.length > 0) {
                // Render leads using the updated myLeads array
                ulEl!.innerHTML = createListOfItems(myLeads);
    
                // Use event delegation for remove buttons after rendering the leads
                ulEl!.addEventListener('click', (event) => {
                    const target = event.target as HTMLElement;
                    if (target.id === 'remove' && target.parentElement) {
                        const targetIndex = target.getAttribute('data-index');
                        if (targetIndex !== null) {
                            const indexToRemove = parseInt(targetIndex, 10);
                            // Remove the corresponding <li> element from the DOM
                            const liToRemove = document.getElementById(indexToRemove.toString());
                            if (liToRemove) {
                                liToRemove.remove();
                            } 
                            // Optionally: Remove the item from the array and update localStorage
                            myLeads = myLeads.filter((_, index) => index !== indexToRemove - 1);
                            localStorage.setItem('myLeads', JSON.stringify(myLeads));
                        if(!myLeads.length){
                            ulEl!.innerHTML = (`<li>No urls found</li>`)
                        }
                        }
                    }
                });
            } else {
                // Handle the case when myLeads is an empty array
                ulEl!.innerHTML = ''; // Clear the inner HTML
                wrapperDiv!.style.display = 'none'
            }
        }
    }
    
    
    
    function showError(errorMessage: string) {
        errorDiv!.innerHTML = `<ul class='error'><li>${errorMessage}</li></ul>`;
        inputEl!.value = '';
        inputEl!.style.border = '1px solid red';
        setTimeout(() => {
            errorDiv!.innerHTML = ''; // Clear error message
            inputEl!.style.border = 'none';
        }, 2000);
    }
    
    function saveToLocalStorage() {
        localStorage.setItem('myLeads', JSON.stringify(myLeads));
    }
    
    

    // Initial render
    renderLeads();
    window.addEventListener('load', renderLeads);
}