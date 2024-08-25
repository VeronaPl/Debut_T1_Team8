import { makeAutoObservable } from 'mobx';

export interface UserTransactionsProps {
  id: number;
  id_sender: string;
  username_sender: string;
  id_recipient: string;
  username_recipient: string;
  sum: number;
  date_time: string;
}

export interface CFDsProps {
  label: string;
  value: string;
}

class UserAuthorization {
  #token = '';
  #userId = '';
  userName = 'username';
  userRole = 'admin'; // admin / owner / user
  #sessionExpiry = 0; // Время через которое заканчивается сессия пользователя
  isAuth = true;
  money = 50;
  transactions: UserTransactionsProps[] = [];
  owners: CFDsProps[] = [];
  CFDs: CFDsProps[] = [];
  users: CFDsProps[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUserData(token: string, userId: string, userName: string, role: string, expiry: number, money: number) {
    this.#token = token;
    this.#userId = userId;
    this.userName = userName;
    this.userRole = role;
    this.#sessionExpiry = expiry;
    this.money = money;
  }
  
  getUserData() {
    return {
      token: this.#token,
      userId: this.#userId,
      userName: this.userName,
      userRole: this.userRole,
      sessionExpiry: this.#sessionExpiry,
      isAuth: this.isAuth,
      money: this.money
    };
  }

  setUserTransactions(transactions: UserTransactionsProps[]) {
    this.transactions = transactions;
  }

  setUserOwners(owners: CFDsProps[]) {
    this.owners = owners;
  }

  setUserCFDs(CFDs: CFDsProps[]) {
    this.CFDs = CFDs;
  }

  setUserUsers(users: CFDsProps[]) {
    this.users = users;
  }

  // метод для установки статуса авторизации
  setUserAuth(isAuth: boolean) {
    this.isAuth = isAuth;
    setTimeout(() => {
      console.log(`Auth is ${isAuth}`);
    }, 100);
  }

  // Вызывать при истечении срока сессии
  clearUserData() {
    this.#token = '';
    this.#userId = '';
    this.userName = '';
    this.userRole = '';
    this.#sessionExpiry = 0;
    this.isAuth = false;
    this.money = 0;
    this.clearUserLists();
  }

  clearUserLists() {
    this.transactions = [];
    this.owners = [];
    this.CFDs = [];
    this.users = [];
  }
}

export const userStore = new UserAuthorization();
