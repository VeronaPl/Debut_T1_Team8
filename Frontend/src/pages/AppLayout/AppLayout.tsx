
import React from 'react'
import { Outlet } from 'react-router-dom';


import "./AppLayout.scss"

export const AppLayout = ():JSX.Element => {
    return (
        <div>
            <header>
                <h1>AppHeader</h1>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
