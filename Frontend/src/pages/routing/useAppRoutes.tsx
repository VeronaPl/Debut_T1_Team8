import React from 'react';
import { RouteObject, useRoutes } from 'react-router';
import { routesList } from './routesList';
import { AppLayout } from '../AppLayout';

export const useAppRoutes = (): React.ReactElement | null => {
  const routes = routesList();
  const buildRoutes = (): RouteObject[] => {
    return [
      {
        caseSensitive: false,
        path: `/`,
        element: <AppLayout />,
        children: routes
      }
    ];
  };
  return useRoutes(buildRoutes());
};
