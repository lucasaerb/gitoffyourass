const newChild = document.createElement("div")

newChild.style = " \
    position: fixed; \
    top: 0;\
    right: 0;\
    bottom: 0;\
    left: 0;\
    opacity: 0.5;\
    z-index: 9999999;\
    background-image: url('https://simpleicon.com/wp-content/uploads/lock-2.png');\
    background-size: contain; \
    margin: 100px; \
"

document.body.style = "overflow: hidden;"
document.documentElement.style = "overflow: hidden;"

document.body.appendChild(newChild)
