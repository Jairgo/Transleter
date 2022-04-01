const text = document.getElementById('translate-text');
const translate = document.getElementById('translate-button');
const reset = document.getElementById('translate-reset');
var from = document.getElementsByName('fromLanguages')[0];
var to = document.getElementsByName('toLanguages')[0];
var fromValue = document.getElementById("fromId");
var toValue = document.getElementById("toId");

// Obtener los valores de los idiomas almacenados en el globalStorage
chrome.storage.sync.get('from', function (result) {
    fromValue.value = result.from;
});
chrome.storage.sync.get('to', function (result) {
    toValue.value = result.to;
});

// Obtener los valores de los idiomas a traducir
from.addEventListener('input', function () {
    from = this.value;
});

to.addEventListener('input', function () {
    to = this.value;
});

// Listener para el boton de traducir
translate.addEventListener('click', () => {

    // Almacenar los valores de los idiomas en el globalStorage
    chrome.storage.sync.set({
        from: from,
        to: to
    });

    // Enviar el idioma origen al background.js
    chrome.runtime.sendMessage('', {
        type: 'from',
        message: from
    });

    // Enviar el idioma destino al background.js
    chrome.runtime.sendMessage('', {
        type: 'to',
        message: to
    });

    // Enviar el texto a traducir al background.js
    chrome.runtime.sendMessage('', {
        type: 'translate',
        message: text.value
    });
});

// Listener para el boton de resetear
reset.addEventListener('click', () => {
    text.value = '';
});