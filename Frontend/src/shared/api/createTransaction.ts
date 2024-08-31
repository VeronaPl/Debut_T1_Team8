import { userStore } from '../../app/store/userStore';
import { refresh } from './refresh';

export interface createTransactionProps {
    AllcfoId: number;
    newSum: number;
    comment: string;
  }

export const createTransaction = async (data: createTransactionProps) => {
    await fetch(`http://localhost:8080/adminToCFO?AllcfoId=${data.AllcfoId}&newSum=${data.newSum}&comment=${data.comment}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.getUserToken()}`
        },
        body: JSON.stringify(data)
    })
        .then((res) => {
            if (res.status === 500 || res.status === 401) {
                refresh();
            }
            return res.json()
        })
        .then((data) => {
            userStore.transactions.push(data);
        })
        .catch((err) => console.log(err));
}