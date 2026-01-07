import { FC, memo } from 'react';

import styles from './wrap.module.css';
import { TWrapUIProps } from './type';

export const WrapUI: FC<TWrapUIProps> = memo(({ title, isOrder, children }) => {
  const TitleTextClass = isOrder
    ? 'text_type_digits-default'
    : '<text_type_ma></text_type_ma>in-large';
  return (
    <div className={styles.wrap}>
      <h3 className={`${styles.title} text ${TitleTextClass}`}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
});
