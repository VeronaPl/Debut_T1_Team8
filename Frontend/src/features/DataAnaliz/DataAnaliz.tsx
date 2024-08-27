import React, { useState, useEffect } from 'react';
import './DataAnaliz.scss';
import { userStore } from '../../app/store/userStore';
import { CFDsProps } from '../../app/store/userStore';
import { UserTransactionsProps } from '../../app/store/userStore';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from 'mdb-react-ui-kit';
import { MultiSelect } from 'react-multi-select-component';
import Select from 'react-select';
import { MDBIcon } from 'mdbreact';
import { useNavigate } from 'react-router';

export const DataAnaliz = (): JSX.Element => {
  // data
  const [fullData, setFullData] = useState<UserTransactionsProps[]>([...userStore.transactions]);
  // pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(Math.ceil(fullData.length / itemsPerPage));
  // search
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserTransactionsProps[]>(
    [...fullData].slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  );
  // filter
  const [CFDs, setCFDs] = useState<CFDsProps[]>([]);
  const types = [
    { label: 'Пользователю', value: 'ToUser' },
    { label: 'Между ЦФО', value: 'BetweenCFDs' },
    { label: 'Покупка', value: 'Buy' }
  ];
  const [owners, setOwners] = useState<CFDsProps[]>([]);
  const [selectedCFDs, setSelectedCFDs] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedFilterType, setSelectedFilterType] = useState<string | null>('');
  const [selectedDateStart, setSelectedDateStart] = useState<string | null>('');
  const [selectedDateEnd, setSelectedDateEnd] = useState<string | null>('');
  // sorting
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [sortType, setSortType] = useState<keyof UserTransactionsProps>('username_sender');

  const route = useNavigate();

  useEffect(() => {
    setSearchResults([...fullData].slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage));
  }, [currentPage, itemsPerPage, fullData]);

  useEffect(() => {
    setTotalPages(Math.ceil(fullData.length / itemsPerPage));
  }, [fullData, itemsPerPage, searchValue, selectedFilterType, selectedDateStart, selectedDateEnd, selectedOwners, selectedCFDs]);

  useEffect(() => {
    getFilteringOptionsCFDs();
    getFilteringOptionsOwners();
  }, [userStore.transactions, userStore.owners]);

  const getFilteringOptionsCFDs = () => {
    if (userStore.transactions.length !== 0) {
      const uniqueCFDs = userStore.transactions
        .filter(
          (transaction, index, self) =>
            index === self.findIndex((t) => t.username_sender === transaction.username_sender)
        )
        .map((transaction) => ({ label: transaction.username_sender, value: transaction.username_sender }));
      setCFDs(uniqueCFDs);
    }
  };

  const getFilteringOptionsOwners = () => {
    if (userStore.owners.length !== 0) {
      const uniqueOwners = userStore.owners
        .filter((owner, index, self) => index === self.findIndex((o) => o.login === owner.login))
        .map((owner) => ({ label: owner.login, value: owner.login }));
      setOwners(uniqueOwners);
    }
  };

  const sorting = (col: keyof UserTransactionsProps) => {
    if (col !== 'date_time') {
      if (order === 'asc') {
        const sorted = [...fullData].sort((a, b) =>
          a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1
        );
        setFullData(sorted);
        setOrder('desc');
        setCurrentPage(0);
      } else {
        const sorted = [...fullData].sort((a, b) =>
          a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? -1 : 1
        );
        setFullData(sorted);
        setOrder('asc');
        setCurrentPage(0);
      }
      setSortType(col);
    } else {
      if (order === 'asc') {
        const sorted = [...fullData].sort((a, b) => {
          const dateA = a[col].split('.').reverse().join('-');
          const dateB = b[col].split('.').reverse().join('-');
          return dateA.localeCompare(dateB);
        });
        setFullData(sorted);
        setOrder('desc');
        setCurrentPage(0);
      } else {
        const sorted = [...fullData].sort((a, b) => {
          const dateA = a[col].split('.').reverse().join('-');
          const dateB = b[col].split('.').reverse().join('-');
          return dateB.localeCompare(dateA);
        });
        setFullData(sorted);
        setOrder('asc');
        setCurrentPage(0);
      }
      setSortType(col);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const search = searchValue.toLowerCase();
    const arr = [...userStore.transactions];

    if (search !== '') {
      setCurrentPage(0);
      setFullData(
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
      setCurrentPage(0);
      setFullData([...userStore.transactions]);
      setSelectedCFDs([]);
      setSelectedOwners([]);
      setSelectedFilterType(null);
      setSelectedDateStart('');
      setSelectedDateEnd('');
    }
  };

  const handleFiltering = (filterType: string) => {
    setCurrentPage(0);
    const arr = [...userStore.transactions];

    switch (filterType) {
      case 'SelectCFDs':
        if (selectedCFDs.length === 0) {
          setFullData([...userStore.transactions]);
        } else {
          const selectedCFDsArray = selectedCFDs.map((cfds) => cfds.value);
          setFullData(
            arr.filter(
              (transaction: UserTransactionsProps) =>
                'type' in transaction &&
                transaction.type == 'BetweenCFDs' &&
                (('username_sender' in transaction && transaction.username_sender in selectedCFDsArray) ||
                  ('username_recipient' in transaction && transaction.username_recipient in selectedCFDsArray) ||
                  ('id_sender' in transaction && transaction.id_sender in selectedCFDsArray) ||
                  ('id_recipient' in transaction && transaction.id_recipient in selectedCFDsArray))
            )
          );
        }
        break;
      case 'SelectType':
        if (selectedFilterType === null) {
          setFullData([...userStore.transactions]);
        } else {
          setFullData(
            arr.filter(
              (transaction: UserTransactionsProps) => 'type' in transaction && transaction.type == selectedFilterType
            )
          );
        }
        break;
      case 'SelectOwners':
        setCurrentPage(0);
        if (selectedOwners.length === 0) {
          setFullData([...userStore.transactions]);
        } else {
          setFullData(
            arr.filter(
              (transaction: UserTransactionsProps) =>
                'type' in transaction &&
                transaction.type == 'BetweenCFDs' &&
                'owner' in transaction &&
                transaction.owner in selectedOwners
            )
          );
        }
        break;
      case 'SelectDateStart':
        if (selectedDateStart === '') {
          setCurrentPage(0);
          setFullData([...userStore.transactions]);
        } else {
          setCurrentPage(0);
          if (selectedDateEnd === '') {
            setFullData(
              arr.filter(
                (transaction: UserTransactionsProps) =>
                  'date_time' in transaction &&
                  new Date(convertDateFormat(transaction.date_time.toString())) >= new Date(selectedDateStart)
              )
            );
          } else {
            setFullData(
              arr.filter(
                (transaction: UserTransactionsProps) =>
                  'date_time' in transaction &&
                  new Date(convertDateFormat(transaction.date_time.toString())) >= new Date(selectedDateStart) &&
                  new Date(convertDateFormat(transaction.date_time.toString())) <= new Date(selectedDateEnd)
              )
            );
          }
        }
        break;
      case 'SelectDateEnd':
        if (selectedDateEnd === '') {
          setCurrentPage(0);
          setFullData([...userStore.transactions]);
        } else {
          setCurrentPage(0);
          if (selectedDateStart === '') {
            setFullData(
              arr.filter(
                (transaction: UserTransactionsProps) =>
                  'date_time' in transaction &&
                  new Date(convertDateFormat(transaction.date_time.toString())) <= new Date(selectedDateEnd)
              )
            );
          } else {
            setFullData(
              arr.filter(
                (transaction: UserTransactionsProps) =>
                  'date_time' in transaction &&
                  new Date(convertDateFormat(transaction.date_time.toString())) <= new Date(selectedDateEnd) &&
                  new Date(convertDateFormat(transaction.date_time.toString())) >= new Date(selectedDateStart)
              )
            );
          }
        }
        break;
      default:
        setFullData([...userStore.transactions]);
        break;
    }
  };

  const convertDateFormat = (dateString: string): string => {
    {
      /*from '14.01.2022' to '2022-01-14'*/
    }
    const dateConverted = dateString.split('.').reverse().join('-');
    return dateConverted;
  };

  const renderPagination = () => {
    return (
      <MDBPagination className='mb-0 dataAnaliz__pagination'>
        {currentPage === 0 ? (
          <>
            <MDBPaginationItem disabled>
              <MDBPaginationLink>
                <MDBIcon fas icon='angle-double-left' onClick={() => setCurrentPage(0)} />
              </MDBPaginationLink>
            </MDBPaginationItem>
            <MDBPaginationItem disabled>
              <MDBPaginationLink>
                <MDBIcon fas icon='angle-left' onClick={() => setCurrentPage(currentPage - 1)} />
              </MDBPaginationLink>
            </MDBPaginationItem>
          </>
        ) : (
          <>
            <MDBPaginationItem>
              <MDBPaginationLink>
                <MDBIcon fas icon='angle-double-left' onClick={() => setCurrentPage(0)} />
              </MDBPaginationLink>
            </MDBPaginationItem>
            <MDBPaginationItem>
              <MDBPaginationLink>
                <MDBIcon fas icon='angle-left' onClick={() => setCurrentPage(currentPage - 1)} />
              </MDBPaginationLink>
            </MDBPaginationItem>
          </>
        )}
        <MDBPaginationItem className='dataAnaliz__pagination__current'>{currentPage + 1}</MDBPaginationItem>
        {currentPage === totalPages - 1 ? (
          <>
            <MDBPaginationItem disabled>
              <MDBPaginationLink>
                <MDBIcon fas icon='angle-right' onClick={() => setCurrentPage(currentPage + 1)} />
              </MDBPaginationLink>
            </MDBPaginationItem>
            <MDBPaginationItem disabled>
              <MDBPaginationLink>
                <MDBIcon fas icon='angle-double-right' onClick={() => setCurrentPage(totalPages - 1)} />
              </MDBPaginationLink>
            </MDBPaginationItem>
          </>
        ) : (
          <>
            <MDBPaginationItem>
              <MDBPaginationLink>
                <MDBIcon fas icon='angle-right' onClick={() => setCurrentPage(currentPage + 1)} />
              </MDBPaginationLink>
            </MDBPaginationItem>
            <MDBPaginationItem>
              <MDBPaginationLink>
                <MDBIcon fas icon='angle-double-right' onClick={() => setCurrentPage(totalPages - 1)} />
              </MDBPaginationLink>
            </MDBPaginationItem>
          </>
        )}
      </MDBPagination>
    );
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
        {userStore.userRole === 'admin' || userStore.userRole === 'owner' ? (
          <div className='dataAnaliz__filterSection__select'>
            <label id='SelectCFDs' className='dataAnaliz__filterSection__select__label'>
              По ЦФО
            </label>
            <MultiSelect
              className='dataAnaliz__filterSection__select__item'
              options={CFDs}
              value={selectedCFDs}
              onChange={(e) => {setSelectedCFDs(e); handleFiltering('SelectCFDs')}}
              labelledBy='SelectCFDs'
            />
          </div>
        ) : (
          <></>
        )}
        <div className='dataAnaliz__filterSection__select'>
          <label id='SelectType' className='dataAnaliz__filterSection__select__label'>
            По типу
          </label>
          <Select
            className='dataAnaliz__filterSection__select__item'
            options={types}
            value={selectedFilterType}
            onChange={setSelectedFilterType}
            isClearable={true}
          />
        </div>
        {userStore.userRole === 'admin' ? (
          <div className='dataAnaliz__filterSection__select'>
            <label id='SelectOwners' className='dataAnaliz__filterSection__select__label'>
              По владельцу
            </label>
            <MultiSelect
              className='dataAnaliz__filterSection__select__item'
              options={owners}
              value={selectedOwners}
              onChange={setSelectedOwners}
              labelledBy='SelectOwners'
            />
          </div>
        ) : (
          <></>
        )}
        {userStore.userRole === 'admin' || userStore.userRole === 'owner' ? (
          <>
            <div className='dataAnaliz__filterSection__select'>
              <label id='SelectDate' className='dataAnaliz__filterSection__select__label'>
                Начало
              </label>
              <input
                type='date'
                className='dataAnaliz__filterSection__select__item__date'
                id='start'
                name='trip-start'
                value={selectedDateStart}
                onChange={(e) => {
                  setSelectedDateStart(e.target.value);
                  handleFiltering('SelectDateStart');
                }}
              />
            </div>
            <div className='dataAnaliz__filterSection__select'>
              <label id='SelectDate' className='dataAnaliz__filterSection__select__label'>
                Конец
              </label>
              <input
                type='date'
                disabled={selectedDateStart === null || selectedDateStart === ''}
                className='dataAnaliz__filterSection__select__item__date'
                id='end'
                name='trip-start'
                value={selectedDateEnd}
                onChange={(e) => {
                  setSelectedDateEnd(e.target.value);
                  handleFiltering('SelectDateEnd');
                }}
              />{' '}
              {/*2024-08-14*/}
            </div>
          </>
        ) : (
          <></>
        )}
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
              <th scope='col' className='hoverable' onClick={() => sorting('date_time')}>
                Дата
                {sortType === 'date_time' && (
                  <span>
                    <MDBIcon
                      fas
                      className='dataAnaliz__table__head_arrow'
                      icon={`arrow-${order === 'asc' ? 'down' : 'up'}`}
                    />
                  </span>
                )}
              </th>
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
              <MDBTableBody key={index + currentPage * itemsPerPage}>
                <tr>
                  <th scope='row'>{index + 1 + currentPage * itemsPerPage}</th>
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

      <div className='dataAnaliz__pagination'>{renderPagination()}</div>
    </div>
  );
};
