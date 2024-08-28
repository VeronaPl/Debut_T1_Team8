import React, { useState } from 'react';
import './CFDsPage.scss';
import { LoginButton } from '../../shared';
import { DataAnaliz } from '../../features';
import { ModalCreate } from '../../features/ModalCreate/ModalCreate';
import { userStore } from '../../app/store/userStore';

export const CFDsPage = (): JSX.Element => {
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');

  return (
    <div>
      <h1 className='MainContent__title'>Центры Финансового Обеспечения</h1>
      {userStore.userRole === 'admin' && (
        <div className='MainContent__button'>
          <LoginButton
            title='Создать ЦФО'
            type='button'
            color='green'
            onClick={() => {
              setModalCreate(true);
              setTypeModal('cfds');
            }}
          />
        </div>
      )}
      
      {modalCreate && <ModalCreate modalWindow={modalCreate} setModalWindow={() => setModalCreate(false)} title={'Создание ЦФО'} typeModal={typeModal}/>}
      <DataAnaliz needFilterSection={false} />
    </div>
  );
};
