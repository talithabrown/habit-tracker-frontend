
const setAlert = (message) => {
    let alertDiv = document.getElementById('alert-div')
    alertDiv.children[0].innerHTML = message
    alertDiv.style.display = 'flex'
}

const login = async () => {

    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    if (email == '' || password == '') {
        setAlert('Email and password are required')
        return
    }

    const res = await fetch('https://habit-tracker-backend-api.herokuapp.com/auth/jwt/create/', 
    {
        method: 'POST',
        headers: {
        'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "username": email,
            "password": password
        })
    })
    if (res.ok) {
        const data = await res.json()
        localStorage.setItem('jwtAccess', data.access);
        localStorage.setItem('jwtRefresh', data.refresh)
        window.location.href = '../index.html'
    }
    else if (res.status === 401) {
        setAlert('Incorrect email and/or password')
    }
    else {
        setAlert('An error occured while logging in')
    }

}


const loginButton = document.getElementById('login-button')
loginButton.addEventListener('click', login)



