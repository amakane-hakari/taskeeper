import { useDispatch, useSelector } from 'react-redux';
import { setLocale } from '../uiSlice';
import { RootState } from '@/store';
import { Locale } from '@/i18n/config';

export const useLanguage = () => {
  const currentLocale = useSelector((state: RootState) => state.ui.locale);
  const dispatch = useDispatch();

  return {
    currentLocale,
    setLocale: (locale: Locale) => dispatch(setLocale(locale)),
  };
};
