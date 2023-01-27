
const setAlert = (message, type) => {
    let alertDiv = document.getElementById('alert-div')
    alertDiv.children[0].innerHTML = message
    alertDiv.style.display = 'flex'

    if (type !== undefined) {
        alertDiv.classList = 'success-alert'
    }
}

const login = async (email, password) => {

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
    else {
        setAlert('An error occured while logging in')
    }
}

const createAccount = async () => {

    createAccountButton.removeEventListener('click', createAccount)

    const email = document.getElementById('create-account-email').value
    const password = document.getElementById('create-account-password').value
    const confirmPassword = document.getElementById('create-account-confirm-password').value

    if (email == '' || password == '' || confirmPassword == '') {
        setAlert('All fields are required')
        createAccountButton.addEventListener('click', createAccount)
        return
    }

    if (password !== confirmPassword) {
        setAlert('Passwords do not match')
        document.getElementById('create-account-password').value = ''
        document.getElementById('create-account-confirm-password').value = ''
        createAccountButton.addEventListener('click', createAccount)
        return
    }

    const res = await fetch('https://habit-tracker-backend-api.herokuapp.com/auth/users/', 
    {
        method: 'POST',
        headers: {
        'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
    if (res.ok) {
        setAlert('Account created successfully! Logging you in now!', 1)
        login(email, password)
    }
    else {
        const data = await res.json()
        if (data.email) {
            setAlert(data.email)
        }
        else if (data.password) {
            setAlert(data.password)
        }
        else {
            setAlert('An error occured while creating account')
        }
        createAccountButton.addEventListener('click', createAccount)
    }
}

const createAccountButton = document.getElementById('create-account-button')
createAccountButton.addEventListener('click', createAccount)