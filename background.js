chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({url: 'index.html'});
  });
  
chrome.alarms.create("alarm", {when: Date.now() + 5000})

chrome.alarms.onAlarm.addListener(onAlarm)

function onAlarm(){
    console.log("Hi")
    // Delete all the timers 
    chrome.alarms.clearAll()
    // And start a new timer now
    chrome.alarms.create("alarm", {when: Date.now() + 5000})
}
