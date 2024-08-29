import { makeAutoObservable } from 'mobx';

export interface UserTransactionsProps {
  id: number;
  id_sender: string;
  username_sender: string;
  id_recipient: string;
  username_recipient: string;
  type: string;
  owner?: string;
  sum: number;
  date_time: string;
}

export interface OwnerProps {
  id: number;
  firstName: string;
  lastName: string;
  averageName: string;
  login: string;
  CFDs: string[];
}

export interface CFDsProps {
  label: string;
  value: string;
}

class UserAuthorization {
  #token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzI0OTIxMDkyLCJleHAiOjE3MjQ5MjIyOTJ9.3kqK-oaf7RzOiSWYp0BNZ9BMKympPVnVKIThFLwjcw0';
  #userId = '';
  firstName = '';
  lastName = '';
  averageName = '';
  userName = 'username';
  userRole = 'admin'; // admin / owner / user
  #sessionExpiry = 20; // Время через которое заканчивается сессия пользователя
  isAuth = true;
  money = 50;
  transactions: UserTransactionsProps[] = [];
  owners: CFDsProps[] = [];
  CFDs: CFDsProps[] = [];
  users: CFDsProps[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUserToken(token: string) {
    this.#token = token;
  }

  getUserToken() {
    return this.#token;
  }

  setUserData(
    userId: string,
    firstName: string,
    lastName: string,
    averageName: string,
    userName: string,
    role: string,
    money: number
  ) {
    this.#userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.averageName = averageName;
    this.userName = userName;
    this.userRole = role;
    this.money = money;
  }

  getUserData() {
    return {
      token: this.#token,
      userId: this.#userId,
      firstName: this.firstName,
      lastName: this.lastName,
      averageName: this.averageName,
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
    this.firstName = '';
    this.lastName = '';
    this.averageName = '';
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
