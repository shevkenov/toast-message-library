const DEFAULT_OPTIONS = {
    autoClose: 2000,
    onClose: () => {},
    canClose: true,
    showProgress: true,
}

export default class Toast{
    #element;
    #intervalTimeout;
    #removedBind;
    #autoCloseValue;
    #timestamp;
    #intervalInterval;

    constructor(options){
        this.#timestamp = new Date().getTime();
        this.#element = document.createElement('div');
        this.#element.classList.add('toast');
        requestAnimationFrame(() => {
            this.#element.classList.add('show');
        })
        this.#removedBind = this.remove.bind(this);
        this.update(options);
    }

    set position(value){
        const currentContainer = this.#element.parentElement;
        if(currentContainer){
            currentContainer.dataset.position = value;
            return;
        }
        const selector = `.toast-container[data-position=${value}]`;
        const container = document.querySelector(selector) 
        || createContainer(value);
        container.appendChild(this.#element);
    }

    set text(value){
        this.#element.textContent = value;
    }

    remove(){
        const container = this.#element.parentElement;
        this.#element.classList.remove('show');
        this.#element.addEventListener('transitionend', () => {
            this.#element.remove();
            if(!container.hasChildNodes()){
                container.remove();
            }
        })
        this.onClose();
        if(this.#intervalTimeout) clearTimeout(this.#intervalTimeout)
    }

    update(options){
        Object.entries({...DEFAULT_OPTIONS, ...options}).forEach(([key, value]) => {
            this[key]=value
        });
    }

    set showProgress(value){
        this.#element.classList.toggle('progressbar', value);

        if(value && this.#autoCloseValue){
            this.#element.style.setProperty('--progress', 1);
            let finalTime = this.#timestamp + this.#autoCloseValue;
            let elapesdTime;

            this.#intervalInterval = setInterval(() => {
                elapesdTime = finalTime - new Date().getTime();
                this.#element.style.setProperty('--progress', elapesdTime / this.#autoCloseValue);

                if(elapesdTime <= 0){
                    clearInterval(this.#intervalInterval);
                }  
                
            },50)
        }
    }

    set autoClose(value){
        if(value === false) return;

        this.#autoCloseValue = value;
        if(this.#intervalTimeout) clearTimeout(this.#intervalTimeout)
        this.#intervalTimeout = setTimeout(() => {
            this.remove()
        }, value)
    }

    set canClose(value){
        this.#element.classList.toggle('can-close', value);
        if(value){
            this.#element.addEventListener('click', this.#removedBind);
        }else{
            this.#element.removeEventListener('click', this.#removedBind);
        }
    }
}

function createContainer(value){
    const div = document.createElement('div');
    div.classList.add('toast-container');
    div.dataset.position = value;
    document.body.append(div);
    return div;
}