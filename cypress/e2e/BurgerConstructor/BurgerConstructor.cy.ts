describe('Constructor Page', () => {
  beforeEach(() => {
    // Устанавливаем токены
    cy.setCookie('accessToken', 'mock-access-token');
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    // Моковые данные юзера
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Моковые данные ингредиентов
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Моковые данные создания заказа
    cy.intercept('POST', 'api/orders', {
      fixture: 'orders.json'
    }).as('createOrder');

    // Переходим на страницу конструктора
    cy.visit('http://localhost:4000');

    // Ждем загрузки данных
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Добавление ингредиентов через кнопку "Добавить"', () => {
    // Добавляем первую булку
    cy.get('[data-cy="ingredients_category_title"]')
      .contains('Булки')
      .next()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что булка появились в конструкторе
    cy.get('[data-cy="constructor_bun_top"]')
      .children('.constructor-element')
      .should('exist');

    cy.get('[data-cy="constructor_bun_bottom"]')
      .children('.constructor-element')
      .should('exist');

    // Добавляем первую начинку
    cy.get('[data-cy="ingredients_category_title"]')
      .contains('Начинки')
      .next()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавляем первый соус
    cy.get('[data-cy="ingredients_category_title"]')
      .contains('Соус')
      .next()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверяем, что начинка и соус появились в конструкторе
    cy.get('[data-cy="constructor_filling"]')
      .children()
      .should('have.length', 2);
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    // Открываем модалку по клику на ингредиент
    cy.get('[data-cy="ingredient"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    // Закрываем модалку крестиком
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Закрытие по оверлею
    cy.get('[data-cy="ingredient"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="ingredient-modal"]').should('not.exist');
  });

  it('Создание заказа и проверка модального окна с номером заказа', () => {
    // Добавляем ингредиенты через кнопку "Добавить"
    cy.get('[data-cy="ingredients_category_title"]')
      .contains('Булки')
      .next()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('[data-cy="ingredients_category_title"]')
      .contains('Начинки')
      .next()
      .find('button')
      .contains('Добавить')
      .click();

    // Нажимаем "Оформить заказ"
    cy.get('[data-cy="order-button"]').find('button').click();

    // Проверяем модалку с номером заказа
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain.text', '99900');

    // Закрываем модалку
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-cy="constructor-filling"]')
      .should('not.exist');

    cy.get('[data-cy="constructor_bun_top"]')
      .should('not.exist');

    cy.get('[data-cy="constructor_bun_bottom"]')
      .should('not.exist');
  });
});
