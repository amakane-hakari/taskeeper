import { RootState } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import { toggleNavCollapsed } from '@/features/ui/uiSlice';

export const useNavCollapse = () => {
  const navCollapsed = useSelector((state: RootState) => state.ui.navCollapsed);
  const dispatch = useDispatch();
  return {
    navCollapsed,
    toggleNavCollapsed: () => dispatch(toggleNavCollapsed()),
  };
};
