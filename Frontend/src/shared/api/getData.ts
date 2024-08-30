import { userStore } from '../../app/store/userStore';
import { refresh } from './refresh';

export const getData = async (setLoading: () => void): Promise<void> => {
  await fetch('http://localhost:8080/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.getUserToken()}`
    }
  })
    .then((res) => {
      if (res.status === 500 || res.status === 401) {
        refresh();
      }
      return res.json()
    })
    .then((data) => {
      userStore.setUserData(data.id, data.firstName, data.lastName, data.averageName, data.login, data.role, data.sum);
    })
    .catch((err) => console.log(err));

  await fetch(`http://localhost:8080/cfoesTransactions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.getUserToken()}`
    }
  })
    .then((res) => {
      if (res.status === 500 || res.status === 401) {
        refresh();
      }
      return res.json()
    })
    .then((data) => {
      userStore.transactions = data;
    })
    .catch((err) => console.log(err));

  await fetch('http://localhost:8080/cfoes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.getUserToken()}`
    }
  })
  .then((res) => {
    if (res.status === 500 || res.status === 401) {
      refresh();
    }
    return res.json()
  })
  .then((data) => {
    userStore.CFDs = data;

  })
  .catch((err) => console.log(err));
  
  await fetch('http://localhost:8080/owners', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.getUserToken()}`
    }
  })
  .then((res) => {
    if (res.status === 500 || res.status === 401) {
      refresh();
    }
    return res.json()
  })
  .then((data) => {
    userStore.owners = data;
  })
  .catch((err) => console.log(err));
  
  await fetch('http://localhost:8080/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.getUserToken()}`
    }
  })
  .then((res) => {
    if (res.status === 500 || res.status === 401) {
      refresh();
    }
    return res.json()
  })
  .then((data) => {
    userStore.users = data;
    setLoading();
  })
  .catch((err) => console.log(err));
  console.log(userStore.users)
};
