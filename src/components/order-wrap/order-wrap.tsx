import { FC, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wrap } from '../wrap';
import { TOrderWrapProps } from './type';

export const OrderWrap: FC<TOrderWrapProps> = ({ children, customTitle }) => {
  const { number } = useParams<{ number: string }>();

  const title = customTitle || `#${number?.padStart(6, '0')}`;

  return (
    <Wrap title={title} isOrder>
      {children}
    </Wrap>
  );
};
