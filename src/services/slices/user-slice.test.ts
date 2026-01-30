import userReducer, {
  initialState,
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUser,
  setAuthChecked,
  setUser,
  clearError
} from './user-slice';
import { configureStore } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import * as cookieUtils from '../../utils/cookie';

jest.mock('../../utils/burger-api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn()
}));

describe('User reducer', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com'
  };

  beforeAll(() => {
    // Мокаем localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        })
      };
    })();

    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('registerUser успешная регистрация', async () => {
    (registerUserApi as jest.Mock).mockResolvedValue({
      user: mockUser,
      accessToken: 'token',
      refreshToken: 'refresh'
    });

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(
      registerUser({ name: 'name', email: 'test', password: '123' })
    );

    const state = store.getState();

    expect(state.user).toEqual({
      ...initialState,
      user: mockUser,
      isAuthChecked: true,
      isLoading: false,
      error: null
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'refresh'
    );
    expect(cookieUtils.setCookie).toHaveBeenCalledWith('accessToken', 'token');
  });

  test('registerUser ошибка регистрации', async () => {
    const errorMessage = 'Registration failed';
    (registerUserApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(
      registerUser({ name: 'name', email: 'test', password: '123' })
    );

    const state = store.getState();
    expect(state.user.error).toBe(errorMessage);
    expect(state.user.isLoading).toBe(false);
  });

  test('loginUser успешный вход', async () => {
    (loginUserApi as jest.Mock).mockResolvedValue({
      user: mockUser,
      accessToken: 'token',
      refreshToken: 'refresh'
    });

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(loginUser({ email: 'test', password: '123' }));

    const state = store.getState();
    expect(state.user).toEqual({
      ...initialState,
      user: mockUser,
      isAuthChecked: true,
      isLoading: false,
      error: null
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'refresh'
    );
    expect(cookieUtils.setCookie).toHaveBeenCalledWith('accessToken', 'token');
  });

  test('loginUser ошибка входа', async () => {
    const errorMessage = 'Login failed';
    (loginUserApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(loginUser({ email: 'test', password: '123' }));

    const state = store.getState();
    expect(state.user.error).toBe(errorMessage);
    expect(state.user.isLoading).toBe(false);
  });

  test('logoutUser успешный выход', async () => {
    (logoutApi as jest.Mock).mockResolvedValue(null);

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(logoutUser());

    const state = store.getState();
    expect(state.user.user).toBeNull();
    expect(state.user.isLoading).toBe(false);
    expect(cookieUtils.deleteCookie).toHaveBeenCalledWith('accessToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
  });

  test('logoutUser ошибка выхода', async () => {
    const errorMessage = 'Logout failed';
    (logoutApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(logoutUser());

    const state = store.getState();
    expect(state.user.error).toBe(errorMessage);
    expect(state.user.isLoading).toBe(false);
  });

  test('fetchUser успешная загрузка', async () => {
    (getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(fetchUser());

    const state = store.getState();
    expect(state.user.user).toEqual(mockUser);
    expect(state.user.isAuthChecked).toBe(true);
  });

  test('fetchUser ошибка загрузки', async () => {
    (getUserApi as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(fetchUser());

    const state = store.getState();
    expect(state.user.user).toBeNull();
    expect(state.user.isAuthChecked).toBe(true);
  });

  test('updateUser успешное обновление', async () => {
    (updateUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(updateUser({ name: 'New Name' }));

    const state = store.getState();
    expect(state.user.user).toEqual(mockUser);
    expect(state.user.error).toBeNull();
  });

  test('updateUser ошибка обновления', async () => {
    (updateUserApi as jest.Mock).mockRejectedValue(new Error('Update failed'));

    const store = configureStore({ reducer: { user: userReducer } });

    await store.dispatch(updateUser({ name: 'New Name' }));

    const state = store.getState();
    expect(state.user.error).toBe('Update failed');
  });

  test('setAuthChecked', () => {
    const state = userReducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  test('setUser', () => {
    const state = userReducer(initialState, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
  });

  test('clearError', () => {
    const prevState = { ...initialState, error: 'Some error' };
    const state = userReducer(prevState, clearError());
    expect(state.error).toBeNull();
  });

  test('должен вернуть начальное состояние', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
});
