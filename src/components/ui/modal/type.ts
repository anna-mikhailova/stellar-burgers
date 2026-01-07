import { ReactNode } from 'react';

export type TModalUIProps = {
  title: string;
  isOrder: boolean;
  onClose: () => void;
  children?: ReactNode;
};
