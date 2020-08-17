import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import {AuthContext} from "../context/AuthContext"
import {useAuth} from "../hooks/auth.hook";

export const TablePage = () => {

    const [users, setUser] = useState([])
    const [checkedUser, setChecked] = useState([])
    const {loading, request} = useHttp()
    const token = useContext(AuthContext)
    const {userId} = useAuth()

    const fetchUser = useCallback(async () => {
        try{
            const fetched = await request('/api/auth/table', 'POST', null, {
                Authorization: token
            })
            setUser(fetched.map((e, i) =>{
                return {"index": i, "name": e.name, "email": e.email, "regDate": e.regDate, "lastLoginDate": e.lastLoginDate, "status": e.status}
            }))
            
            setChecked(checkedUser)
        } catch (e){}
    }, [token, request])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])


    const checkHandler = (id) => {
        setChecked(checkedUser.includes(id) ? checkedUser.filter(it => it !== id) : [...checkedUser, id])
    }

    const checkAll = () => {
        setChecked(
            checkedUser.length !== users.length ? users.map((it, index) => index) : []
        )
    }

    const blockUsers = async () =>{
        try{
            const arr = users.filter((it)=> checkedUser.includes(it.index))
                .map(e => e.email)
            await request('api/auth/user/block', 'PUT', {arr})
            fetchUser()
        } catch (e){

        }
    }

    const unBlockUsers = async () =>{
        try{
            const arr = users.filter((it)=> checkedUser.includes(it.index))
                .map(e => e.email)
            await request('api/auth/user/unblock', 'PUT', {arr})
            fetchUser()
        } catch (e){

        }
    }

    const deleteUsers = async () => {
        try{
            const arr = users.filter((it)=> checkedUser.includes(it.index))
                .map(e => e.email)
            let keys = Object.keys(sessionStorage)
            console.log(keys)
            const user = await request('/api/auth/user/delete', 'DELETE', {arr, userId})
            if (user){
                console.log("User", user)
            }
            fetchUser()
        } catch (e){}
    }

    const headerElements = ['ID', 'Name', 'Email', 'regDate', 'lastLoginDate', 'status']
    const generateHeaders = () => {
        return users && headerElements.map((k, index) => {
            return <th key={index}>{k.toUpperCase()}</th>
        })
    }

    const generateBody = () => {
        return users && users.map((user) => {
            return (
                <tr key={user.index}>
                    <th>
                        <label>
                            <input type="checkbox" onChange={() => checkHandler(user.index)} checked={checkedUser.includes(user.index)}></input>
                            <span></span>
                        </label>
                    </th>
                    <td>{user.index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.regDate}</td>
                    <td>{user.lastLoginDate}</td>
                    <td>{user.status}</td>
                </tr>
            )
        })
    }

    if (loading){
        return <p>Loading...</p>
    }

    return(
        <div>
            <div>
                <button onClick={blockUsers} className="waves-effect waves-light btn-large">Block</button>
                <a onClick={unBlockUsers} className="waves-effect waves-light btn-large">UnBlock</a>
                <a onClick={deleteUsers} className="waves-effect waves-light btn-large">Delete</a>
            </div>
            <table>
                <thead>
                <tr>
                    <th>
                        <label>
                            <input onChange={checkAll} type="checkbox" checked={users.length === checkedUser.length} />
                            <span> </span>
                        </label>
                    </th>
                    {generateHeaders()}
                </tr>
                </thead>
                <tbody>
                    {generateBody()}
                </tbody>
            </table>
        </div>

    )
}