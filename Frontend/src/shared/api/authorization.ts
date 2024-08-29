import { userStore } from '../../app/store/userStore';

export interface LoginProps {
  login: string;
  password: string;
  // setLoading: () => void;
}

export const authorization = async ({ login, password, setLoading }: LoginProps) => {

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
      userStore.setUserAuth(data.token ? true : false);
    })
    .catch((err) => {
      console.log(err);
    });
};
