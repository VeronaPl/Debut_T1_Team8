import React from 'react'
import './RegisterPage.scss';
import { RegisterForm } from '../../features';


export const RegisterPage = ():JSX.Element => {
    return (
        <div className='form__container'>
            <h1 className='form__title'>Регистрация</h1>
            <RegisterForm />
        </div>
    );
}