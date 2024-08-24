import { userStore } from "../../app/store/userStore";


export const getData = async (setLoading: () => void):Promise<void> => {

    await fetch('http://localhost:5000/transactions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())
    .then(data => {userStore.setUserTransactions(data); setLoading();})
    .catch(err => console.log(err));

}