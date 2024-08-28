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
                            <label id='CFDTransaction' className='dataAnaliz__filterSection__select__label'>
                                Введите название ЦФО
                            </label>
                            <Select
                                className='dataAnaliz__filterSection__select__item'
                                options={[...userStore.CFDs]}
                                value={selectedCFD}
                                onChange={(e) => setSelectedCFD(e)}
                                isClearable={true}
                                
                            />

                            <label id="summi" className='dataAnaliz__filterSection__select__label'>
                                Введите сумму
                            </label>
                            <input
                                type='number'
                                className='dataAnaliz__filterSection__select__item'
                                id='summi'
                                name='trip-start'
                                value={selectedSum}
                                onChange={(e) => setSelectedSum(Number(e.target.value))}
                            />
                        </>
                    : typeModal === 'cfds'
                        ? <></>
                    : <></>
                }
            </div>
        </ModalWindow>
    )
}