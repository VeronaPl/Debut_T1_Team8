import React, { useState } from 'react';
import './TransactionsPage.scss';
import { LoginButton, ModalWindow } from '../../shared';
import { DataAnaliz } from '../../features';
import { ModalCreate } from '../../features/ModalCreate/ModalCreate';

export const TransactionsPage = (): JSX.Element => {
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');

  return (
    <div>
      <h1 className='MainContent__title'>История транзакций</h1>
      <div className='MainContent__button'>
        <LoginButton
          title='Создать перевод'
          type='button'
          color='green'
          onClick={() => {
            setModalCreate(true);
            setTypeModal('transaction');
          }}
        />
      </div>
      {modalCreate && (
        <ModalCreate
          modalWindow={modalCreate}
          setModalWindow={() => setModalCreate(false)}
          title={'Создать перевод'}
          typeModal={typeModal}
        />
      )}
      <DataAnaliz needFilterSection={true} pageKind={'transactions'} />
    </div>
  );
};
