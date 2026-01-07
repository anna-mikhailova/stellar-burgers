import { FC, useCallback } from 'react';
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
import {
  getIsAuthCheckedSelector,
  getUserDataSelector
} from '../../services/slices/user-slice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients, totalPrice } = useSelector(
    getBurgerConstructorSelector
  );
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderModalDataSelector);
  const user = useSelector(getUserDataSelector);

  const constructorItems = {
    bun: bun || null,
    ingredients
  };

  const onOrderClick = useCallback(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!constructorItems.bun || orderRequest || ingredients.length === 0) {
      return;
    }

    const ingredientIds: string[] = [];

    if (constructorItems.bun) {
      ingredientIds.push(constructorItems.bun._id);
    }

    ingredients.forEach((ingredient: TConstructorIngredient) => {
      ingredientIds.push(ingredient._id);
    });

    if (constructorItems.bun) {
      ingredientIds.push(constructorItems.bun._id);
    }

    dispatch(createOrder(ingredientIds));
  }, [constructorItems.bun, orderRequest, ingredients, dispatch]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrderModalData());

    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [dispatch, orderModalData]);

  const price = totalPrice;

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
