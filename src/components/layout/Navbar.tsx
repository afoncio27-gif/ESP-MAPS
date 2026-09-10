import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import {
  Bell,
  Globe,
  Shield,
  User as UserIcon,
  Menu,
  X,
  Check,
  Building2,
  KeyRound,
  LogOut,
  Copy,
  PlusCircle,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  mobileSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  mobileSidebarOpen,
}) => {
  const {
    currentUser,
    switchUserRole,
    notificacoes,
    markAllNotificacoesRead,
    users,
    setCurrentUser,
    currentCongregacao,
    congregacoes,
    switchCongregacao,
    logout,
    setActiveTab,
  } = useApp();
  const { locale, setLocale, t } = useI18n();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCongMenu, setShowCongMenu] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const unreadCount = notificacoes.filter((n) => !n.lida).length;

  const roleColors: Record<UserRole, string> = {
    ADM: 'bg-rose-100 text-rose-800 border-rose-200',
    DIRIGENTE: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    PUBLICADOR: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const copyMyCode = () => {
    if (currentUser.codigo_acesso) {
      navigator.clipboard.writeText(currentUser.codigo_acesso);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                ESP
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  ESP - MAPAS
                </span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {t('layout.gestao', 'Gestão de Territórios')}
                </span>
              </div>
            </div>

            {/* Current Congregation Selector Badge */}
            <div className="relative ml-1 sm:ml-3">
              <button
                id="btn-congregacao-menu"
                type="button"
                onClick={() => setShowCongMenu(!showCongMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-950 transition-colors cursor-pointer text-left"
                title="Congregação Ativa"
              >
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="max-w-[120px] sm:max-w-[200px] truncate">
                  <p className="text-xs font-bold truncate leading-tight">
                    {currentCongregacao.nome}
                  </p>
                  <p className="text-[10px] text-indigo-700/80 font-mono font-semibold">
                    {currentCongregacao.codigo_congregação || 'CONG-1001'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              </button>

              {showCongMenu && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="pb-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Congregação Ativa</p>
                    <p className="text-[11px] text-slate-500">
                      Os dados de territórios e publicadores são 100% isolados por congregação.
                    </p>
                  </div>

                  <div className="py-2 space-y-1 max-h-48 overflow-y-auto">
                    {congregacoes.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          switchCongregacao(c.id);
                          setShowCongMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          currentCongregacao.id === c.id
                            ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate font-semibold">{c.nome}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {c.cidade} • {c.codigo_congregação}
                          </p>
                        </div>
                        {currentCongregacao.id === c.id && (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCongMenu(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <span>Cadastrar Nova Congregação</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setLocale('pt-BR')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  locale === 'pt-BR'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Português"
              >
                PT
              </button>
              <button
                onClick={() => setLocale('es')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  locale === 'es'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Español"
              >
                ES
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">
                      {t('notif.titulo', 'Notificações')} ({notificacoes.length})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificacoesRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                      >
                        {t('notif.marcar_todas', 'Marcar todas como lidas')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notificacoes.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        {t('notif.sem', 'Sem notificações')}
                      </div>
                    ) : (
                      notificacoes.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 hover:bg-slate-50 transition-colors ${
                            !n.lida ? 'bg-indigo-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-900">
                              {n.titulo}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {new Date(n.data).toLocaleDateString(
                                locale === 'es' ? 'es-ES' : 'pt-BR'
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {n.mensagem}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Access Code Menu */}
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                  {currentUser.nome.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.nome}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {currentUser.codigo_acesso}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase ${
                    roleColors[currentUser.role]
                  }`}
                >
                  {currentUser.role}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Current User Card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Meu Acesso
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase ${
                          roleColors[currentUser.role]
                        }`}
                      >
                        {currentUser.role}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 text-sm mt-1">{currentUser.nome}</p>

                    <div className="mt-2 flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                          Código de Acesso
                        </span>
                        <span className="font-mono font-bold text-xs text-indigo-600">
                          {currentUser.codigo_acesso || '—'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={copyMyCode}
                        className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Copiar meu código"
                      >
                        {copiedCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Simulator for demo & quick switching */}
                  <div className="px-1 py-1 border-b border-slate-100 pb-2 mb-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Simular Papel na Congregação:
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          switchUserRole('ADM');
                          setShowUserMenu(false);
                        }}
                        className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          currentUser.role === 'ADM'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        ADM
                      </button>
                      <button
                        onClick={() => {
                          switchUserRole('DIRIGENTE');
                          setShowUserMenu(false);
                        }}
                        className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          currentUser.role === 'DIRIGENTE'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Dirigente
                      </button>
                      <button
                        onClick={() => {
                          switchUserRole('PUBLICADOR');
                          setShowUserMenu(false);
                        }}
                        className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          currentUser.role === 'PUBLICADOR'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Publicador
                      </button>
                    </div>
                  </div>

                  {/* Other members in this congregation */}
                  <div className="max-h-36 overflow-y-auto space-y-0.5 mb-2">
                    <p className="px-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      Publicadores desta congregação:
                    </p>
                    {users
                      .filter((u) => u.status === 'aprovado')
                      .slice(0, 6)
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUser(u);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                            currentUser.id === u.id
                              ? 'bg-indigo-50 font-bold text-indigo-900'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="truncate">
                            <span>{u.nome}</span>
                            <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                              ({u.codigo_acesso})
                            </span>
                          </div>
                          {currentUser.id === u.id && (
                            <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          )}
                        </button>
                      ))}
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      id="btn-logout-navbar"
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair / Trocar de Conta</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
