import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { userStore } from '../../app/store/userStore';

export const withoutAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const NotAuthenticatedComponent: React.FC<P> = observer((props: P) => {
    if (userStore.isAuth) {
      if (userStore.userRole === "admin") {
        return <Navigate to="/cfds" />;
      } else if (userStore.userRole === "owner" || userStore.userRole === "user") {
          const path = `/${userStore.userName}`;
          return <Navigate to={path} />;
      } else {
        return <Navigate to="/transactions" />;
      }
    }

    return <WrappedComponent {...props} />;
  });

  return NotAuthenticatedComponent;
};
