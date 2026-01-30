import burgerConstructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from './burger-constructor-slice';

//мок функции nanoid
jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: jest.fn(() => 'test-id')
  };
});

describe('burgerConstructor reducer', () => {
  const mockBun = {
    _id: 'bun1',
    name: 'Булочка',
    type: 'bun',
    price: 100,
    proteins: 4,
    carbohydrates: 20,
    fat: 1,
    calories: 150,
    image: 'bun_image',
    image_large: 'bun_image_large',
    image_mobile: 'bun_image_mobile'
  };

  const mockIngredient = {
    _id: 'ing1',
    name: 'Котлета',
    type: 'main',
    price: 50,
    proteins: 4,
    carbohydrates: 20,
    fat: 1,
    calories: 150,
    image: 'ing_image',
    image_large: 'ing_image_large',
    image_mobile: 'ing_image_mobile'
  };

  const initialStateWithoutData = initialState;
  const initialStateWithData = {
    ...initialState,
    bun: mockBun,
    ingredients: [
      { ...mockIngredient, id: '1' },
      { ...mockIngredient, id: '2' },
      { ...mockIngredient, id: '3' },
      { ...mockIngredient, id: '4' }
    ]
  };

  test('должен обрабатывать addBun', () => {
    const newState = burgerConstructorReducer(
      initialStateWithoutData,
      addBun(mockBun)
    );

    const expectedResult = {
      ...initialState,
      bun: mockBun
    };

    expect(newState).toEqual(expectedResult);
  });

  test('должен обрабатывать addIngredient', () => {
    const newState = burgerConstructorReducer(
      initialStateWithoutData,
      addIngredient(mockIngredient)
    );

    const expectedResult = {
      ...initialStateWithoutData,
      ingredients: [{ ...mockIngredient, id: 'test-id' }]
    };

    expect(newState).toEqual(expectedResult);
  });

  test('должен обрабатывать moveIngredient', () => {
    // Перемещаем элемент с индексом 1 на позицию 3
    const newState = burgerConstructorReducer(
      initialStateWithData,
      moveIngredient({ dragIndex: 1, hoverIndex: 3 })
    );

    const expectedResult = {
      ...initialStateWithData,
      ingredients: [
        { ...mockIngredient, id: '1' },
        { ...mockIngredient, id: '3' },
        { ...mockIngredient, id: '4' },
        { ...mockIngredient, id: '2' }
      ]
    };

    expect(newState).toEqual(expectedResult);
  });

  test('должен обрабатывать clearConstructor', () => {
    const newState = burgerConstructorReducer(
      initialStateWithData,
      clearConstructor()
    );

    expect(newState).toEqual(initialStateWithoutData);
  });

  test('должен обрабатывать removeIngredient', () => {
    const newState = burgerConstructorReducer(
      initialStateWithData,
      removeIngredient(0)
    );

    const expectedResult = {
      ...initialStateWithData,
      ingredients: [
        { ...mockIngredient, id: '2' },
        { ...mockIngredient, id: '3' },
        { ...mockIngredient, id: '4' }
      ]
    };

    expect(newState).toEqual(expectedResult);
  });
});
