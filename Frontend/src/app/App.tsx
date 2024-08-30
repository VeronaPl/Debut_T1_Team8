import { useAppRoutes } from '../pages';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './App.scss';

export const App = () => {
  const appRoutes = useAppRoutes();
  return appRoutes;
};
