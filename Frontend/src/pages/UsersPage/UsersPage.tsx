import React from 'react';
import './UsersPage.scss';
import { DataAnaliz } from '../../features';

export const UsersPage = (): JSX.Element => {
  return (
    <div>
      <h1 className='MainContent__title withoutButton'>Список пользователей</h1>
      <DataAnaliz needFilterSection={false} pageKind={'users'}/>
    </div>
  );
};
