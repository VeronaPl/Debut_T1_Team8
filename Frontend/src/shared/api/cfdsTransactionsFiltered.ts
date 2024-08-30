import { userStore } from "../../app/store/userStore";
import { refresh } from "./refresh";
import { UserTransactionsProps } from "../../app/store/userStore";

interface cfdsTransactionsFilteredProps {
    AllcfoId?: number;
    AllpersonId?: number;
    personLog?: string;
    type?: string;
    start?: string;
    end?: string;
}

export const cfdsTransactionsFiltered = async (AllcfoId, AllpersonId, personLog, type, start, end): Promise<UserTransactionsProps[]> => {
    const req = [AllcfoId, AllpersonId, personLog, type, start, end];
    const field = ['AllcfoId', 'AllpersonId', 'personLog', 'type', 'start', 'end'];
    const params = new URLSearchParams(`http://localhost:8080/cfoesTransactions?`);
    for (let i = 0; i < req.length; i++) {
        if (req[i] !== undefined || req[i] !== null) {
            params.append(field[i], req[i]);
        }
    }
    await fetch(params.toString(), {
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