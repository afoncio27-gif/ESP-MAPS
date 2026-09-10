import React, { useState } from 'react';
import { I18nProvider } from './i18n';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

import { PainelView } from './components/views/PainelView';
import { TerritoriosView } from './components/views/TerritoriosView';
import { TerritorioDetalheView } from './components/views/TerritorioDetalheView';
import { MeusTerritoriosView } from './components/views/MeusTerritoriosView';
import { DesignacoesView } from './components/views/DesignacoesView';
import { EnderecosView } from './components/views/EnderecosView';
import { CensoView } from './components/views/CensoView';
import { MapaGeralView } from './components/views/MapaGeralView';
import { VisitasView } from './components/views/VisitasView';
import { ProgramacaoCampoView } from './components/views/ProgramacaoCampoView';
import { PublicadoresView } from './components/views/PublicadoresView';
import { DirigentesView } from './components/views/DirigentesView';
import { ProgramarView } from './components/views/ProgramarView';
import { RelatoriosView } from './components/views/RelatoriosView';
import { CampanhasView } from './components/views/CampanhasView';
import { AprovacoesView } from './components/views/AprovacoesView';
import { ConfiguracoesView } from './components/views/ConfiguracoesView';
import { LoginView } from './components/views/LoginView';

const AppContent: React.FC = () => {
  const { activeTab, selectedTerritorioId, setSelectedTerritorioId, isAuthenticated } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not logged in, render authentication / registration screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderView = () => {
    // If a territory detail is selected, show its detail view
    if (selectedTerritorioId) {
      return (
        <TerritorioDetalheView
          territorioId={selectedTerritorioId}
          onBack={() => setSelectedTerritorioId(null)}
        />
      );
    }

    switch (activeTab) {
      case 'painel':
        return <PainelView />;
      case 'territorios':
        return <TerritoriosView />;
      case 'meus-territorios':
        return <MeusTerritoriosView />;
      case 'designacoes':
        return <DesignacoesView />;
      case 'enderecos':
        return <EnderecosView />;
      case 'censo':
        return <CensoView />;
      case 'mapa-geral':
        return <MapaGeralView />;
      case 'visitas':
        return <VisitasView />;
      case 'programacao-campo':
        return <ProgramacaoCampoView />;
      case 'publicadores':
        return <PublicadoresView />;
      case 'dirigentes':
        return <DirigentesView />;
      case 'programar':
        return <ProgramarView />;
      case 'relatorios':
        return <RelatoriosView />;
      case 'campanhas':
        return <CampanhasView />;
      case 'aprovacoes':
        return <AprovacoesView />;
      case 'configuracoes':
        return <ConfiguracoesView />;
      default:
        return <PainelView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 transition-all duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </I18nProvider>
  );
}
