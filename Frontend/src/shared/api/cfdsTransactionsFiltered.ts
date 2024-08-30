import { userStore } from "../../app/store/userStore";
import { refresh } from "./refresh";

export const cfdsTransactionsFiltered = async (): Promise<UserTransactionsProps[]> => {
    await fetch('http://localhost:8080/cfoesTransactions', {
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
            return data;
        })
        .catch((err) => console.log(err));
}