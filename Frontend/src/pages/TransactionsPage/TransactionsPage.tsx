import React, { useState } from 'react';
import './TransactionsPage.scss';
import { LoginButton } from '../../shared';


export const TransactionsPage = ():JSX.Element => {

    const [modalCreate, setModalCreate] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<string>('');

    return (
        <div>
            <h1 className='MainContent__title'>История транзакций</h1>
            <div className='MainContent__button'><LoginButton title='Создать перевод' type='button' color='green' onClick={() => {setModalCreate(true); setTypeModal('transaction')}} /></div>
        </div>
    );
}