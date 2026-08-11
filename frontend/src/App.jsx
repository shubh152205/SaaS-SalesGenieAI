import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LeadIntelligence from './pages/LeadIntelligence';
import AIOutreach from './pages/AIOutreach';
import DealPipeline from './pages/DealPipeline';
import MeetingIntelligence from './pages/MeetingIntelligence';
import Settings from './pages/Settings';
import AuthPage from './pages/AuthPage';

const ProtectedLayout = ({ children }) => {
  const { token } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="main-content-wrapper">
        {React.cloneElement(children, { collapsed, setCollapsed })}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedLayout>
            <LeadIntelligence />
          </ProtectedLayout>
        }
      />

      <Route
        path="/outreach"
        element={
          <ProtectedLayout>
            <AIOutreach />
          </ProtectedLayout>
        }
      />

      <Route
        path="/pipeline"
        element={
          <ProtectedLayout>
            <DealPipeline />
          </ProtectedLayout>
        }
      />

      <Route
        path="/meetings"
        element={
          <ProtectedLayout>
            <MeetingIntelligence />
          </ProtectedLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <Settings />
          </ProtectedLayout>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
