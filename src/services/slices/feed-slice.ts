import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

interface TFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// Асинхронный экшен для получения ленты заказов
export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  },
  selectors: {
    getFeedSelector: (state) => state,
    getFeedOrdersSelector: (state) => state.orders,
    getFeedStatsSelector: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при получении ленты заказов';
      });
  }
});

export const { clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
export const { getFeedSelector, getFeedOrdersSelector, getFeedStatsSelector } =
  feedSlice.selectors;
