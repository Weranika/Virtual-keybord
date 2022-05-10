'use strict';

import {eng} from './lang_En';
import {ru} from './lang_Ru';
console.log('key')

export default class KeyboardCreator {
    constructor() {
        //localStorage.clear();   
        this.textarea = document.querySelector('textarea');        
        console.log(this.textarea);
        this.addClassActionOnPhisicalKeyboard();
        this.arrButtons = new Map();
        this.currLang = eng;
        this.isLowerCase = false;
        //this.curLangIndex = ;
        console.log('local', localStorage.getItem('lang'));
        if (localStorage.getItem('lang')) {
            this.currLang = localStorage.getItem('lang') === 'eng' ? eng : ru;
            console.log(this.currLang, eng, ru)
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
        if (btnInfo.hasOwnProperty('specialClass')) {
            button.setAttribute(btnInfo.keyCode, 'disabled');
            button.className = btnInfo.specialClass;
            
        } else if (btnInfo.hasOwnProperty('keyLength')) {
            button.classList.add(btnInfo.keyLength);
        }
        button.innerHTML = btnInfo.small;

        button.addEventListener ('mousedown', () => {
            button.classList.add('onFocus');
        })

        button.addEventListener ('mouseup', () => {
            button.classList.remove('onFocus');
        })
        return button;
    }    

    buttonHandler (event) {
            console.log(event.target.tagName);
            const textarea = document.querySelector('textarea'); 
            let pointer = textarea.selectionStart;
            const value = textarea.value;
            if (event.target.tagName === 'BUTTON'){
                console.log(event.target.classList);                
                const currentElemText = event.target.innerText;
                const currentElem = event.target;                
                if (event.target.classList.contains('key-usual') || 
                    event.target.classList.contains('arrow') || 
                    event.target.classList.contains('numbers')) {
                    textarea.value = value.substring(0,pointer) + currentElemText + value.substring(pointer);
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
            document.querySelector('textarea').value += '\n';
        } else if (currentElem.hasAttribute('backspace')) {
            document.querySelector('textarea').value = value.substring(0,pointer - 1) + value.substring(pointer); 
            textarea.selectionEnd = pointer - 1;
            console.log(value.substring(0,pointer + 1))
        } else if (currentElem.hasAttribute('space')) {
            document.querySelector('textarea').value += ' ';            
        } else if (currentElem.hasAttribute('tab')) {
            document.querySelector('textarea').value += '\t';
        } else if (currentElem.hasAttribute('delete')) {            
            textarea.value = value.substring(0,pointer) + value.substring(pointer + 1); 
            textarea.selectionEnd = pointer;
        } else if (currentElem.hasAttribute('capslock')) {
            this.capsHendler(event);
        }
    }
    
    capsHendler (event) {
        console.log(event, 'caps')
        event.preventDefault();
        console.log('caps');
        this.isLowerCase = this.isLowerCase === false ? true : false;
        for (let i = 0; i< this.currLang.length; i++){
            for (let j = 0; j< this.currLang[i].length; j++){
                const btn = this.arrButtons.get(this.currLang[i][j].keyCode);
                if (this.isLowerCase) {
                btn.innerHTML = this.currLang[i][j].upper;   
                } else {  
                btn.innerHTML = this.currLang[i][j].small;
                }
            }
        }
        document.querySelector('.textarea').focus();
    }

    shiftHendlerOn (event) {
        console.log(event, 'shiftL')
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
        console.log(event, 'shift')
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
            console.log(event.code);
            if (document.getElementById(event.code).hasAttribute('tab')) {
                event.preventDefault();
                document.getElementById(event.code).classList.add('onFocus');
                document.querySelector('.textarea').focus();                
                document.querySelector('.textarea').value += '\t';
            } else if (document.getElementById(event.code).hasAttribute('altleft')) {
                event.preventDefault();
                console.log('change lang');
                console.log(this.arrButtons);
                this.currLang = this.currLang === eng ? ru : eng;
                const lang = this.currLang === eng ? 'eng' : 'ru';
                localStorage.setItem('lang', lang);
                console.log(`set local storage to ${lang}`);
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
            console.log(event.code);
            document.getElementById(event.code).classList.remove('onFocus');
            document.querySelector('.textarea').focus();
            if (document.getElementById(event.code).hasAttribute('shiftleft') || document.getElementById(event.code).hasAttribute('shiftright')) {
                this.shiftHendlerOff(event);
            }
        })
    }

    create(body) {
        body.prepend(this.createContainer(this.currLang));        
    }
}