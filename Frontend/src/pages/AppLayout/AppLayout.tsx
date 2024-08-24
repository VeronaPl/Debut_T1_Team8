import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { userStore } from '../../app/store/userStore';
import { observer } from 'mobx-react-lite';
import { Header } from '../../widgets';
import { SideMenu } from '../../widgets';
import { getData } from '../../shared/api';
import { MDBSpinner } from 'mdb-react-ui-kit';
import "./AppLayout.scss"; 


export const AppLayout = observer( ():JSX.Element => {

    const [loading, setLoading] = useState<boolean>(true);

    function ScrollToTop() {
        const { pathname } = useLocation();
      
        useEffect(() => {
          window.scrollTo(0, 0);
        }, [pathname]);
      
        return null
    }

    useEffect(() => {
        getData(() => setLoading(false))
    }, [loading]);

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
                        userStore.isAuth ? 
                                            <div className="ProfilePage">
                                                <div className="ProfilePage__wrap">
                                                    <div className="SideMenu__container">
                                                        <SideMenu />
                                                    </div>
                                                    <section className="MainContent">
                                                        {
                                                            loading ? 
                                                                <div className='d-flex justify-content-center m-auto'>
                                                                    <MDBSpinner role='status'>
                                                                        <span className='visually-hidden'>Loading...</span>
                                                                    </MDBSpinner> 
                                                                </div>
                                                                
                                                            : <Outlet />
                                                        }
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
