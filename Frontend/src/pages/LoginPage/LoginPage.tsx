import React from 'react';
import './LoginPage.scss';
import { LoginForm } from '../../features';

export const LoginPage = ():JSX.Element => {
    return (    
        <div className='form__container'>
            <h1 className='form__title'>Вход</h1>
            <LoginForm />
        </div>
    );
}