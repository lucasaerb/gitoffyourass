const hours = document.getElementById('timer_hours')
const minutes = document.getElementById('timer_minutes')
const seconds = document.getElementById('timer_seconds')

const soundSlider = document.getElementById('soundSlider')
const unmute = document.getElementById('unmute-button')
const mute = document.getElementById('mute-button')

const start = document.getElementById('timer_start')
const cancel = document.getElementById('timer_stop')

const text = document.getElementById('text')

const initTime = () => {
    const h = parseInt(localStorage.getItem('hours'),10) || 0
    const m = parseInt(localStorage.getItem('minutes'),10) || 0
    const s = parseInt(localStorage.getItem('seconds'),10) || 0
    const ph = parseInt(localStorage.getItem('permhours'),10)
    const pm = parseInt(localStorage.getItem('permminutes'),10)
    const ps = parseInt(localStorage.getItem('permseconds'),10)
    hours.value = h === 0 && m === 0 && s === 0 ?  ph ? ph  > 9 ? ph : `0${ph}` : "00" : h > 9 ? ""+h: `0${h}`
    minutes.value = h === 0 && m === 0 && s === 0  ? pm ? pm  > 9 ? pm : `0${pm}` : "00" : m > 9 ? ""+m: `0${m}`
    seconds.value = h === 0 && m === 0 && s === 0 ?  ps ? ps  > 9 ? ps : `0${ps}` : "00" : s > 9 ? ""+s: `0${s}`
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

const initSounds = () => {
    const getSoundLevel = localStorage.getItem('soundLevel')
    let soundLevel;
    if (!getSoundLevel){
        soundLevel = 50
        localStorage.setItem('soundLevel', 50)
    }
    else{
        soundLevel = getSoundLevel
    }
    if (soundLevel === "0"){
        mute.style.display = 'inline'
        unmute.style.display = 'none'
    }
    else{
        mute.style.display = 'none'
        unmute.style.display = 'inline'
    }
    soundSlider.value = soundLevel
}

const init = () => {
    initTime()
    initButtons()
    initSounds()
}

init()

const updateTime = () => {
    const h = parseInt(localStorage.getItem('hours'),10)
    const m = parseInt(localStorage.getItem('minutes'),10)
    const s = parseInt(localStorage.getItem('seconds'),10)
    hours.value = h > 9 ? h : `0${h}`
    minutes.value =  m > 9 ? m : `0${m}`
    seconds.value =  s > 9 ? s : `0${s}`
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
    text.innerHTML = "Get ready to WORK!!"

    chrome.runtime.sendMessage({hours:h, minutes: m, seconds:s})
}

const onCancel = event => {
    text.innerHTML = ""
    start.className = "button"
    cancel.className = "button disabled"
    chrome.alarms.clear("second")
    const h = parseInt(localStorage.getItem('permhours'),10)
    const m = parseInt(localStorage.getItem('permminutes'),10)
    const s = parseInt(localStorage.getItem('permseconds'),10)
    hours.value = h > 9 ? h : "0"+h
    minutes.value = m > 9 ? m : "0"+m
    seconds.value = s > 9 ? s : "0"+s
    localStorage.setItem('cancel', false)
}

const onTimeChange = (value, hour, minute, second) => {
    const val = parseInt(value, 10)
    if (isNaN(val)|| val < 0){
        if(hour){
            hours.value = "00"
        }
        else{
            if (minute){
                minutes.value = "00"
            }
            else{
                seconds.value = "00"
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
            hours.value = val > 9 ? val : `0${val}`
        }
        else{
            if (minute){
                minutes.value = val > 9 ? val : `0${val}`
            }
            else{
                seconds.value = val > 9 ? val : `0${val}`
            }
        }
    }
}

const onSoundsChange = event => {
    const soundLevel = parseInt(event.target.value, 10)
    if (soundLevel === 0){
        mute.style.display = 'inline'
        unmute.style.display = 'none'
    }
    else{
        mute.style.display = 'none'
        unmute.style.display = 'inline'
    }
    localStorage.setItem('soundLevel', soundLevel)
    soundSlider.value = soundLevel
}

const onMuteClick = () => {
    mute.style.display = 'none'
    unmute.style.display = 'inline'
    let soundLevel = parseInt(localStorage.getItem('soundLevel'),10)
    if (soundLevel === 0){
        localStorage.setItem('soundLevel',50)
        soundLevel = 50
    }
    soundSlider.value = soundLevel
}

const onUnmuteClick = () => {
    mute.style.display = 'inline'
    unmute.style.display = 'none'
    soundSlider.value = 0
    localStorage.setItem('soundLevel', 0)
}

hours.addEventListener('keyup', event => onTimeChange(event.target.value, true, false, false))
minutes.addEventListener('keyup', event => onTimeChange(event.target.value, false, true, false))
seconds.addEventListener('keyup', event => onTimeChange(event.target.value, false, false, true))

soundSlider.addEventListener('change', onSoundsChange)
mute.addEventListener('click', onMuteClick)
unmute.addEventListener('click', onUnmuteClick)

start.addEventListener('click', onStart)
cancel.addEventListener('click', onCancel)

chrome.runtime.onMessage.addListener(onMessage)