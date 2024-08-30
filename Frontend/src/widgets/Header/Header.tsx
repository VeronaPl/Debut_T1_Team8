import React, { useState } from 'react';
import './Header.scss';
import { MoneyButton } from '../../shared/ui/buttons/Money';
import Logo from '../../shared/ui/logo/T1_logo2.svg';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../../app/store/userStore';
import { observer } from 'mobx-react-lite';

export const Header = observer(() => {
  const router = useNavigate();
  return (
    <div className='nav__container'>
      <nav className='nav__main'>
        <div
          className='logo__container'
          onClick={() => {
            router('/');
          }}
        >
          <img src={Logo} className='logo' alt='logo' />
        </div>
        <div>
          <h1 className='header__title'>Внутренняя валюта</h1>
        </div>

        <div className='money__container'>
          {/* Кнопка войти логин */}
          {userStore.isAuth && (userStore.userRole === 'user' || userStore.userRole === 'owner') ? (
            <div className='button-wrap'>
              <MoneyButton title={`${userStore.money}`} onClick={() => router(`/${userStore.userName}`)} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </div>
  );
});
