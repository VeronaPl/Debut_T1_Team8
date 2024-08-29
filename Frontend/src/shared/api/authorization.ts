import { userStore } from '../../app/store/userStore';

export interface LoginProps {
  login: string;
  password: string;
}

export const authorization = async ({ login = '', password = '' }: LoginProps): Promise<void> => {
  await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Controls-Accept': '*/*'
    },
    body: JSON.stringify({ login: login, password: password })
  })
    .then((res) => res.json())
    .then((data) => {
      userStore.setUserToken(data);
    })
    .catch((err) => {
      fetch('http://localhost:8080/newToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Controls-Accept': '*/*'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          userStore.setUserToken(data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
};
