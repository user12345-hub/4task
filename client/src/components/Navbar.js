import React, {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }

    return(
        <nav>
            <div className="nav-wrapper blue-grey darken-4">
                <a href="#" className="brand-logo"></a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                        <a href="/" onClick={logoutHandler}>
                            Log out
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )

}