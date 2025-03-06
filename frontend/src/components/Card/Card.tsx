import { ReactNode } from 'react'
import * as styles from './Card.css'

export interface CardProps {
  children?: ReactNode
  title?: string
  subtitle?: string
  maxHeight?: string
  onClick?: () => void
}

export const Card = ({ children, title, subtitle, maxHeight, onClick }: CardProps) => {
  return (
    <div className={styles.card} style={{ maxHeight }} onClick={onClick}>
      <div className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
