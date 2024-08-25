import React, { useState, useEffect } from "react";
import './DataAnaliz.scss';
import { userStore } from '../../app/store/userStore';
import { CFDsProps } from '../../app/store/userStore';
import { UserTransactionsProps } from '../../app/store/userStore';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-select'
import { MDBIcon } from 'mdbreact';
import { useNavigate } from 'react-router';



export const DataAnaliz = (): JSX.Element => {

    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResults, setSearchResults] = useState<UserTransactionsProps[]>([...userStore.transactions]);
    const [CFDs, setCFDs] = useState<CFDsProps[]>([]);
    const types = [{label: 'Пользователю', value: 'ToUser'}, {label: 'Между ЦФО', value: 'BetweenCFDs'}, {label: 'Покупка', value: 'Buy'}];
    const [owners, setOwners] = useState<CFDsProps[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [sortType, setSortType] = useState<keyof UserTransactionsProps>('username_sender');
    const [selectedCFDs, setSelectedCFDs] = useState([]);
    const [selectedOwners, setSelectedOwners] = useState([]);
    const [selectedFilterType, setSelectedFilterType] = useState<string | null>('');

    const route = useNavigate();

    useEffect(() => {
        getFilteringOptionsCFDs();
        getFilteringOptionsOwners();
    }, [userStore.transactions, userStore.owners]);

    const getFilteringOptionsCFDs = () => {
      if (userStore.transactions.length !== 0) {
        const uniqueCFDs = userStore.transactions.filter((transaction, index, self) =>
          index === self.findIndex((t) => t.username_sender === transaction.username_sender)
        ).map((transaction) => ({ label: transaction.username_sender, value: transaction.username_sender }));
        setCFDs(uniqueCFDs);
      }
    }

    const getFilteringOptionsOwners = () => {
      if (userStore.owners.length !== 0) {
        const uniqueOwners = userStore.owners.filter((owner, index, self) =>
          index === self.findIndex((o) => o.value === owner.value)
        ).map((owner) => ({ label: owner.label, value: owner.value }));
        setOwners(uniqueOwners);
      }
    }

    const sorting = (col: keyof UserTransactionsProps) => {
        if (order === 'asc') {
          const sorted = [...searchResults].sort((a, b) =>
            a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1
          );
          setSearchResults(sorted);
          setOrder('desc');
        } else {
          const sorted = [...searchResults].sort((a, b) =>
            a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? -1 : 1
          );
          setSearchResults(sorted);
          setOrder('asc');
        }
        setSortType(col);
      };
    
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

        <div className='dataAnaliz__filterSection'>
          <div className='dataAnaliz__filterSection__select'>
            <label id="SelectCFDs" className="dataAnaliz__filterSection__select__label">По ЦФО</label>
            <MultiSelect
              className='dataAnaliz__filterSection__select__item'
              options={CFDs}
              value={selectedCFDs}
              onChange={setSelectedCFDs}
              labelledBy="SelectCFDs"
            />
          </div>
          <div className='dataAnaliz__filterSection__select'>
            <label id="SelectType" className="dataAnaliz__filterSection__select__label">По типу</label>
            <Select className='dataAnaliz__filterSection__select__item' options={types} value={selectedFilterType} onChange={setSelectedFilterType} isClearable={true}/>
          </div>
          <div className='dataAnaliz__filterSection__select'>
            <label id="SelectOwners" className="dataAnaliz__filterSection__select__label">По владельцу</label>
            <MultiSelect
            className='dataAnaliz__filterSection__select__item'
            options={owners}
            value={selectedOwners}
            onChange={setSelectedOwners}
            labelledBy="SelectOwners"
            />
          </div>
          <div className='dataAnaliz__filterSection__select'>
            <label id="SelectDate" className="dataAnaliz__filterSection__select__label">Начало</label>
            <input type="date" className="dataAnaliz__filterSection__select__item__date" id="start" name="trip-start" />
          </div>
          <div className='dataAnaliz__filterSection__select'>
            <label id="SelectDate" className="dataAnaliz__filterSection__select__label">Конец</label>
            <input type="date" className="dataAnaliz__filterSection__select__item__date" id="end" name="trip-start" />
          </div>
        </div>

        <div className='dataAnaliz__table'>
          <MDBTable className='MDBTable' align='middle' hover responsive>
            <MDBTableHead light>
              <tr className='dataAnaliz__table__head' style={{ fontSize: '18px', fontWeight: '600' }}>
                <th scope='col'>№</th>
                <th scope='col' className='hoverable' onClick={() => sorting('username_sender')}>
                  Отправитель{' '}
                  {sortType === 'username_sender' && (
                    <span>
                      <MDBIcon
                        fas
                        className='dataAnaliz__table__head_arrow'
                        icon={`arrow-${order === 'asc' ? 'down' : 'up'}`}
                      />
                    </span>
                  )}
                </th>
                <th scope='col' className='hoverable' onClick={() => sorting('username_recipient')}>
                  Получатель{' '}
                  {sortType === 'username_recipient' && (
                    <span>
                      <MDBIcon
                        fas
                        className='dataAnaliz__table__head_arrow'
                        icon={`arrow-${order === 'asc' ? 'down' : 'up'}`}
                      />
                    </span>
                  )}
                </th>
                <th scope='col' className='hoverable' onClick={() => sorting('sum')}>
                  Сумма{' '}
                  {sortType === 'sum' && (
                    <span>
                      <MDBIcon
                        fas
                        className='dataAnaliz__table__head_arrow'
                        icon={`arrow-${order === 'asc' ? 'down' : 'up'}`}
                      />
                    </span>
                  )}
                </th>
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
                    <td
                      className='clickable'
                      onClick={() => {
                        route(`/${transaction.username_sender}`);
                      }}
                    >
                      {transaction.username_sender}
                    </td>
                    <td
                      className='clickable'
                      onClick={() => {
                        route(`/${transaction.username_recipient}`);
                      }}
                    >
                      {transaction.username_recipient}
                    </td>
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
}