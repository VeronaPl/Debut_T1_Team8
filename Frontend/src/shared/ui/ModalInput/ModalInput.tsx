import React from 'react';
import './ModalInput.scss';
import { Field } from 'react-final-form';
import Select from 'react-select';
import { userStore } from '../../../app/store/userStore';

type ModalInputProps = {
    label: string;
    name: string;
    type: React.HTMLInputTypeAttribute;
  };

export const ModalInput = ({ label, name, type }: ModalInputProps) => (
    <Field<string> name={name}>
        {({ input, meta }) => (
            <div className="ModalCreate__content__item">
                <label id='CFDTransaction' className='dataAnaliz__filterSection__select__label'>
                    {label} {meta.error && meta.touched && <span className='error'>{meta.error}</span>}
                </label>
                {
                    type == 'textarea' ? (
                        <textarea
                            {...input}
                            className={meta.error && meta.touched ? 'input-error' : 'formInput__textarea'}
                        />
                    ) : 
                    type == 'number' ? (
                        <input
                            {...input}
                            type={type}
                            className={meta.error && meta.touched ? 'input-error' : 'formInput__input'}
                        />
                    ) :
                    type == 'select' ? (
                        <Select
                            {...input}
                            className={meta.error && meta.touched ? 'input-error' : 'dataAnaliz__filterSection__select__item'}
                            options={[...userStore.CFDs]}
                            value={selectedCFD}
                            name='CFDTransaction'
                            onChange={(e) => setSelectedCFD(e)}
                            isClearable={true}
                        />
                    ) : <></>
                }
            </div>
        )}
    </Field>
)