import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from '../modal';
import { TOrderModalProps } from './type';

export const OrderModal: FC<TOrderModalProps> = ({ children, customTitle }) => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const title = customTitle || `#${number?.padStart(6, '0')}`;

  return (
    <Modal title={title} isOrder onClose={() => navigate(-1)}>
      {children}
    </Modal>
  );
};
