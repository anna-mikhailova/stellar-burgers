import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { ProtectedRoute } from '../protected-route';

import {
  AppHeader,
  Modal,
  OrderInfo,
  OrderModal,
  IngredientDetails,
  Wrap,
  OrderWrap
} from '@components';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import { fetchUser, setAuthChecked } from '../../services/slices/user-slice';

function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = getCookie('accessToken');

    if (accessToken) {
      dispatch(fetchUser());
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <OrderWrap>
              <OrderInfo />
            </OrderWrap>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Wrap title='Детали ингредиента' isOrder={false}>
              <IngredientDetails />
            </Wrap>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderWrap>
                <OrderInfo />
              </OrderWrap>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                isOrder={false}
                onClose={() => navigate(-1)}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <OrderModal>
                <OrderInfo />
              </OrderModal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderModal>
                  <OrderInfo />
                </OrderModal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
