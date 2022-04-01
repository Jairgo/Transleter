chrome.runtime.onMessage.addListener( data => {
    if ( data.type === 'notification' ) {
      translate( data.message );
    }
  });
  
  chrome.runtime.onInstalled.addListener( () => {
    chrome.contextMenus.create({
      id: 'translate',
      title: "Traducir: %s", 
      contexts:[ "selection" ]
    });
  });
  
  chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
    if ( 'translate' === info.menuItemId ) {
      translate( info.selectionText );
    }
  } );
  
  const translate = message => {
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