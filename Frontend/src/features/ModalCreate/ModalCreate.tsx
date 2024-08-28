import React, {useState} from 'react';
import './ModalCreate.scss';
import { ModalWindow } from '../../shared/ui';
import Select from 'react-select';
import { userStore } from '../../app/store/userStore';
import { LoginButton } from '../../shared/ui';
import { FormInput } from '../../shared/ui/FormInput';
import { Field, Form } from 'react-final-form';
import { ModalInput } from '../../shared/ui';

const cfds = [...userStore.CFDs].map(el => el.label);
const owners = [...userStore.owners].map(el => el.label);

type ModalCreateProps = {
    modalWindow: boolean;
    setModalWindow: () => void;
    title: string;
    typeModal: string;
};

interface ModalCreateValues {
    CFDName: string;
    ownerName?: string;
    summi: string;
    reason: string;
  }
  
const validate = (values: ModalCreateValues) => {
    const errors: Partial<ModalCreateValues> = {};
    if (!values.CFDName) {
      errors.CFDName = '* ЦФО обязателен';
    } else if (!(values.CFDName in cfds)) {
      errors.CFDName = '* ЦФО не существует';
    }
    if (('ownerName' in values) && !(values.ownerName in owners)) {
      errors.ownerName = '* Владелец не существует';
    }
    if (!values.summi) {
      errors.summi = '* Сумма обязательна';
    } else if (isNaN(Number(values.summi))) {
      errors.summi = '* Сумма должна быть числом';
    } else if (Number(values.summi) <= 0) {
      errors.summi = '* Сумма должна быть больше нуля';
    }
    if (!values.reason) {
      errors.reason = '* Причина обязательна';
    } else if (values.reason.length > 50) {
      errors.reason = '* Причина должна быть не более 50 символов';
    }
    return errors;
};

export const ModalCreate = ({ modalWindow, setModalWindow, title, typeModal }: ModalCreateProps): JSX.Element => {

    const [selectedCFD, setSelectedCFD] = useState<string>('');
    const [selectedSum, setSelectedSum] = useState<number>(0);
    const [selectedReason, setSelectedReason] = useState<string>('');

    const createTransaction = async (values: ModalCreateValues) => {
        console.log('Modal values:', values);
    };

    return (
        <ModalWindow modalWindow={modalWindow} setModalWindow={setModalWindow} title={title} >
            <Form initialValues={{}} onSubmit={createTransaction} validate={validate}
            render={({ handleSubmit, submitting, pristine }) => (
                <form className='login-form ModalCreate__content' onSubmit={handleSubmit} autoComplete='off' >
                    <div>
                            {
                                typeModal === 'transaction'
                                    ? <>
                                    <ModalInput label='Введите название ЦФО' name='CFDTransaction' type='text' options={[...userStore.CFDs]}
                                                    value={selectedCFD} onChange={(e) => setSelectedCFD(e)} isClearable={true} className='dataAnaliz__filterSection__select__item'/>
                                    <Field name='CFDName'>
                                    {({ input, meta }) => (
                                        
                                            <div className="ModalCreate__content__item">
                                                <label id='CFDTransaction' className='dataAnaliz__filterSection__select__label'>
                                                    Введите название ЦФО    {meta.error && meta.touched && <span className='error'>{meta.error}</span>}
                                                </label>
                                                <Select
                                                    {...input}
                                                    className={meta.error && meta.touched ? 'input-error' : 'dataAnaliz__filterSection__select__item'}
                                                    options={[...userStore.CFDs]}
                                                    value={selectedCFD}
                                                    name='CFDTransaction'
                                                    onChange={(e) => setSelectedCFD(e)}
                                                    isClearable={true}
                                                />
                                            </div>
                                    )}
                                    </Field>
                                    <Field name='CFDName'>
                                    {({ input, meta }) => (
                                            <div className="ModalCreate__content__item">
                                                <label id="summi" className='dataAnaliz__filterSection__select__label'>
                                                    Введите сумму   {meta.error && meta.touched && <span className='error'>{meta.error}</span>}
                                                </label>
                                                <input
                                                    {...input}
                                                    type='number'
                                                    className='dataAnaliz__filterSection__select__item customInput'
                                                    name='summi'
                                                    value={selectedSum}
                                                    onChange={(e) => setSelectedSum(Number(e.target.value))}
                                                />
                                            </div>
                                    )}
                                    </Field>
                                    <Field name='CFDName'>
                                    {({ input, meta }) => (
                                            <div className="ModalCreate__content__item">
                                                <label id="reason" className='dataAnaliz__filterSection__select__label'>
                                                    Причина перевода    {meta.error && meta.touched && <span className='error'>{meta.error}</span>}
                                                </label>
                                                <div className='textarea_wrap'>
                                                    <div {...input} contentEditable="true"
                                                        className='dataAnaliz__filterSection__select__item customInput textarea'
                                                        name='reason'
                                                        value={selectedReason}
                                                        onChange={(e) => setSelectedReason(e.target.value)}
                                                    ></div>
                                                    <span className='dataAnaliz__filterSection__select__label span'>Не более 50 символов</span>
                                                </div>                            
                                            </div>
                                        )}
                                        </Field>
                                            <div className="ModalCreate__content__item">
                                                <LoginButton title='Отправить' type='submit' color='blue' disabled={submitting || pristine}/>
                                            </div>
                                </>
                                : typeModal === 'cfds'
                                    ? <></>
                                : <></>
                            }
                        </div>
                </form>
            )} />
        </ModalWindow>    
    )
}