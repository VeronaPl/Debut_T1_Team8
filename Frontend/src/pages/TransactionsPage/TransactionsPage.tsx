import React, { useState } from 'react';
import './TransactionsPage.scss';
import { LoginButton } from '../../shared';
import { userStore } from '../../app/store/userStore';
import { UserTransactionsProps } from '../../app/store/userStore';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdb-react-ui-kit';
import { MDBIcon } from 'mdbreact';
import { useNavigate } from 'react-router';

export const TransactionsPage = (): JSX.Element => {
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');

  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserTransactionsProps[]>([...userStore.transactions]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [sortType, setSortType] = useState<keyof UserTransactionsProps>('username_sender');

  const route = useNavigate();

  const sorting = (col: keyof UserTransactionsProps) => {
    if (order === 'asc') {
      const sorted = [...searchResults].sort((a, b) => (a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1));
      setSearchResults(sorted);
      setOrder('desc');
    } else {
      const sorted = [...searchResults].sort((a, b) => (a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? -1 : 1));
      setSearchResults(sorted);
      setOrder('asc');
    }
    setSortType(col);
  }

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
    } else {
      setSearchResults([...userStore.transactions]);
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
        <div className='dataAnaliz__table'>
          <MDBTable className='MDBTable' align='middle' hover responsive>
            <MDBTableHead light >
              <tr className='dataAnaliz__table__head' style={{"fontSize": "18px" , "fontWeight": "600"}}>
                <th scope='col'>№</th>
                <th scope='col' onClick={() => sorting('username_sender')}>Отправитель  { sortType === 'username_sender' && <span><MDBIcon fas className='dataAnaliz__table__head_arrow' icon={`arrow-${ order === 'asc' ? "down" : "up"}`} /></span>}</th>
                <th scope='col' onClick={() => sorting('username_recipient')}>Получатель  { sortType === 'username_recipient' && <span><MDBIcon fas className='dataAnaliz__table__head_arrow' icon={`arrow-${ order === 'asc' ? "down" : "up"}`} /></span>}</th>
                <th scope='col' onClick={() => sorting('sum')}>Сумма  { sortType === 'sum' && <span><MDBIcon fas className='dataAnaliz__table__head_arrow' icon={`arrow-${ order === 'asc' ? "down" : "up"}`} /></span>}</th>
                <th scope='col' onClick={() => sorting('date_time')}>Дата  { sortType === 'date_time' && <span><MDBIcon fas className='dataAnaliz__table__head_arrow' icon={`arrow-${ order === 'asc' ? "down" : "up"}`} /></span>}</th>
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
                    <td className='clickable' onClick={() => {route(`/${transaction.username_sender}`)}}>{transaction.username_sender}</td>
                    <td className='clickable' onClick={() => {route(`/${transaction.username_sender}`)}}>{transaction.username_recipient}</td>
                    <td>{transaction.sum}</td>
                    <td>{transaction.date_time}</td>
                  </tr>
                </MDBTableBody>
              ))
            )}
          </MDBTable>
        </div>
        
      </div>
    </div>
  );
};
