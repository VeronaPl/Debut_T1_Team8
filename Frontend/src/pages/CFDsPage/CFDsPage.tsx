import React, { useState } from 'react';
import './CFDsPage.scss';
import { LoginButton } from '../../shared';
import { DataAnaliz } from '../../features';

export const CFDsPage = (): JSX.Element => {
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');

  return (
    <div>
      <h1 className='MainContent__title'>Центры Финансового Обеспечения</h1>
      <div className='MainContent__button'>
        <LoginButton
          title='Создать ЦФО'
          type='button'
          color='green'
          onClick={() => {
            setModalCreate(true);
            setTypeModal('transaction');
          }}
        />
      </div>
      <DataAnaliz needFilterSection={false} />
    </div>
  );
};
