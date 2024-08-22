import { makeAutoObservable } from "mobx";

class UserAuthorization {
    token = "";
    userId = "";
    userName = "username";
    userRole = "admin"; // admin / owner / user
    sessionExpiry = 0; // Время через которое заканчивается сессия пользователя
    isAuth = false;
    money = 50;

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
    }
}

export const userStore = new UserAuthorization();