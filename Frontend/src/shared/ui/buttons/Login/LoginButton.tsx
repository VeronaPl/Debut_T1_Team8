import React from 'react';
import '../../../../app/App.scss';
import './LoginButton.scss';

type LoginButtonType = {
  onClick?: () => void;
  title?: string | React.ReactNode;
  color?: 'blue' | 'green';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const LoginButton = ({ onClick, color = 'blue', title = 'Войти', ...props }: LoginButtonType): JSX.Element => {
  return (
    <button {...props} className={`login_button login_button--${color}`} onClick={onClick}>
      {title}
    </button>
  );
};
