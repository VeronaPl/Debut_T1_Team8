import { useAppRoutes } from '../pages';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './App.scss'

export const App = () => {
  
  const appRoutes = useAppRoutes();
  return appRoutes;
}
