import { createContext, useContext } from 'react';

type NavigateFn = (pageId: string) => void;

export const NavigationContext = createContext<NavigateFn>(() => {});

export function useNavigatePage(): NavigateFn {
  return useContext(NavigationContext);
}
