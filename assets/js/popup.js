const text = document.getElementById('translate-text');
const translate = document.getElementById('translate-button');

translate.addEventListener('click', () => {
    chrome.runtime.sendMessage('', {
        type: 'notification',
        message: text.value
    });
});