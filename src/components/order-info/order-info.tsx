import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedSelector, fetchFeeds } from '../../services/slices/feed-slice';
import {
  getIngredientsSelector,
  fetchIngredients
} from '../../services/slices/ingredients-slice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = parseInt(number!);

  const dispatch = useDispatch();

  const feed = useSelector(getFeedSelector);
  const orders: TOrder[] = feed.orders;
  const orderData = orders.find((order) => order.number === orderNumber);

  const ingredients: TIngredient[] = useSelector(getIngredientsSelector).items;

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeeds());
    }
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, orders.length, ingredients.length]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
