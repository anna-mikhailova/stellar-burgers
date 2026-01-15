import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedSelector } from '../../services/slices/feed-slice';
import { getIngredientsSelector } from '../../services/slices/ingredients-slice';
import { useParams } from 'react-router-dom';
import {
  getCurrentOrderSelector,
  getUserOrdersSelector,
  fetchOrderByNumber
} from '../../services/slices/orders-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = parseInt(number!);

  const dispatch = useDispatch();

  const feed = useSelector(getFeedSelector);
  const userOrders = useSelector(getUserOrdersSelector);
  const currentOrder = useSelector(getCurrentOrderSelector);
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector).items;

  const orderData = useMemo(() => {
    /* Ищем в текущем заказе */
    if (currentOrder && currentOrder.number === orderNumber)
      return currentOrder;

    /* Ищем в истории заказов */
    const orderFromUserHistory = userOrders.find(
      (order) => order.number === orderNumber
    );
    if (orderFromUserHistory) return orderFromUserHistory;

    /* Ищем в ленте заказов */
    const orderFromFeed = feed.orders.find(
      (order) => order.number === orderNumber
    );
    if (orderFromFeed) return orderFromFeed;
    return null;
  }, [feed.orders, userOrders, orderNumber, currentOrder]);

  /* Если заказ не найден в сторе, запрашиваем его по номеру */
  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

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
