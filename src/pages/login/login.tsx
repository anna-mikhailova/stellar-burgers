import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/user-slice';
import {
  getUserErrorSelector,
  getUserLoadingSelector,
  clearError
} from '../../services/slices/user-slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector(getUserErrorSelector);
  const isLoading = useSelector(getUserLoadingSelector);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(clearError());

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      } else if (loginUser.rejected.match(resultAction)) {
        console.error('Login failed:', resultAction.payload);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
