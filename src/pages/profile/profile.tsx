import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserDataSelector,
  getUserLoadingSelector,
  getUserErrorSelector
} from '../../services/slices/user-slice';
import { updateUser, clearError } from '../../services/slices/user-slice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const user = useSelector(getUserDataSelector);
  const isLoading = useSelector(getUserLoadingSelector);
  const error = useSelector(getUserErrorSelector);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged || isLoading) {
      return;
    }

    dispatch(clearError());

    // Подготавливаем данные для обновления
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== user?.name) {
      updateData.name = formValue.name;
    }

    if (formValue.email !== user?.email) {
      updateData.email = formValue.email;
    }

    if (formValue.password) {
      updateData.password = formValue.password;
    }

    // Отправляем запрос на обновление
    const result = await dispatch(updateUser(updateData));

    if (updateUser.fulfilled.match(result)) {
      setFormValue((prev) => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
    dispatch(clearError());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error || ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
