import { makeAutoObservable } from "mobx";

export interface UserTransactionsProps {
    "id": number,
    "id_sender": string,
    "username_sender": string,
    "id_recipient": string,
    "username_recipient": string,
    "sum": number,
    "date_time": string,
}

class UserAuthorization {
    token = "";
    userId = "";
    userName = "username";
    userRole = "admin"; // admin / owner / user
    sessionExpiry = 0; // Время через которое заканчивается сессия пользователя
    isAuth = true;
    money = 50;
    transactions: UserTransactionsProps[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setUserData(token: string, userId: string, userName: string, role: string, expiry: number, money: number) {
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.userRole = role;
        this.sessionExpiry = expiry;
        this.money = money;
    }

    setUserTransactions(transactions: UserTransactionsProps[]) {
        this.transactions = transactions;
    }

    // метод для установки статуса авторизации
    setUserAuth(isAuth: boolean) {
        this.isAuth = isAuth;
        setTimeout(() => {
            console.log(`Auth is ${isAuth}`);
        }, 100)
    }

    // Вызывать при истечении срока сессии
    clearUserData() {
        this.token = "";
        this.userId = "";
        this.userName = "";
        this.userRole = "";
        this.sessionExpiry = 0;
        this.isAuth = false;
        this.money = 0;
        this.clearUserTransactions();
    }

    clearUserTransactions() {
        this.transactions = [];
    }
}

export const userStore = new UserAuthorization();