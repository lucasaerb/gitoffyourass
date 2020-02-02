let delay = 1 //default is 5 seconds

const onMessage = message => {
  chrome.alarms.create("second", {when: Date.now() + 1000})
}

const decrementTime = () => {
  const s = parseInt(localStorage.getItem('seconds'),10)
  const m = parseInt(localStorage.getItem('minutes'),10)
  const h = parseInt(localStorage.getItem('hours'),10)

  localStorage.setItem('seconds',s <= 0 ? 0 : s - 1)

  if(m > 0){
    localStorage.setItem('seconds', 59)
    localStorage.setItem('minutes', m-1)
    return;
  }

  if(h > 0){
    localStorage.setItem('seconds', 59)
    localStorage.setItem('minutes', 59)
    localStorage.setItem('hours', h- 1)

    return;
  }
}

const getTimeLeftMs = () => {
  const s = parseInt(localStorage.getItem('seconds'),10)
  const m = parseInt(localStorage.getItem('minutes'),10)
  const h = parseInt(localStorage.getItem('hours'),10)
  return (s + (m* 60) + (h* 60)) * 1000
}

const muteTabs = () => {
  chrome.tabs.getAllInWindow(null, tabs => {
    for(const tab of tabs){
      const mutedInfo = tab.mutedInfo;
      if (mutedInfo){
        chrome.tabs.update(tab.id, {"muted": true});
      } 
    }
})}

const onUpdate = (tabId, changeInfo) => {
  if(localStorage.getItem('tabId')){
    // chrome.tabs.getAllInWindow(null, tabs => {
      // for (const tab of tabs){
        chrome.tabs.executeScript(tabId, {file: "contentScript.js"})
        const mutedInfo = changeInfo.mutedInfo;
        if (mutedInfo){
          chrome.tabs.update(tabId, {"muted": true});
        }
        // muteTabs()
      // }
    // } )
  }
}

const onAlarm = alarm => {
  chrome.alarms.clear("second")
  decrementTime()
  const timeLeft = getTimeLeftMs()
  if (timeLeft === 0){
      chrome.runtime.sendMessage({done: true})
      localStorage.setItem('cancel', false)
      chrome.tabs.getAllInWindow(null, tabs => {
        for (const tab of tabs){
          chrome.tabs.executeScript(tab.id, {file: "contentScript.js"})
        }
      })
      muteTabs()
      chrome.tabs.create({url: 'index.html'}, tab => localStorage.setItem('tabId', tab.id));
      return;
  }
  chrome.runtime.sendMessage({updateTime: true})
  chrome.alarms.create("second", {when: Date.now() + 1000})
}



chrome.runtime.onMessage.addListener(onMessage)
chrome.alarms.onAlarm.addListener(onAlarm)
chrome.tabs.onUpdated.addListener(onUpdate)