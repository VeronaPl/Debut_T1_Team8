import React, { useState } from 'react';
import './ModalCreate.scss';
import { ModalWindow } from '../../shared/ui';
import Select from 'react-select';
import { userStore } from '../../app/store/userStore';
import { LoginButton } from '../../shared/ui';
import { Field, Form } from 'react-final-form';
import { ModalInput } from '../../shared/ui';

const cfds = [...userStore.CFDs].map((el) => el.label);
const owners = [...userStore.owners].map((el) => el.label);

type ModalCreateProps = {
  modalWindow: boolean;
  setModalWindow: () => void;
  title: string;
  typeModal: string;
};

interface ModalCreateValues {
  CFDName: string;
  ownerName?: string;
  period?: string;
  summi: string;
  reason: string;
}

const validate = (values: ModalCreateValues) => {
  const errors: Partial<ModalCreateValues> = {};
  if (!values.summi) {
    errors.summi = '* Сумма обязательна';
    console.log(errors.summi);
  } else if (isNaN(Number(values.summi))) {
    errors.summi = '* Сумма должна быть числом';
    console.log(errors.summi);
  } else if (Number(values.summi) <= 0) {
    errors.summi = '* Сумма должна быть больше нуля';
    console.log(errors.summi);
  }
  if (!values.reason) {
    errors.reason = '* Причина обязательна';
    console.log(errors.reason);
  } else if (values.reason.length > 50) {
    errors.reason = '* Причина должна быть не более 50 символов';
    console.log(errors.reason);
  }
  if ('ownerName' in values && !(values.ownerName in owners)) {
    errors.ownerName = '* Владелец не существует';
  }
  return errors;
};

export const ModalCreate = ({ modalWindow, setModalWindow, title, typeModal }: ModalCreateProps): JSX.Element => {
  const [selectedCFD, setSelectedCFD] = useState<string>('');
  const [selectedSum, setSelectedSum] = useState<number>(0);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  const createTransaction = async (values: ModalCreateValues) => {
    console.log('Modal values:', values);
    setModalWindow();
  };

  return (
    <ModalWindow modalWindow={modalWindow} setModalWindow={setModalWindow} title={title}>
      <Form
        initialValues={{}}
        onSubmit={createTransaction}
        validate={validate}
        render={({ handleSubmit, submitting, pristine }) => (
          <form className='login-form ModalCreate__content' onSubmit={handleSubmit} autoComplete='off'>
            <div>
              {typeModal === 'transaction' ? (
                <>
                  <div className='ModalCreate__content__item'>
                    <label id='CFDTransaction' className='dataAnaliz__filterSection__select__label'>
                      Введите название ЦФО
                    </label>
                    <Select
                      className='dataAnaliz__filterSection__select__item'
                      options={[...userStore.CFDs]}
                      value={selectedCFD}
                      name='CFDTransaction'
                      onChange={(e) => setSelectedCFD(e)}
                      isClearable={true}
                    />
                  </div>
                  <div className='ModalCreate__content__item'>
                    <label id='summi' className='dataAnaliz__filterSection__select__label'>
                      Введите сумму
                    </label>
                    <input
                      type='number'
                      className='dataAnaliz__filterSection__select__item customInput'
                      name='summi'
                      value={selectedSum}
                      onChange={(e) => setSelectedSum(Number(e.target.value))}
                    />
                  </div>
                  <div className='ModalCreate__content__item'>
                    <label id='reason' className='dataAnaliz__filterSection__select__label'>
                      Причина перевода
                    </label>
                    <div className='textarea_wrap'>
                      <div
                        contentEditable='true'
                        className='dataAnaliz__filterSection__select__item customInput textarea'
                        name='reason'
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                      ></div>
                      <span className='dataAnaliz__filterSection__select__label span'>Не более 50 символов</span>
                    </div>
                  </div>

                  <div className='ModalCreate__content__item__btn'>
                    <LoginButton
                      title='Отправить'
                      type='submit'
                      color='green'
                      onClick={() => createTransaction([selectedCFD, selectedSum, selectedReason])}
                    />
                  </div>
                </>
              ) : typeModal === 'cfds' ? (
                <>
                  <div className='ModalCreate__content__item'>
                    <label id='CFDName' className='dataAnaliz__filterSection__select__label'>
                      Название ЦФО
                    </label>
                    <input
                      type='text'
                      className='dataAnaliz__filterSection__select__item customInput'
                      name='CFDName'
                      value={selectedCFD}
                      onChange={(e) => setSelectedCFD(e.target.value)}
                    />
                  </div>
                  <div className='ModalCreate__content__item'>
                    <label id='OwnerTransaction' className='dataAnaliz__filterSection__select__label'>
                      Выберите владельца
                    </label>
                    <Select
                      className='dataAnaliz__filterSection__select__item'
                      options={[...userStore.owners]}
                      value={selectedOwner}
                      name='OwnerTransaction'
                      onChange={(e) => setSelectedOwner(e)}
                      isClearable={true}
                    />
                  </div>
                  <div className='ModalCreate__content__item'>
                    <label id='summi' className='dataAnaliz__filterSection__select__label'>
                      Укажите бюджет в коинах
                    </label>
                    <input
                      type='number'
                      className='dataAnaliz__filterSection__select__item customInput'
                      name='summi'
                      value={selectedSum}
                      onChange={(e) => setSelectedSum(Number(e.target.value))}
                    />
                  </div>
                  <div className='ModalCreate__content__item'>
                    <label id='period' className='dataAnaliz__filterSection__select__label'>
                      Укажите период
                    </label>
                    <input
                      type='datetime-local'
                      className='dataAnaliz__filterSection__select__item customInput'
                      name='period'
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                    />
                  </div>

                  <div className='ModalCreate__content__item__btn'>
                    <LoginButton
                      title='Отправить'
                      type='submit'
                      color='green'
                      onClick={() => createTransaction([selectedCFD, selectedSum, selectedReason])}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </form>
        )}
      />
    </ModalWindow>
  );
};
