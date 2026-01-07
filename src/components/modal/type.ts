import { ReactNode } from 'react';

export type TModalProps = {
  title: string;
  isOrder: boolean;
  onClose: () => void;
  children?: ReactNode;
};
