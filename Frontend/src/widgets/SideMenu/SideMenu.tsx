import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './SideMenu.scss';
import { SideMenuData } from '../../entities';

export const SideMenu = (): JSX.Element => {
  const location = useLocation();
  const router = useNavigate();
  return (
    <section className='SideMenu'>
      <ul className='SideMenu__list'>
        {SideMenuData().map((value, index) => {
          return (
            <li
              key={index}
              className={location.pathname === value.path ? 'SideMenu__item active' : 'SideMenu__item'}
              onClick={() => router(value.path)}
            >
              {value.title}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
