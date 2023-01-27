
let jwtAccess = localStorage.getItem('jwtAccess')
let jwtRefresh = localStorage.getItem('jwtRefresh')

const verifyJwt = async ( jwtAccess ) => {

    const res = await fetch('https://habit-tracker-backend-api.herokuapp.com/auth/jwt/verify/', 
    {
        method: 'POST',
        headers: {
        'Content-type': 'application/json'
        },
        body: JSON.stringify({'token': jwtAccess })
    })

    return res.status
}

const refreshJwt = async ( jwtRefresh ) => {
    const res = await fetch('https://habit-tracker-backend-api.herokuapp.com/auth/jwt/refresh/', 
    {
        method: 'POST',
        headers: {
        'Content-type': 'application/json'
        },
        body: JSON.stringify({ 'refresh': jwtRefresh })
    })

    const data = await res.json()
    if (data.access) {
        return data.access
    }
    else {
        return false
    }
}

const checkAuth = async () => {

    let loginPath = ''
    if (window.location.href.includes('views')) {
        loginPath = './login.html'
    }
    else {
        loginPath = 'views/login.html'
    }

    if (jwtAccess) {
        let jwtAccessStatus = await verifyJwt(jwtAccess)

        if (jwtAccessStatus === 401) {
            let jwtRefreshRes = await refreshJwt(jwtRefresh)

            if (jwtRefreshRes !== false) {
                localStorage.setItem('jwtAccess', jwtRefreshRes)
            }
            else {
                localStorage.clear()
                window.location.replace(loginPath);
            }
        }
        else if (jwtAccessStatus === 200) {

        }
        else {
            localStorage.clear()
            window.location.replace(loginPath);
        }
    }
    else {
        localStorage.clear()
        window.location.replace(loginPath);
    }

}

checkAuth()

