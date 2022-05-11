'use strict';

import {eng} from './lang_En';
import {ru} from './lang_Ru';
export default class KeyboardCreator {
    constructor() {
        this.arrButtons = new Map();
        this.currLang = eng;
        this.isLowerCase = false;        
        if (localStorage.getItem('lang')) {
            this.currLang = localStorage.getItem('lang') === 'eng' ? eng : ru;            
        } else {
            localStorage.setItem('lang', this.currLang);
        }
    }

    createContainer(lang) {
        const divContainer = document.createElement('div');
        divContainer.className = 'container';
        divContainer.prepend(this.createTextarea());
        divContainer.append(this.createRowContainer(lang));
        const note = document.createElement('p');
        note.className = 'note';       
        note.innerHTML = 'Press Ctrl + Alt for change language';
        divContainer.append(note);
        divContainer.onclick = this.buttonHandler.bind(this);        
        return divContainer;
    }

    createTextarea() {    
        const textarea = document.createElement('textarea');
        textarea.className = 'textarea';
        textarea.focus();
        textarea.placeholder = 'Press Ctrl + Alt for change language';
        textarea.onblur = () => {
            textarea.focus();
        };
        return textarea;
    }

    createRowContainer(lang = eng) {    
        const rowContainer = document.createElement('div');
        rowContainer.className = 'row-container';

        for (let i = 0; i < lang.length; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            rowContainer.append(row);

            for (let j = 0; j < lang[i].length; j++) {                
                const btn = this.createButton(lang[i][j]);
                this.arrButtons.set(lang[i][j].keyCode, btn);
                row.append(btn);
            } 
        }                
        return rowContainer;
    }

    createButton (btnInfo) {
        const button = document.createElement('button');
        button.className = 'key-usual';
        button.id = btnInfo.keyCode;
        if (Object.prototype.hasOwnProperty.call(btnInfo, 'specialClass')) {
            button.setAttribute(btnInfo.keyCode, 'disabled');
            button.className = btnInfo.specialClass;
            
        } else if (Object.prototype.hasOwnProperty.call(btnInfo, 'keyLength')) {
            button.classList.add(btnInfo.keyLength);
        }
        button.innerHTML = btnInfo.small;

        button.addEventListener ('mousedown', (event) => {            
            if (button.innerHTML === 'Shift') {
                this.shiftHendlerOn(event);
            }
            button.classList.add('onFocus');
        })

        button.addEventListener ('mouseup', (event) => {
            if (button.innerHTML === 'Shift') {
                this.shiftHendlerOff(event);
            }
            button.classList.remove('onFocus');
        })

        return button;
    }    

    buttonHandler (event) {        
        const textarea = document.querySelector('textarea'); 
        if (event.target.tagName === 'BUTTON'){ 
            const currentElem = event.target;                
            if (event.target.classList.contains('key-usual') || 
                event.target.classList.contains('arrow') || 
                event.target.classList.contains('numbers')) {                
                textarea.focus();                    
            } else if (event.target.classList.contains('key-special') || event.target.classList.contains('space')) {
                this.buttonSpecialHandler(currentElem, event);
                document.querySelector('.textarea').focus();
            }                                
        }
        event.stopPropagation();
    }

    buttonSpecialHandler (currentElem, event) {        
        const textarea = document.querySelector('textarea'); 
        let pointer = textarea.selectionStart;
        const value = textarea.value;

        if (currentElem.hasAttribute('enter')) {           
            textarea.setRangeText('\n', pointer, pointer, 'end');
        } else if (currentElem.hasAttribute('backspace')) {
            document.querySelector('textarea').value = value.substring(0,pointer - 1) + value.substring(pointer); 
            textarea.selectionEnd = pointer - 1;            
        } else if (currentElem.hasAttribute('space')) {
            textarea.setRangeText(' ', pointer, pointer, 'end');                
        } else if (currentElem.hasAttribute('tab')) {
            textarea.setRangeText('\t', pointer, pointer, 'end');            
        } else if (currentElem.hasAttribute('delete')) {            
            textarea.value = value.substring(0,pointer) + value.substring(pointer + 1); 
            textarea.selectionEnd = pointer;
        } else if (currentElem.hasAttribute('capslock')) {            
            this.capsHendler(event);
        }
    }
    
    capsHendler (event) {
        event.preventDefault();
        this.isLowerCase = this.isLowerCase === false ? true : false;
        for (let i = 0; i< this.currLang.length; i++){
            for (let j = 0; j< this.currLang[i].length; j++){
                const btn = this.arrButtons.get(this.currLang[i][j].keyCode);
                if (this.isLowerCase) {
                    btn.innerHTML = this.currLang[i][j].upper;   
                    document.getElementById('CapsLock').classList.add('onFocus');
                } else {  
                    btn.innerHTML = this.currLang[i][j].small;
                    document.getElementById('CapsLock').classList.remove('onFocus');
                }
            }
        }
        document.querySelector('.textarea').focus();
    }

    shiftHendlerOn (event) {
        event.preventDefault();        
        for (let i = 0; i< this.currLang.length; i++){
            for (let j = 0; j< this.currLang[i].length; j++){
                const btn = this.arrButtons.get(this.currLang[i][j].keyCode);                
                btn.innerHTML = this.currLang[i][j].upper;   
            }
        }
        document.querySelector('.textarea').focus();
    }

    shiftHendlerOff (event) {
        event.preventDefault();        
        for (let i = 0; i< this.currLang.length; i++){
            for (let j = 0; j< this.currLang[i].length; j++){
                const btn = this.arrButtons.get(this.currLang[i][j].keyCode);                
                btn.innerHTML = this.currLang[i][j].small;   
            }
        }
        document.querySelector('.textarea').focus();
    }

    addClassActionOnPhisicalKeyboard () {
        document.addEventListener('keydown', (event) => {
            if (document.getElementById(event.code).hasAttribute('tab')) {
                event.preventDefault();
                document.getElementById(event.code).classList.add('onFocus');
                document.querySelector('.textarea').focus();                
                document.querySelector('.textarea').value += '\t';
            } else if (document.getElementById(event.code).hasAttribute('altleft')) {
                event.preventDefault();    
                this.currLang = this.currLang === eng ? ru : eng;
                const lang = this.currLang === eng ? 'eng' : 'ru';
                localStorage.setItem('lang', lang);
                for (let i = 0; i< this.currLang.length; i++){
                    for (let j = 0; j< this.currLang[i].length; j++){
                        const btn = this.arrButtons.get(this.currLang[i][j].keyCode);
                        btn.innerHTML = this.currLang[i][j].small;
                    }
                }                
                document.querySelector('.textarea').focus();

            } else if (document.getElementById(event.code).hasAttribute('capslock')) {
                this.capsHendler(event);
            } else if (document.getElementById(event.code).hasAttribute('shiftleft') || document.getElementById(event.code).hasAttribute('shiftright')) {
                this.shiftHendlerOn(event);
            }
            document.getElementById(event.code).classList.add('onFocus');
            
        });
        document.addEventListener('keyup', (event) => {
            document.getElementById(event.code).classList.remove('onFocus');
            document.querySelector('.textarea').focus();
            if (document.getElementById(event.code).hasAttribute('shiftleft') || document.getElementById(event.code).hasAttribute('shiftright')) {
                this.shiftHendlerOff(event);
            }
        })
    }

    create(body) {
        body.prepend(this.createContainer(this.currLang));
        this.addClassActionOnPhisicalKeyboard();
    }
}