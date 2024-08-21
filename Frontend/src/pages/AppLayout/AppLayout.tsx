import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { userStore } from '../../app/store/userStore';
import { observer } from 'mobx-react-lite';
import { Header } from '../../widgets';
import { SideMenu } from '../../widgets';
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
                    {
                        !userStore.isAuth ? <Outlet /> : <></>
                    }
                    {
                        userStore.isAuth ? <div className="ProfilePage">
                                                <div className="ProfilePage__wrap">
                                                    <div className="SideMenu__container">
                                                        <SideMenu />
                                                    </div>
                                                    <section className="MainContent">
                                                        <Outlet />
                                                    </section>
                                                </div>
                                            </div>
                         : <></>
                    }
                </main>
            </div>
        </div>
    );
} )
