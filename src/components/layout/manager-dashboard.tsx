import { ReactNode } from 'react';
import Sidebar from '../shared/sidebar/sidebar';

interface ManagerDashboardProps {
  children: ReactNode;
}

const ManagerDashboard = ({ children }: ManagerDashboardProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Component */}
        <div className="w-full md:w-1/4">
          <Sidebar userType="manager" />
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;