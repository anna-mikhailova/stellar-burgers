import ordersReducer, {
  initialState,
  fetchUserOrders,
  fetchOrderByNumber,
  createOrder,
  clearOrder,
  clearOrderModalData,
  setOrderRequest
} from './orders-slice';
import { configureStore } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

jest.mock('../../utils/burger-api', () => ({
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('Orders reducer', () => {
  const mockOrder = {
    _id: '1',
    name: 'burger',
    status: 'done',
    number: 123,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    ingredients: ['1', '2']
  };

  const mockOrders = [
    mockOrder,
    {
      ...mockOrder,
      _id: '2',
      number: 124
    }
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Тест fetchUserOrders', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    await store.dispatch(fetchUserOrders());

    const state = store.getState();

    expect(state.orders).toEqual({
      ...initialState,
      orders: mockOrders,
      isLoading: false,
      error: null
    });
  });

  test('Тест fetchOrderByNumber', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValue({
      orders: [mockOrder]
    });

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    await store.dispatch(fetchOrderByNumber(123));

    const state = store.getState();

    expect(state.orders).toEqual({
      ...initialState,
      currentOrder: mockOrder,
      isLoading: false,
      error: null
    });
  });

  test('Тест createOrder', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValue({
      order: mockOrder
    });

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    await store.dispatch(createOrder(['1', '2']));

    const state = store.getState();

    expect(state.orders).toEqual({
      ...initialState,
      orders: [mockOrder],
      orderModalData: mockOrder,
      orderRequest: false,
      error: null
    });
  });

  test('должен вернуть начальное состояние', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('должен обрабатывать fetchUserOrders.pending', () => {
    const action = { type: fetchUserOrders.pending.type };

    const state = ordersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('должен обрабатывать fetchUserOrders.fulfilled', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders
    };

    const state = ordersReducer({ ...initialState, isLoading: true }, action);

    expect(state).toEqual({
      ...initialState,
      orders: mockOrders,
      isLoading: false,
      error: null
    });
  });

  test('должен обрабатывать fetchUserOrders.rejected', () => {
    const mockError = 'Ошибка при получении заказов';

    const action = {
      type: fetchUserOrders.rejected.type,
      error: { message: mockError }
    };

    const state = ordersReducer({ ...initialState, isLoading: true }, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: mockError
    });
  });

  test('должен обрабатывать createOrder.pending', () => {
    const action = { type: createOrder.pending.type };

    const state = ordersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      error: null
    });
  });

  test('должен обрабатывать createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: mockOrder }
    };

    const state = ordersReducer(
      { ...initialState, orderRequest: true },
      action
    );

    expect(state).toEqual({
      ...initialState,
      orders: [mockOrder],
      orderModalData: mockOrder,
      orderRequest: false,
      error: null
    });
  });

  test('должен обрабатывать createOrder.rejected', () => {
    const mockError = 'Ошибка при создании заказа';

    const action = {
      type: createOrder.rejected.type,
      error: { message: mockError }
    };

    const state = ordersReducer(
      { ...initialState, orderRequest: true },
      action
    );

    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      error: mockError
    });
  });

  test('должен обрабатывать clearOrder', () => {
    const prevState = {
      ...initialState,
      currentOrder: mockOrder,
      orderModalData: mockOrder
    };

    const state = ordersReducer(prevState, clearOrder());

    expect(state).toEqual(initialState);
  });

  test('должен обрабатывать clearOrderModalData', () => {
    const prevState = {
      ...initialState,
      orderModalData: mockOrder
    };

    const state = ordersReducer(prevState, clearOrderModalData());

    expect(state).toEqual({
      ...initialState,
      orderModalData: null
    });
  });

  test('должен обрабатывать setOrderRequest', () => {
    const state = ordersReducer(initialState, setOrderRequest(true));

    expect(state).toEqual({
      ...initialState,
      orderRequest: true
    });
  });
});
