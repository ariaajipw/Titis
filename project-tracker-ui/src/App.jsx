// src/App.jsx
import { useState } from 'react';
import { Toaster } from 'sonner';

import { Sidebar }   from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Header }    from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';

import { useTasks }  from './hooks/useTasks';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // ✅ Kita ambil addTask dari hook (ini yang akan dikirim ke Dashboard)
  const { tasks, loading, refetch, addTask } = useTasks(); 

  /**
   * Render halaman berdasarkan menu aktif.
   */
  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        // ✅ Kirim addTask sebagai props ke Dashboard
        return <Dashboard tasks={tasks} loading={loading} addTask={addTask} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">Halaman "{activeMenu}" coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-zinc-950 overflow-hidden">

      {/* ── Sidebar — Desktop only ── */}
      <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <Header onRefresh={refetch} loading={loading} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 pb-20 lg:pb-8">
          {renderPage()}
        </main>
      </div>

      {/* ── Bottom Nav — Mobile only ── */}
      <MobileNav activeMenu={activeMenu} onMenuClick={setActiveMenu} />

      {/* ── Toast Notifications — Satu untuk semua halaman ── */}
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: '#1c1c1e',
            border: '1px solid #3f3f46',
            color: '#e4e4e7',
          },
        }}
      />
    </div>
  );
}

export default App;