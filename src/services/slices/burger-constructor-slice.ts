import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  totalPrice: number;
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
  totalPrice: 0
};

const calculateTotal = (
  bun: TIngredient | null,
  ingredients: TConstructorIngredient[]
): number => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum, item) => sum + item.price,
    0
  );
  return bunPrice + ingredientsPrice;
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
      state.totalPrice = calculateTotal(state.bun, state.ingredients);
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients.push({
        ...action.payload,
        id: `${action.payload._id}_${Date.now()}`
      });
      state.totalPrice = calculateTotal(state.bun, state.ingredients);
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
      state.totalPrice = calculateTotal(state.bun, state.ingredients);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const ingredients = [...state.ingredients];
      const draggedItem = ingredients[dragIndex];

      ingredients.splice(dragIndex, 1);
      ingredients.splice(hoverIndex, 0, draggedItem);

      state.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.totalPrice = 0;
    }
  },
  selectors: {
    getBurgerConstructorSelector: (state) => state
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;

export const { getBurgerConstructorSelector } =
  burgerConstructorSlice.selectors;
