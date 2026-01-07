import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedSelector, fetchFeeds } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(getFeedSelector);

  const orders: TOrder[] = feed.orders;
  const isLoading: boolean = feed.isLoading;

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
