import { userStore } from "../../app/store/userStore";

export const refresh = async () => {
    await fetch('http://localhost:8080/newToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.getUserToken()}`
        }
    })
        .then((res) => res.json())
        .then((data) => {
            userStore.setUserToken(data.token);
            localStorage.clear();
            localStorage.setItem('token', data.token);
        })
        .catch((err) => console.log(err));
}