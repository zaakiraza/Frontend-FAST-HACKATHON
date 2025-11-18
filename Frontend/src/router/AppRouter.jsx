import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Energy from '../pages/Energy/Energy';
import Space from '../pages/Space/Space';
import Maintenance from '../pages/Maintenance/Maintenance';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="energy" element={<Energy />} />
          <Route path="space" element={<Space />} />
          <Route path="maintenance" element={<Maintenance />} />
          
          {/* Disabled routes - can be uncommented when ready */}
          {/* <Route path="security" element={<ComingSoon page="Security" />} /> */}
          {/* <Route path="mobility" element={<ComingSoon page="Mobility" />} /> */}
          {/* <Route path="connectivity" element={<ComingSoon page="Connectivity" />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
