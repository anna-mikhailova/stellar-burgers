import { FC, memo } from 'react';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, isOrder, onClose, children }) => {
    const TitleTextClass = isOrder
      ? 'text_type_digits-default'
      : 'text_type_main-large';
    return (
      <>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h3 className={`${styles.title} text ${TitleTextClass}`}>
              {title}
            </h3>
            <button className={styles.button} type='button'>
              <CloseIcon type='primary' onClick={onClose} />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    );
  }
);
