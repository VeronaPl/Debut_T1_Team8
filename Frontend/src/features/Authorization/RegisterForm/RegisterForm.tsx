import React from 'react';
import './RegisterForm.scss';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormInput } from '../../../shared/ui/FormInput';
import { LoginButton } from '../../../shared/ui/buttons/Login';
import { userStore } from '../../../app/store/userStore';

export interface RegisterValues {
  username: string;
  password: string;
  password2: string;
}

const validate = (values: RegisterValues) => {
  const errors: Partial<RegisterValues> = {};
  if (!values.username) {
    errors.username = '* Ник обязателен';
  } else if (values.username.length < 6) {
    errors.username = '* Ник должен быть не менее 6 символов';
  } else if (values.username.length > 20) {
    errors.username = '* Ник должен быть не более 20 символов';
  } else if (!/^(?=.{6,20}$)(?![_.])[a-zA-Z0-9._]+(?<![_.])$/.test(values.username)) {
    errors.username = '* Неверный формат ника';
  }
  if (!values.password) {
    errors.password = '* Пароль обязателен';
  } else if (values.password.length < 6) {
    errors.password = '* Пароль должен быть не менее 6 символов';
  }
  if (!values.password2) {
    errors.password2 = '* Пароль обязателен';
  } else if (values.password2.length < 6) {
    errors.password2 = '* Неверный формат пароля';
  } else if (values.password2 !== values.password) {
    errors.password2 = '* Пароли не совпадают';
  }
  return errors;
};

export const RegisterForm = (): JSX.Element => {
  const onSubmit = async (values: RegisterValues) => {
    console.log('Form values:', values.username, values.password);
    userStore.setUserAuth(true);
  };

  const router = useNavigate();

  return (
    <div className='form'>
      <Form
        initialValues={{}}
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, submitting, pristine }) => (
          <form className='login-form' onSubmit={handleSubmit} autoComplete='off'>
            <div className='field'>
              <FormInput label='Username' name='username' type='text' placeholder='Username' />
            </div>
            <div className='field'>
              <FormInput label='Пароль' name='password' type='password' placeholder='Пароль' />
            </div>
            <div className='field'>
              <FormInput label='Повторите пароль' name='password2' type='password' placeholder='Пароль' />
            </div>
            <LoginButton
              className='register'
              title='Зарегистрироваться'
              type='submit'
              color='green'
              disabled={submitting || pristine}
            />
            <div className='or'>или</div>
            <div className='other' onClick={() => router('/login')}>
              Войти
            </div>
          </form>
        )}
      />
    </div>
  );
};
