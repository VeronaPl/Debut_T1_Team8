import React, {useState} from 'react';
import './ModalCreate.scss';
import { ModalWindow } from '../../shared/ui';
import Select from 'react-select';
import { userStore } from '../../app/store/userStore';

type ModalCreateProps = {
    modalWindow: boolean;
    setModalWindow: () => void;
    title: string;
    typeModal: string;
};

export const ModalCreate = ({ modalWindow, setModalWindow, title, typeModal }: ModalCreateProps): JSX.Element => {

    const [selectedCFD, setSelectedCFD] = useState<string>('');
    const [selectedSum, setSelectedSum] = useState<number>(0);
    const [selectedReason, setSelectedReason] = useState<string>('');

    const cfds = [...userStore.CFDs].map(el => el.label);

    return (
        <ModalWindow modalWindow={modalWindow} setModalWindow={setModalWindow} title={title}>
            <div className="ModalCreate__content">
                {
                    typeModal === 'transaction'
                        ? <>
                        <div className="ModalCreate__content__item">
                            <label id='CFDTransaction' className='dataAnaliz__filterSection__select__label'>
                                Введите название ЦФО
                            </label>
                            <Select
                                className='dataAnaliz__filterSection__select__item custom-select'
                                options={[...userStore.CFDs]}
                                value={selectedCFD}
                                onChange={(e) => setSelectedCFD(e)}
                                isClearable={true}
                                
                            />
                        </div>
                        <div className="ModalCreate__content__item">
                            <label id="summi" className='dataAnaliz__filterSection__select__label'>
                                Введите сумму
                            </label>
                            <input
                                type='number'
                                className='dataAnaliz__filterSection__select__item'
                                name='summi'
                                value={selectedSum}
                                onChange={(e) => setSelectedSum(Number(e.target.value))}
                            />
                        </div>
                        <div className="ModalCreate__content__item">
                            <label id="reason" className='dataAnaliz__filterSection__select__label'>
                                Причина перевода
                            </label>
                            <input
                                type='text'
                                className='dataAnaliz__filterSection__select__item'
                                name='reason'
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                        </div>
                        </>
                    : typeModal === 'cfds'
                        ? <></>
                    : <></>
                }
            </div>
        </ModalWindow>
    )
}