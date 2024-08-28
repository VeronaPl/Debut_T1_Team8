import React from 'react';
import './OwnersPage.scss';
import { LoginButton } from '../../shared';
import { DataAnaliz } from '../../features';

export const OwnersPage = (): JSX.Element => {
  return (
    <div>
      <h1 className='MainContent__title withoutButton'>Список владельцев</h1>
      <DataAnaliz needFilterSection={false} />
    </div>
  );
};
