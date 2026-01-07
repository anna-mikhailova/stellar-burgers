import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orders-slice';
import {
  getUserOrdersSelector,
  getOrdersLoadingSelector
} from '../../services/slices/orders-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getOrdersLoadingSelector);
  const orders: TOrder[] = useSelector(getUserOrdersSelector);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
