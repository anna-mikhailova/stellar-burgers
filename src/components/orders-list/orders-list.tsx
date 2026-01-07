import { FC, memo, useEffect } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredientsSelector,
  fetchIngredients
} from '../../services/slices/ingredients-slice';
import { Preloader } from '@ui';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredientsSelector);
  const ingredientsList = ingredients.items;
  const isLoading = ingredients.loading;

  useEffect(() => {
    if (!ingredientsList.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientsList.length]);

  if (isLoading && !ingredientsList.length) {
    return <Preloader />;
  }

  return <OrdersListUI orderByDate={orderByDate} />;
});
