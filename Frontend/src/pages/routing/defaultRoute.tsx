import React from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '../../app/store/userStore'
import { LoginPage } from '../LoginPage';
import { ProfilePage } from '../ProfilePage';
import { Navigate } from 'react-router';

export const DefaultRoute = observer(() => {
  if (userStore.isAuth) {
    if (userStore.userRole === "admin" || userStore.userRole === "owner") {
      return <Navigate to="/cfds" />;
    } else if (userStore.userRole === "user") {
      return <ProfilePage />;
    }
    return <Navigate to="/transactions" />;
  } else {
    return <LoginPage />;
  }
});
