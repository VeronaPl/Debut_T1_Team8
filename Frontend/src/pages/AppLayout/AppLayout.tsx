import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { userStore } from '../../app/store/userStore';
import { observer } from 'mobx-react-lite';
import { Header } from '../../widgets/Header';
import "./AppLayout.scss"; 


export const AppLayout = observer( ():JSX.Element => {

    function ScrollToTop() {
        const { pathname } = useLocation();
      
        useEffect(() => {
          window.scrollTo(0, 0);
        }, [pathname]);
      
        return null
    }

    return (
        <div className='layout-wrap'>
            <ScrollToTop/>
            <header>
                <Header />
            </header>
            <div className="app-layout">
                <main>
                    <Outlet />
                </main>
            </div>
            
        </div>
    );
} )
