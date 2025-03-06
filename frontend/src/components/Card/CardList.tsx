import React from 'react';
import * as styles from './CardList.css';

interface CardListProps {
  children?: React.ReactNode;
};

const CardList: React.FC<CardListProps> = ({ children }) => (
  <div className={styles.cardList}>
    {children}
  </div>
);

export default CardList;
