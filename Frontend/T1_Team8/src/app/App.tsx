import { useAppRoutes } from '../pages';
import './App.scss'

export const App = () => {
  
  const appRoutes = useAppRoutes();
  return appRoutes;
}
