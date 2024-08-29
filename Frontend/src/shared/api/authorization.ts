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
    .then((res) => console.log(res))
    .then((data) => {
      console.log(data);
      userStore.setUserToken(data);
      setLoading();
    })
    .catch((err) => {
      console.log(err);
    });
};
