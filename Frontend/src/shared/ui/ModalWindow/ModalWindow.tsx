import React from 'react';
import './ModalWindow.scss';
import { MDBIcon } from 'mdb-react-ui-kit';
import { ReactNode } from 'react';

type ModalWindowProps = {
  modalWindow: boolean;
  setModalWindow: () => void;
  title: string;
  children?: ReactNode;
};

export const ModalWindow = ({ modalWindow, setModalWindow, title = '', children = '' }: ModalWindowProps) => {
  return (
    <div className={modalWindow ? 'ModalWindow open' : 'ModalWindow'} onClick={setModalWindow}>
      <div className='ModalCont' onClick={(e) => e.stopPropagation()}>
        <div className='ModalCont__header'>
          <div className='ModalCont__header__title'>{title}</div>
          <div className='ModalCont__header__close' onClick={setModalWindow}>
            <MDBIcon fas icon='times' />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
