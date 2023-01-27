
const closeAlert = (event) => {
    event.target.parentElement.style.display = 'none'
}

let closeAlertButton = document.getElementById('close-alert')
closeAlertButton.addEventListener('click', closeAlert)