import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi, orderBurgerApi } from '../../utils/burger-api';

interface TOrdersState {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

export const initialState: TOrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

// Асинхронный экшен для получения заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

// Асинхронный экшен для создания заказа
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.orderModalData = null;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    setOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    }
  },
  selectors: {
    getOrdersSelector: (state) => state,
    getOrdersLoadingSelector: (state) => state.isLoading,
    getUserOrdersSelector: (state) => state.orders,
    getCurrentOrderSelector: (state) => state.currentOrder,
    getOrderModalDataSelector: (state) => state.orderModalData,
    getOrderRequestSelector: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при получении заказов';
      })
      // Обработка createOrder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.orders.unshift(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      });
  }
});

export const { clearOrder, clearOrderModalData, setOrderRequest } =
  ordersSlice.actions;
export default ordersSlice.reducer;
export const {
  getOrdersSelector,
  getOrdersLoadingSelector,
  getUserOrdersSelector,
  getCurrentOrderSelector,
  getOrderModalDataSelector,
  getOrderRequestSelector
} = ordersSlice.selectors;
