import React from 'react'
import { CFDPage } from '../CFDPage/CFDPage';
import { LoginPage } from '../LoginPage/LoginPage';
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
            path: "/cfd",
            element: <CFDPage />
        }
    ]
}