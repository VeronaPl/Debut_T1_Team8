import React from 'react';
import { userStore } from '../../app/store/userStore';

type MenuItem = {
  title: string;
  path: string;
};

export const SideMenuData = (): MenuItem[] => {
  switch (userStore.userRole) {
    case 'admin':
      return [
        {
          title: 'ЦФО',
          path: '/cfds'
        },
        {
          title: 'Пользователи',
          path: '/users'
        },
        {
          title: 'Владельцы',
          path: '/owners'
        },
        {
          title: 'Транзакции',
          path: '/transactions'
        }
      ];
      break;
    case 'owner':
      return [
        {
          title: 'ЦФО',
          path: '/cfds'
        },
        {
          title: 'Пользователи',
          path: '/users'
        },
        {
          title: 'Транзакции',
          path: '/transactions'
        },
        {
          title: 'О себе',
          path: `/${userStore.userName}`
        }
      ];
      break;
    case 'user':
      return [
        {
          title: 'Транзакции',
          path: '/transactions'
        },
        {
          title: 'О себе',
          path: `/${userStore.userName}`
        }
      ];
      break;
  }
  return [
    {
      title: 'О себе',
      path: `/${userStore.userName}`
    }
  ];
};
