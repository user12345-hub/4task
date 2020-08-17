import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {

    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userEmail, setUserEmail] = useState(null)

    const login = useCallback( (jwtToken, id, email) => {
        setToken(jwtToken)
        setUserId(id)
        setUserEmail(email)
        sessionStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, userEmail: email
        }))
    }, [])

    const logout = useCallback( () => {
        setToken(null)
        setUserId(null)
        setUserEmail(null)
        sessionStorage.removeItem(storageName)
    }, [])


    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem(storageName))
        if (data && data.token){
            login(data.token, data.userId, data.userEmail)
        }
    }, [login])

    return { login, logout, token, userId, userEmail }
}