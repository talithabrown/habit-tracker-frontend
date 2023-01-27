
const logout = () => {
    localStorage.clear()
    window.location.href = './login.html'
}

let logoutButton = document.getElementById('logout-button')
logoutButton.addEventListener('click', logout)