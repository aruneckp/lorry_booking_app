import { useState } from 'react';
import OwnerLayout from './OwnerLayout';
import OwnerDashboard from './OwnerDashboard';
import VehicleMaster from './VehicleMaster';
import DriverMaster from './DriverMaster';
import AvailabilityView from './AvailabilityView';
import ItemsPolicy from './ItemsPolicy';
import TransactionsPage from './TransactionsPage';
import AllBookings from './AllBookings';

export default function OwnerApp() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <OwnerDashboard />;
      case 'transactions': return <TransactionsPage />;
      case 'availability': return <AvailabilityView />;
      case 'vehicles':     return <VehicleMaster />;
      case 'drivers':      return <DriverMaster />;
      case 'items':        return <ItemsPolicy />;
      case 'allbookings':  return <AllBookings />;
      default:             return <OwnerDashboard />;
    }
  };

  return (
    <OwnerLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </OwnerLayout>
  );
}
