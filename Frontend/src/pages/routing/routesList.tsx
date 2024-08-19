import React from 'react'
import { CFDsPage } from '../CFDsPage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { UsersPage } from '../UsersPage';
import { OwnersPage } from '../OwnersPage';
import { TransactionsPage } from '../TransactionsPage';
import { ProfilePage } from '../ProfilePage';
import { DefaultRoute } from './defaultRoute';
import { Navigate } from 'react-router-dom';
import { withAuth } from './withAuth';
import { withoutAuth } from './withoutAuth';
import { isNotUser } from './isnotUser';
import { isAdmin } from './isAdmin';


export const routesList = () => {
    return [
        {
            path: "/",
            element: <DefaultRoute />
        }, 
        {
            path: "/login",
            element: React.createElement(withoutAuth(LoginPage)),
        },
        {
            path: "/register",
            element: React.createElement(withoutAuth(RegisterPage)),
        },
        {
            path: "/cfds",
            element: React.createElement(isNotUser(CFDsPage)),
        },
        {
            path: "/users",
            element: React.createElement(isNotUser(UsersPage)),
        },
        {
            path: "/owners",
            element: React.createElement(isAdmin(OwnersPage)),
        },
        {
            path: "/transactions",
            element: React.createElement(withAuth(TransactionsPage)),
        },
        {
            path: "/:profile",
            element: React.createElement(withAuth(ProfilePage)),
        }
    ]
}