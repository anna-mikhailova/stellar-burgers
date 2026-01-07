import { FC, memo, useEffect } from 'react';

import { TWrapProps } from './type';
import { WrapUI } from '@ui';

export const Wrap: FC<TWrapProps> = memo(({ title, isOrder, children }) => (
  <WrapUI title={title} isOrder={isOrder}>
    {children}
  </WrapUI>
));
