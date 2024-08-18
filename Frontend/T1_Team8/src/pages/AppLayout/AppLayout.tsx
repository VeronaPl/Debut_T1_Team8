
import React from 'react'
import { Outlet } from 'react-router-dom';


import "./AppLayout.scss"

export const AppLayout = ():JSX.Element => {
    return (
        <div>
            {/* TODO: заменить на AppHeader */}
            <header>
                <h1>AppHeader</h1>
            </header>
            <main>
                <Outlet />
            </main>
            {/* TODO: заменить на AppFooter */}
            <footer>
                <h1>AppFooter</h1>
            </footer>
        </div>
    );
}
