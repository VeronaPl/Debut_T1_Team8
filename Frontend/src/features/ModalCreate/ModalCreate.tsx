import React from 'react';
import './ModalCreate.scss';
import { ModalWindow } from '../../shared/ui';

type ModalCreateProps = {
    modalWindow: boolean;
    setModalWindow: () => void;
    title: string;
    typeModal: string;
};

export const ModalCreate = ({ modalWindow, setModalWindow, title, typeModal }: ModalCreateProps): JSX.Element => {
    return (
        <ModalWindow modalWindow={modalWindow} setModalWindow={setModalWindow} title={title}>
            <div>It's {typeModal} modal</div>
        </ModalWindow>
    )
}