import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  getIngredientsSelector,
  fetchIngredients
} from '../../services/slices/ingredients-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(getIngredientsSelector);

  const ingredientData = ingredients.items.find(
    (ingredient) => ingredient._id === id
  );

  useEffect(() => {
    if (ingredients.items.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.items.length]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
