var key = "5cba5fc42bed40b7aa31630170fcb70f";
var endpoint = "https://api.cognitive.microsofttranslator.com/";
var location = "southcentralus";

var myHeaders = new Headers();
myHeaders.append("Ocp-Apim-Subscription-Key", key);
myHeaders.append("Ocp-Apim-Subscription-Region", location);
myHeaders.append("Content-type", "application/json");
var from = "es";
var to = "en";

chrome.runtime.onMessage.addListener(data => {
    if (data.type === 'notification') {
        getTranslation(data.message, from, to);
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'translate',
        title: "Traducir: %s",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if ('translate' === info.menuItemId) {
        getTranslation(info.selectionText, from, to);
    }
});

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


const showTranslate = message => {
    return chrome.notifications.create(
        '',
        {
            type: 'basic',
            title: 'Translater',
            message: message || 'Translater!',
            iconUrl: './assets/icons/128.png',
        }
    );
};