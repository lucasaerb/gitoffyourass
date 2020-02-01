document.getElementById("seconds").addEventListener('change',(event) => {
    chrome.runtime.sendMessage({seconds:event.target.value})
})