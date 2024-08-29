import { userStore } from '../../app/store/userStore';

export interface LoginProps {
  login: string;
  password: string;
  type: "login" | "register";
}

export const authorization = async ({ login, password, type }: LoginProps) => {

  await fetch(`http://localhost:8080/${type}?login=${login}&password=${password}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Controls-Accept': '*/*'
    },
    body: JSON.stringify({ login, password })
  })
    .then((res) => {
      if (res.status === 403) {
        alert('Неправильный логин или пароль');
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
