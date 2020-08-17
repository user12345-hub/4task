import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'
import {Link} from 'react-router-dom'



export const AuthPage = () =>{
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    useEffect( () => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }


    const loginHandler = async () =>{
        try{
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId, data.userEmail)
        } catch (e){

        }
    }

    return(
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>task number 4</h1>
                <div className="card teal lighten-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>

                            <div className="input-field">
                                <input
                                    placeholder="Enter email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                    onChange={changeHandler}
                                />
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Enter password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    onChange={changeHandler}
                                    disabled={loading}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn light-blue lighten-2"
                            style={{marginRight: 15}}
                            onClick={loginHandler}
                            disabled={loading}
                        >
                            Sign in
                        </button>
                        <Link to={'/register'}>
                            <button
                                className="btn cyan lighten-1"
                                disabled={loading}
                            >
                                sign up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}