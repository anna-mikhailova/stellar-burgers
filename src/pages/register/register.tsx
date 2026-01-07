import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser, clearError } from '../../services/slices/user-slice';
import {
  getUserErrorSelector,
  getUserLoadingSelector
} from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(getUserErrorSelector);
  const isLoading = useSelector(getUserLoadingSelector);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [userName, email, password, dispatch]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(clearError());

    try {
      await dispatch(
        registerUser({
          name: userName,
          email,
          password
        })
      ).unwrap();

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
