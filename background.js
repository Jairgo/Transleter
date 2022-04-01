// Parametros de la peticion
var key = "5cba5fc42bed40b7aa31630170fcb70f";
var endpoint = "https://api.cognitive.microsofttranslator.com/";
var location = "southcentralus";

// Headers para la peticion
var myHeaders = new Headers();
myHeaders.append("Ocp-Apim-Subscription-Key", key);
myHeaders.append("Ocp-Apim-Subscription-Region", location);
myHeaders.append("Content-type", "application/json");

var from = "";
var to = "";

// Listener para recibir el texto a traducir, el idioma origen y destino desde el popup
chrome.runtime.onMessage.addListener(data => {

    if (data.type === 'from') {
        from = data.message;
    }

    if (data.type === 'to') {
        to = data.message;
    }

    if (data.type === 'translate') {
        getTranslation(data.message, from, to);
    }

});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'translate',
        title: "Traducir: %s",
        contexts: ["selection"]
    });

    chrome.storage.sync.set({
        from: from,
        to: to
    });
});

// Listener para recibir el texto a traducir, el idioma origen y destino desde el click derecho
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if ('translate' === info.menuItemId) {
        getTranslation(info.selectionText, from, to);
    }
});

// Funcion para obtener la traduccion
const getTranslation = (text, from, to) => {

    var raw = JSON.stringify([
        {
            "Text": text
        }
    ]);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=" + from + "&to=" + to, requestOptions)
        .then(response => response.json())
        // .then(result => console.log(result[0].translations[0].text))
        .then(result => showTranslate(result[0].translations[0].text))
        .catch(error => console.log('error', error));

};

// Funcion para mostrar la traduccion como notificacion
const showTranslate = message => {
    return chrome.notifications.create(
        '',
        {
            type: 'basic',
            title: 'Translater',
            message: message || 'Guardado!',
            iconUrl: './assets/icons/128.png',
        }
    );
};