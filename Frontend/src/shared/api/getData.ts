import { userStore } from '../../app/store/userStore';

export const getData = async (setLoading: () => void): Promise<void> => {
  await fetch('http://localhost:5000/transactions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((data) => {
      userStore.setUserTransactions(data);
    })
    .catch((err) => console.log(err));

  await fetch('http://localhost:5000/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((data) => {
      userStore.setUserUsers(data);
    })
    .catch((err) => console.log(err));

  await fetch('http://localhost:5000/CFDs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((data) => {
      userStore.setUserUsers(data);
      if (userStore.userRole !== 'admin') {
        setLoading();
      }
    })
    .catch((err) => console.log(err));
  if (userStore.userRole === 'admin') {
    await fetch('http://localhost:5000/owners', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        userStore.setUserOwners(data);
        setLoading();
      })
      .catch((err) => console.log(err));
  }
};
