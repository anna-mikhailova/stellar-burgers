import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserDataSelector } from '../../services/slices/user-slice';

export const AppHeader: FC = () => {
  const user = useSelector(getUserDataSelector);
  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
