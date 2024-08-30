import { makeAutoObservable } from 'mobx';

export interface UserTransactionsProps {
  id: number;
  from: string;
  to: string;
  sum: number;
  type: string;
  comment: string;
  datatime: Date;
  id_cfo_from: number | null;
  id_cfo_to: number | null;
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
  #token: string = '';
  #userId: string = '';
  firstName: string = '';
  lastName: string = '';
  averageName: string = '';
  userName: string = 'username';
  userRole: string = 'admin'; // admin / owner / user
  #sessionExpiry: number = 20; // Время через которое заканчивается сессия пользователя
  isAuth: boolean = false;
  money: number = 50;
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
