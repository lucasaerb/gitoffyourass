let delay = 1 //default is 5 seconds

//Listerners
//On runtime message 
chrome.runtime.onMessage.addListener(onMessage)
//On alarm
chrome.alarms.onAlarm.addListener(onAlarm)

// chrome.browserAction.onClicked.addListener(function() {
  // });
  
chrome.alarms.create("alarm", {when: Date.now() + delay*1000})

function onMessage(message){
  delay = parseInt(message.seconds,10)
}

function onAlarm(){
    console.log("Hi")
    console.log(delay)
    // Delete all the timers 
    chrome.alarms.clearAll()
    // And start a new timer now
    chrome.tabs.create({url: 'index.html'});

    // chrome.alarms.create("alarm", {when: Date.now() + delay*1000})
}
