import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { userStore } from '../../app/store/userStore';

export const isNotUser = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const NotUserAuthenticatedComponent: React.FC<P> = observer((props: P) => {
    if (!userStore.isAuth) {
      return <Navigate to='/login' />;
    } else if (userStore.userRole === 'user') {
      const path = `/${userStore.userName}`;
      return <Navigate to={path} />;
    } else if (userStore.userRole === 'owner') {
      return <Navigate to='/cfds' />;
    }

    return <WrappedComponent {...props} />;
  });

  return NotUserAuthenticatedComponent;
};
