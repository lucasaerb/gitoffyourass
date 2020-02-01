const hours = document.getElementById('timer_hours')
const minutes = document.getElementById('timer_minutes')
const seconds = document.getElementById('timer_seconds')

const start = document.getElementById('timer_start')
const cancel = document.getElementById('timer_stop')

const text = document.getElementById('text')

const initTime = () => {
    const h = parseInt(localStorage.getItem('hours'),10) || 0
    const m = parseInt(localStorage.getItem('minutes'),10) || 0
    const s = parseInt(localStorage.getItem('seconds'),10) || 0

    hours.value = h === 0 ? parseInt(localStorage.getItem('permhours'),10) || 0 : h
    minutes.value = m === 0 ? parseInt(localStorage.getItem('permminutes'),10) || 0 : m
    seconds.value = s === 0 ? parseInt(localStorage.getItem('permseconds'),10) || 0 : s
}

const initButtons = () => {
    const cancelVal = localStorage.getItem('cancel') || false
    if (cancelVal === "true"){
        start.className = "button disabled"
        cancel.className = "button"  
    }
    else{
        start.className = "button"
        cancel.className = "button disabled"   
    }
}

const init = () => {
    initTime()
    initButtons()
}

init()

const updateTime = () => {
    hours.value = parseInt(localStorage.getItem('hours'),10)
    minutes.value = parseInt(localStorage.getItem('minutes'),10)
    seconds.value = parseInt(localStorage.getItem('seconds'),10)
}


const onMessage = message => {
    if (message.updateTime){
        updateTime()
        initButtons()
    }
    if (message.done){
        hours.value = parseInt(localStorage.getItem('permhours'),10)
        minutes.value = parseInt(localStorage.getItem('permminutes'),10)
        seconds.value = parseInt(localStorage.getItem('permseconds'),10)
        start.className = "button"
        cancel.className = "button disabled"   
    }
}

const onStart = event => {
    const h = parseInt(hours.value, 10)
    const m = parseInt(minutes.value, 10)
    const s = parseInt(seconds.value, 10)

    localStorage.setItem('hours', h)
    localStorage.setItem('minutes', m)
    localStorage.setItem('seconds', s)
    localStorage.setItem('permhours', h)
    localStorage.setItem('permminutes', m)
    localStorage.setItem('permseconds', s)
    localStorage.setItem('cancel', true)
    cancel.className = "button"
    start.className = "button disabled"
    text.innerHTML = "GET READY TO WORK!!"

    chrome.runtime.sendMessage({hours:h, minutes: m, seconds:s})
}

const onCancel = event => {
    text.innerHTML = ""
    start.className = "button"
    cancel.className = "button disabled"
    chrome.alarms.clear("second")
    hours.value = parseInt(localStorage.getItem('permhours'),10)
    minutes.value = parseInt(localStorage.getItem('permminutes'),10)
    seconds.value = parseInt(localStorage.getItem('permseconds'),10)
    localStorage.setItem('cancel', false)
}

const onTimeChange = (value, hour, minute, second) => {
    const val = parseInt(value, 10)
    if (isNaN(val)|| val < 0){
        if(hour){
            hours.value = 0
        }
        else{
            if (minute){
                minutes.value = 0
            }
            else{
                seconds.value = 0
            }
        }
    }
    else if ((hour && val > 23) || ((minute || second) && val > 59)){
        if(hour){
            hours.value = 23
        }
        else{
            if (minute){
                minutes.value = 59
            }
            else{
                seconds.value = 59
            }
        }
    }
    else{
        if(hour){
            hours.value = val
        }
        else{
            if (minute){
                minutes.value = val
            }
            else{
                seconds.value = val
            }
        }
    }
}

hours.addEventListener('keyup', event => onTimeChange(event.target.value, true, false, false))
minutes.addEventListener('keyup', event => onTimeChange(event.target.value, false, true, false))
seconds.addEventListener('keyup', event => onTimeChange(event.target.value, false, false, true))

start.addEventListener('click', onStart)
cancel.addEventListener('click', onCancel)

chrome.runtime.onMessage.addListener(onMessage)