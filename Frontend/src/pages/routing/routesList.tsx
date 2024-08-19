import React from 'react'
import { CFDsPage } from '../CFDsPage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { UsersPage } from '../UsersPage';
import { OwnersPage } from '../OwnersPage';
import { TransactionsPage } from '../TransactionsPage';
import { ProfilePage } from '../ProfilePage';
import { Navigate } from 'react-router-dom';


export const routesList = () => {
    return [
        {
            path: "/",
            element: <Navigate to="/login" />
        }, 
        {
            path: "/login",
            element: <LoginPage />
        },
        {
            path: "/register",
            element: <RegisterPage />
        },
        {
            path: "/cfds",
            element: <CFDsPage />
        },
        {
            path: "/users",
            element: <UsersPage />
        },
        {
            path: "/owners",
            element: <OwnersPage />
        },
        {
            path: "/transactions",
            element: <TransactionsPage />
        },
        {
            path: "/:profile",
            element: <ProfilePage />
        }
    ]
}