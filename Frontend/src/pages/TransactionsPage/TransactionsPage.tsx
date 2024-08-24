import React, { useState } from 'react';
import './TransactionsPage.scss';
import { LoginButton } from '../../shared';
import { userStore } from '../../app/store/userStore';
import { UserTransactionsProps } from '../../app/store/userStore';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdb-react-ui-kit';

export const TransactionsPage = (): JSX.Element => {
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');

  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserTransactionsProps[]>([...userStore.transactions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const search = searchValue.toLowerCase();
    const arr = [...searchResults];

    if (search !== '') {
      setSearchResults(
        arr.filter(
          (transaction: UserTransactionsProps) =>
            ('username_sender' in transaction &&
              transaction.username_sender.toString().toLowerCase().includes(search)) ||
            ('username_recipient' in transaction &&
              transaction.username_recipient.toString().toLowerCase().includes(search)) ||
            ('id_sender' in transaction && transaction.id_sender.toString().toLowerCase().includes(search)) ||
            ('id_recipient' in transaction && transaction.id_recipient.toString().toLowerCase().includes(search))
        )
      );
    }
  };

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
      <div className='dataAnaliz'>
        <form onSubmit={handleSearch} className='dataAnaliz__form d-flex input-group w-auto'>
          <input
            type='text'
            className='dataAnaliz__form__input'
            placeholder='Поиск'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type='submit' className='dataAnaliz__form__button'>
            Найти
          </button>
        </form>
        <MDBTable className='MDBTable' align='middle' hover responsive>
          <MDBTableHead light>
            <tr>
              <th scope='col'>№</th>
              <th scope='col'>Отправитель</th>
              <th scope='col'>Получатель</th>
              <th scope='col'>Сумма</th>
              <th scope='col'>Дата</th>
            </tr>
          </MDBTableHead>
          {searchResults.length === 0 ? (
            <MDBTableBody className='align-center mb-0'>
              <tr>
                <td className='text-center mb-0' colSpan={5}>
                  Нет данных
                </td>
              </tr>
            </MDBTableBody>
          ) : (
            searchResults.map((transaction: UserTransactionsProps, index: number) => (
              <MDBTableBody key={index}>
                <tr>
                  <th scope='row'>{index + 1}</th>
                  <td className='clickable'>{transaction.username_sender}</td>
                  <td className='clickable'>{transaction.username_recipient}</td>
                  <td>{transaction.sum}</td>
                  <td>{transaction.date_time}</td>
                </tr>
              </MDBTableBody>
            ))
          )}
        </MDBTable>
      </div>
    </div>
  );
};
