import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {TablePage} from "./pages/TablePage"
import {AuthPage} from "./pages/AuthPage"
import {RegPage} from "./pages/RegPage"

export const useRoutes = isAuthenticated => {
    if (isAuthenticated){
        return (
            <Switch>
                <Route path="/table" exact>
                    <TablePage />
                </Route>
                <Redirect to="/table"/>
            </Switch>
        )
    }

    return(
        <Switch>
            <Route path="/login">
                <AuthPage />
            </Route>
            <Route path="/register" exact>
                <RegPage />
            </Route>
            <Redirect to="/login" />
        </Switch>
    )
}