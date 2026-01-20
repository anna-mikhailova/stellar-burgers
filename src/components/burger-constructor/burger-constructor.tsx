import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  clearConstructor,
  getBurgerConstructorSelector
} from '../../services/slices/burger-constructor-slice';
import {
  createOrder,
  clearOrderModalData,
  getOrderRequestSelector,
  getOrderModalDataSelector
} from '../../services/slices/orders-slice';
import { getUserDataSelector } from '../../services/slices/user-slice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients } = useSelector(getBurgerConstructorSelector);
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderModalDataSelector);
  const user = useSelector(getUserDataSelector);

  const constructorItems = {
    bun: bun || null,
    ingredients
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!bun || orderRequest || ingredients.length === 0) {
      return;
    }

    const ingredientIds: string[] = [];

    if (bun) {
      ingredientIds.push(bun._id);
    }

    ingredients.forEach((ingredient: TConstructorIngredient) => {
      ingredientIds.push(ingredient._id);
    });

    if (bun) {
      ingredientIds.push(bun._id);
    }

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());

    if (orderModalData) {
      dispatch(clearConstructor());
    }
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
