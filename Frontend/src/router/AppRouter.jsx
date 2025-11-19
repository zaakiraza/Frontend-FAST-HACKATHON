import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Energy from '../pages/Energy/Energy';
import Space from '../pages/Space/Space';
import Maintenance from '../pages/Maintenance/Maintenance';
import AdminCampuses from '../pages/AdminCampuses/AdminCampuses';
import AdminBuildings from '../pages/AdminBuildings/AdminBuildings';
import AdminRooms from '../pages/AdminRooms/AdminRooms';
import AdminTickets from '../pages/AdminTickets/AdminTickets';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="energy" element={<Energy />} />
          <Route path="space" element={<Space />} />
          <Route path="maintenance" element={<Maintenance />} />
          
          {/* Admin Routes */}
          <Route path="admin/campuses" element={<AdminCampuses />} />
          <Route path="admin/buildings" element={<AdminBuildings />} />
          <Route path="admin/rooms" element={<AdminRooms />} />
          <Route path="admin/tickets" element={<AdminTickets />} />
          
          {/* <Route path="security" element={<ComingSoon page="Security" />} /> */}
          {/* <Route path="mobility" element={<ComingSoon page="Mobility" />} /> */}
          {/* <Route path="connectivity" element={<ComingSoon page="Connectivity" />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
