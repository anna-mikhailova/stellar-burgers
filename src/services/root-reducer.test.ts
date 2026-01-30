import rootReducer from "./root-reducer";

describe('rootReducer', () => {
  test('Правильная инициализация со всеми редьюсерами', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
  });

  test('Возвращает начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const stateAfterUnknownAction = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Сравниваем, что оба состояния идентичны
    expect(stateAfterUnknownAction).toEqual(initialState);
    
    // Дополнительная проверка структуры
    expect(stateAfterUnknownAction).toHaveProperty('ingredients');
    expect(stateAfterUnknownAction).toHaveProperty('burgerConstructor');
    expect(stateAfterUnknownAction).toHaveProperty('feed');
    expect(stateAfterUnknownAction).toHaveProperty('orders');
    expect(stateAfterUnknownAction).toHaveProperty('user');
  });
});
