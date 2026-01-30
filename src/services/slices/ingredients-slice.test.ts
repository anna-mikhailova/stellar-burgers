import ingredientsReducer, {
  fetchIngredients,
  initialState
} from './ingredients-slice';
import { configureStore } from '@reduxjs/toolkit';

describe('Ingredients reducer', () => {
  const mockIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 200,
      price: 50,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile'
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      calories: 300,
      price: 100,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile'
    }
  ];

  const mockData = {
    ...initialState,
    items: mockIngredients
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Тест загрузки ингредиентов', async () => {
    const expectedResult = {
      success: true,
      data: mockIngredients
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(expectedResult)
      })
    ) as jest.Mock;
    

    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });

    await store.dispatch(fetchIngredients());

    const state = store.getState();

    expect(state.ingredients).toEqual(mockData);
  });

  test('должен вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };

    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  test('должен обрабатывать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state).toEqual(mockData);
  });

  test('должен обрабатывать fetchIngredients.rejected', () => {
    const mockError = 'Ошибка загрузки ингредиентов';

    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: mockError }
    };

    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state).toEqual({
      ...initialState,
      error: mockError
    });
  });
});
