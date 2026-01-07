import { useSelector } from '../../services/store';
import { Navigate } from 'react-router';
import { Preloader } from '../ui/preloader';
import {
  getUserDataSelector,
  getIsAuthCheckedSelector
} from '../../services/slices/user-slice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);
  const user = useSelector(getUserDataSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to='/' />;
  }

  return children;
};
