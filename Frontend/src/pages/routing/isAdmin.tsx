import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { userStore } from '../../app/store/userStore';

export const isAdmin = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const AdminAuthenticatedComponent: React.FC<P> = observer((props: P) => {
    if (!userStore.isAuth) {
      return <Navigate to="/login" />;
    } else if (userStore.userRole === "user" || userStore.userRole === "owner") {
        const path = `/${userStore.userName}`;
        return <Navigate to={path} />;
    }

    return <WrappedComponent {...props} />;
  });

  return AdminAuthenticatedComponent;
};

