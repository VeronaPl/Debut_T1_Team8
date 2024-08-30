import React from 'react';
import './LoginForm.scss';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormInput } from '../../../shared/ui/FormInput';
import { LoginButton } from '../../../shared/ui/buttons/Login';
import { userStore } from '../../../app/store/userStore';

export interface FormValues {
  username: string;
  password: string;
}

const validate = (values: FormValues) => {
  const errors: Partial<FormValues> = {};
  if (!values.username) {
    errors.username = '* Ник обязателен';
  } else if (!/^(?=.{6,20}$)(?![_.])[a-zA-Z0-9._]+(?<![_.])$/.test(values.username)) {
    errors.username = '* Неверный формат ника';
  }
  if (!values.password) {
    errors.password = '* Пароль обязателен';
  } else if (values.password.length < 6) {
    errors.password = '* Пароль должен быть не менее 6 символов';
  }
  return errors;
};

export const LoginForm = (): JSX.Element => {
  const onSubmit = async (values: FormValues) => {
    console.log('Form values:', values);
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
            <LoginButton title='Войти' type='submit' color='green' disabled={submitting || pristine} />
            <div className='or'>или</div>
            <div className='other' onClick={() => router('/register')}>
              Регистрация
            </div>
          </form>
        )}
      />
    </div>
  );
};
