import './App.css';

import Home from './components/Home';
import StationDetails from './components/StationDetails';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import ServiceDetails from './components/ServiceDetails';
import ErrorComponent from './customComponents/ErrorComponent';
const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <Outlet />
        </>
      ),
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/search/:stationCode',
          element: <StationDetails />,
        },
        {
          path: '/service/:serviceUid/:year/:month/:day',
          element: <ServiceDetails />,
        },
      ],
      errorElement: <ErrorComponent />,
    },
  ]);
  return <RouterProvider router={appRouter} />;
};
export default App;