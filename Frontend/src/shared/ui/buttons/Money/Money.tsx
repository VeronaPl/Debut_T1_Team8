import React from 'react';
import './../../../../app/App.scss';
import './Money.scss';
import Coin from '../../coin/coin-vector-svgrepo-com.svg';

interface MoneyProps {
  title: string;
  onClick: () => void;
}

export const MoneyButton = ({ onClick, title = 'Счет', ...props }: MoneyProps): JSX.Element => {
  return (
    <button className='money_button' onClick={onClick} {...props}>
      <span className='money'>{title}</span>
      <img src={Coin} alt='coin' />
    </button>
  );
};
