import feedReducer, { clearFeed, fetchFeeds, initialState } from './feed-slice';
import { configureStore } from '@reduxjs/toolkit';

describe('Feed reducer', () => {
  const mockData = {
    ...initialState,
    orders: [
      {
        _id: '1',
        status: 'done',
        name: 'burger',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
        number: 1,
        ingredients: ['1', '2']
      },
      {
        _id: '2',
        status: 'done',
        name: 'burger',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
        number: 1,
        ingredients: ['1', '2']
      }
    ],
    total: 2,
    totalToday: 1
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Тест загрузки feed', async () => {
    const expectedResult = {
      success: true,
      ...mockData
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedResult)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { feed: feedReducer }
    });

    // Ожидаем завершение выполнения асинхронного экшена
    await store.dispatch(fetchFeeds());

    const state = store.getState();
    // И сравниваем их с ожидаемым результатом
    expect(state.feed).toEqual(mockData);
  });

  test('должен вернуть начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('должен обрабатывать fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };

    const state = feedReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  test('должен обрабатывать fetchFeeds.fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockData
    };

    const state = feedReducer({ ...initialState, isLoading: true }, action);

    expect(state).toEqual(mockData);
  });

  test('должен обрабатывать fetchFeeds.rejected', () => {
    const mockError = 'Ошибка загрузки данных';
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: mockError }
    };

    const state = feedReducer({ ...initialState, isLoading: true }, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: mockError
    });
  });

  test('должен обрабатывать clearFeed', () => {
    const action = clearFeed();
    const state = feedReducer(mockData, action);

    expect(state).toEqual(initialState);
  });
});
