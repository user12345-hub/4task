import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";
import {Link} from "react-router-dom";

export const RegPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        regDate: '',
        lastLoginDate: ''
    })

    useEffect( () => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () =>{
        try{
            const data = await request('/api/auth/register', 'POST', {...form})
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
                        <span className="card-title">Create your account</span>
                        <div>

                            <div className="input-field">
                                <input
                                    placeholder="Enter name"
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="yellow-input"
                                    value={form.name}
                                    onChange={changeHandler}
                                    disabled={loading}
                                />
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Enter email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                    value={form.email}
                                    onChange={changeHandler}
                                    disabled={loading}
                                />
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Enter password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    value={form.password}
                                    onChange={changeHandler}
                                    disabled={loading}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn cyan lighten-1"
                            onClick={registerHandler}
                            disabled={loading}
                            style={{marginRight: 10}}
                        >
                            sign up
                        </button>

                        <Link to="/login">
                            <button
                                className="btn cyan lighten-1"
                                disabled={loading}
                            >
                                Back
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}