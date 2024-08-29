import { userStore } from '../../app/store/userStore';

export interface LoginProps {
  login: string;
  password: string;
}

export const authorization = async ({ login, password }: LoginProps) => {

  await fetch(`http://localhost:8080/login?login=${login}&password=${password}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Controls-Accept': '*/*'
    },
    body: JSON.stringify({ login, password })
  })
    .then((res) => {
      if (res.status === 403) {
        alert('Пользователя нет в системе');
      }
      return res.json()
    })
    .then((data) => {
      userStore.setUserToken(data.token);
      localStorage.setItem('token', data.token);
      userStore.setUserAuth(userStore.getUserToken() ? true : false);
    })
    .catch((err) => {
      console.log(err);
    });
};
