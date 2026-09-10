import React from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { ActiveTab, UserRole } from '../../types';
import {
  LayoutDashboard,
  MapPin,
  Compass,
  FolderSync,
  Building2,
  FileCheck,
  Map,
  History,
  CalendarDays,
  Users,
  UserCog,
  CalendarClock,
  BarChart3,
  Megaphone,
  UserCheck,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface MenuItem {
  id: ActiveTab;
  tKey: string;
  defaultLabel: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: (ctx: ReturnType<typeof useApp>) => number | null;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'painel',
    tKey: 'nav.painel',
    defaultLabel: 'Painel Admin',
    icon: LayoutDashboard,
    roles: ['ADM'],
  },
  {
    id: 'territorios',
    tKey: 'nav.territorios',
    defaultLabel: 'Territórios',
    icon: MapPin,
    roles: ['ADM', 'DIRIGENTE', 'PUBLICADOR'],
  },
  {
    id: 'meus-territorios',
    tKey: 'nav.meus_territorios',
    defaultLabel: 'Meus Territórios',
    icon: Compass,
    roles: ['ADM', 'DIRIGENTE', 'PUBLICADOR'],
    badge: (ctx) => {
      const count = ctx.territorios.filter(
        (t) =>
          (ctx.currentUser.role === 'PUBLICADOR' && t.publicador_id === ctx.currentUser.id) ||
          (ctx.currentUser.role === 'DIRIGENTE' && t.dirigente_id === ctx.currentUser.id)
      ).length;
      return count > 0 ? count : null;
    },
  },
  {
    id: 'designacoes',
    tKey: 'nav.designacoes',
    defaultLabel: 'Designações',
    icon: FolderSync,
    roles: ['ADM', 'DIRIGENTE'],
  },
  {
    id: 'enderecos',
    tKey: 'nav.enderecos',
    defaultLabel: 'Endereços',
    icon: Building2,
    roles: ['ADM', 'DIRIGENTE', 'PUBLICADOR'],
  },
  {
    id: 'censo',
    tKey: 'nav.censo',
    defaultLabel: 'Censo',
    icon: FileCheck,
    roles: ['ADM', 'DIRIGENTE', 'PUBLICADOR'],
    badge: (ctx) => {
      const pending = ctx.enderecosCenso.filter((c) => c.status === 'pendente').length;
      return pending > 0 ? pending : null;
    },
  },
  {
    id: 'mapa-geral',
    tKey: 'nav.mapa_geral',
    defaultLabel: 'Mapa Geral',
    icon: Map,
    roles: ['ADM', 'DIRIGENTE', 'PUBLICADOR'],
  },
  {
    id: 'visitas',
    tKey: 'nav.visitas',
    defaultLabel: 'Visitas',
    icon: History,
    roles: ['ADM'],
  },
  {
    id: 'programacao-campo',
    tKey: 'nav.programacao_campo',
    defaultLabel: 'Programação de Campo',
    icon: CalendarDays,
    roles: ['ADM', 'DIRIGENTE', 'PUBLICADOR'],
  },
  {
    id: 'publicadores',
    tKey: 'nav.publicadores',
    defaultLabel: 'Publicadores',
    icon: Users,
    roles: ['ADM', 'DIRIGENTE'],
  },
  {
    id: 'dirigentes',
    tKey: 'nav.dirigentes',
    defaultLabel: 'Dirigentes',
    icon: UserCog,
    roles: ['ADM'],
  },
  {
    id: 'programar',
    tKey: 'nav.programar',
    defaultLabel: 'Programar',
    icon: CalendarClock,
    roles: ['ADM'],
  },
  {
    id: 'relatorios',
    tKey: 'nav.relatorios',
    defaultLabel: 'Relatórios',
    icon: BarChart3,
    roles: ['ADM'],
  },
  {
    id: 'campanhas',
    tKey: 'nav.campanhas',
    defaultLabel: 'Campanhas',
    icon: Megaphone,
    roles: ['ADM'],
  },
  {
    id: 'aprovacoes',
    tKey: 'nav.aprovacoes',
    defaultLabel: 'Aprovações',
    icon: UserCheck,
    roles: ['ADM'],
    badge: (ctx) => {
      const pendingUsers = ctx.users.filter((u) => u.status === 'pendente').length;
      return pendingUsers > 0 ? pendingUsers : null;
    },
  },
  {
    id: 'configuracoes',
    tKey: 'nav.configuracoes',
    defaultLabel: 'Configurações',
    icon: Settings,
    roles: ['ADM', 'DIRIGENTE', 'PUBLICADOR'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const ctx = useApp();
  const { activeTab, setActiveTab, currentUser, setSelectedTerritorioId } = ctx;
  const { t } = useI18n();

  const filteredItems = MENU_ITEMS.filter((item) => item.roles.includes(currentUser.role));

  const handleSelectTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setSelectedTerritorioId(null);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-30 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              {t('sidebar.congregacao', 'Congregação')}
            </span>
            <span className="text-xs font-bold text-slate-800">
              Central · Grupo Espanhol
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badgeValue = item.badge ? item.badge(ctx) : null;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{t(item.tKey, item.defaultLabel)}</span>
                </div>

                {badgeValue !== null && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-indigo-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          ESP - MAPAS v2.4 · {currentUser.role}
        </div>
      </aside>
    </>
  );
};
