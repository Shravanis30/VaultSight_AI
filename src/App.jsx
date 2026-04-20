import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/landing/LandingPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import UserManagement from './pages/admin/UserManagement';
import TransactionLogs from './pages/admin/TransactionLogs';
import UPITransactions from './pages/admin/UPITransactions';
import SecurityControl from './pages/admin/SecurityControl';
import LoginActivity from './pages/admin/LoginActivity';

// User Pages
import UserLayout from './pages/user/UserLayout';
import UserLogin from './pages/user/UserLogin';
import UserDashboard from './pages/user/UserDashboard';
import SendMoney from './pages/user/SendMoney';
import TransactionHistory from './pages/user/TransactionHistory';
import DebitCard from './pages/user/DebitCard';
import ChangeUpiPin from './pages/user/ChangeUpiPin';

// Threat Pages
import ThreatLayout from './pages/threat/ThreatLayout';
import ThreatOverview from './pages/threat/ThreatOverview';
import FraudTransactions from './pages/threat/FraudTransactions';
import LoginAnomalies from './pages/threat/LoginAnomalies';
import SemanticSearch from './pages/threat/SemanticSearch';
import RiskAnalysis from './pages/threat/RiskAnalysis';
import AutoLockEvents from './pages/threat/AutoLockEvents';

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col">
      {!isLandingPage && <Navbar />}
      <div className={`${isLandingPage ? '' : 'flex-1'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="security" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="transactions" element={<TransactionLogs />} />
            <Route path="upi" element={<UPITransactions />} />
            <Route path="logins" element={<LoginActivity />} />
            <Route path="security" element={<SecurityControl />} />
          </Route>

          {/* User App Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<UserLogin />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="send" element={<SendMoney />} />
            <Route path="history" element={<TransactionHistory />} />
            <Route path="card" element={<DebitCard />} />
            <Route path="change-pin" element={<ChangeUpiPin />} />
          </Route>

          {/* Threat Intelligence Routes */}
          <Route path="/threat" element={<ThreatLayout />}>
            <Route index element={<ThreatOverview />} />
            <Route path="fraud" element={<FraudTransactions />} />
            <Route path="anomalies" element={<LoginAnomalies />} />
            <Route path="search" element={<SemanticSearch />} />
            <Route path="risk" element={<RiskAnalysis />} />
            <Route path="locks" element={<AutoLockEvents />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
