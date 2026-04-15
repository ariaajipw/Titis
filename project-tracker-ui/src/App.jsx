// src/App.jsx
import { useState } from 'react';
import { Toaster } from 'sonner';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar }   from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Header }    from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Tasks }     from './pages/Tasks';
import { Team }      from './pages/Team';
import { Reports }   from './pages/Reports';
import { Settings }  from './pages/Settings';

import { useTasks }  from './hooks/useTasks';

function AppContent() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { tasks, loading, refetch, addTask } = useTasks();
  const { theme } = useTheme();

  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard tasks={tasks} loading={loading} addTask={addTask} />;
      case 'tasks':
        return <Tasks tasks={tasks} loading={loading} addTask={addTask} />;
      case 'team':
        return <Team />;
      case 'reports':
        return <Reports tasks={tasks} loading={loading} />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 dark:text-zinc-500">Page not found.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-200">
      {/* ── Sidebar — Desktop only ── */}
      <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onRefresh={refetch} loading={loading} />
        <main className="flex-1 overflow-auto p-4 lg:p-8 pb-20 lg:pb-8">
          {renderPage()}
        </main>
      </div>

      {/* ── Bottom Nav — Mobile only ── */}
      <MobileNav activeMenu={activeMenu} onMenuClick={setActiveMenu} />

      {/* ── Toast Notifications ── */}
      <Toaster
        position="top-right"
        theme={theme}
        richColors
        closeButton
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
