import React from 'react';
import { Field } from 'react-final-form';

import './FormInput.scss';

type FormInputProps = {
  label: string;
  name: string;
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
};

export const FormInput = ({ label, name, type, placeholder }: FormInputProps) => (
  <Field<string> name={name}>
    {({ input, meta }) => (
      <div>
        <label className='label'>
          {label} {meta.error && meta.touched && <span className='error'>{meta.error}</span>}
        </label>
        {type == 'textarea' ? (
          <textarea {...input} placeholder={placeholder} autoComplete='new-password' className={meta.error && meta.touched ? 'input-error' : 'formInput__textarea'} />
        ) : (
          <input {...input} type={type} placeholder={placeholder} autoComplete='new-password' className={meta.error && meta.touched ? 'input-error' : 'formInput__input'} />
        )}
      </div>
    )}
  </Field>
);
