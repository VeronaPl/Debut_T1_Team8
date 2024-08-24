import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { userStore } from '../../app/store/userStore';

export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = observer((props: P) => {
    if (!userStore.isAuth) {
      return <Navigate to='/login' />;
    }

    return <WrappedComponent {...props} />;
  });

  return AuthenticatedComponent;
};
