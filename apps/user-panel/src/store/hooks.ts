import { useDispatch, useSelector } from '@repo/store';
import type { TypedUseSelectorHook } from '@repo/store';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
