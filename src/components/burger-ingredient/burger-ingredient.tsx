import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  addBun,
  addIngredient
} from '../../services/slices/burger-constructor-slice';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ backgroundLocation: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
