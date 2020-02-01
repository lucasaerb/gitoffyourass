const seconds = document.getElementById("seconds")

seconds.value = (localStorage.getItem('seconds') || 5)

seconds.addEventListener('change',(event) => {
    const value = event.target.value
    localStorage.setItem("seconds", value)
    chrome.runtime.sendMessage({seconds:value})
})