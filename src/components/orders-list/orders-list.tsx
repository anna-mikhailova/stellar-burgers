import { FC, memo } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { useSelector } from '../../services/store';
import { getIngredientsSelector } from '../../services/slices/ingredients-slice';
import { Preloader } from '@ui';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const ingredients = useSelector(getIngredientsSelector);
  const ingredientsList = ingredients.items;
  const isLoading = ingredients.isLoading;

  if (isLoading && !ingredientsList.length) {
    return <Preloader />;
  }

  return <OrdersListUI orderByDate={orderByDate} />;
});
