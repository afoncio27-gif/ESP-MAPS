import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import {
  Settings,
  Globe,
  User,
  Shield,
  Database,
  RefreshCw,
  Download,
  Check,
  Building2,
  KeyRound,
  Copy,
  LogOut,
} from 'lucide-react';

export const ConfiguracoesView: React.FC = () => {
  const {
    currentUser,
    resetToDefaultData,
    switchUserRole,
    currentCongregacao,
    users,
    territorios,
    logout,
  } = useApp();
  const { locale, setLocale, t } = useI18n();

  const [resetSuccess, setResetSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (currentUser.codigo_acesso) {
      navigator.clipboard.writeText(currentUser.codigo_acesso);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar os dados de demonstração iniciais?')) {
      resetToDefaultData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      localStorageDump: { ...localStorage },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esp_mapas_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>{t('nav.configuracoes', 'Configurações')}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Preferências do sistema, idioma e gerenciamento de conta
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dados de demonstração restaurados com sucesso!</span>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Meu Perfil de Acesso</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-500 mb-1">Nome Completo:</label>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-900">
              {currentUser.nome}
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-500 mb-1">Código Único de Acesso:</label>
            <div className="p-2 bg-indigo-50/80 rounded-xl border border-indigo-200 flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-indigo-700">
                {currentUser.codigo_acesso || '—'}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 rounded-md text-indigo-600 hover:bg-indigo-100/70 transition-colors cursor-pointer"
                title="Copiar Código"
              >
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-500 mb-1">Função Atual:</label>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-indigo-700">
              {currentUser.role}
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-500 mb-1">Telefone / WhatsApp:</label>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-900">
              {currentUser.telefone || 'Não informado'}
            </div>
          </div>
        </div>
      </div>

      {/* Congregation Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Dados da Minha Congregação</span>
          </h3>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
            {currentCongregacao.codigo_congregação}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-semibold text-[11px]">Nome da Congregação</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentCongregacao.nome}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-semibold text-[11px]">Cidade / UF</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {currentCongregacao.cidade} {currentCongregacao.estado ? `- ${currentCongregacao.estado}` : ''}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-semibold text-[11px]">Publicadores & Territórios</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {users.length} membros • {territorios.length} mapas
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <p className="text-[11px] text-slate-500">
            Deseja sair para trocar de conta ou acessar outra congregação?
          </p>
          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Desconectar</span>
          </button>
        </div>
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          <span>{t('conf.idioma', 'Idioma do Aplicativo')}</span>
        </h3>

        <p className="text-xs text-slate-500">
          Alterne entre Português e Espanhol para toda a interface do sistema:
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            onClick={() => setLocale('pt-BR')}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              locale === 'pt-BR'
                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <span className="font-bold text-xs text-slate-900 block">Português</span>
              <span className="text-[11px] text-slate-400">Brasil</span>
            </div>
            {locale === 'pt-BR' && <Check className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setLocale('es')}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              locale === 'es'
                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>
              <span className="font-bold text-xs text-slate-900 block">Español</span>
              <span className="text-[11px] text-slate-400">Internacional</span>
            </div>
            {locale === 'es' && <Check className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Armazenamento & Dados</span>
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed">
          Os dados do ESP - MAPAS ficam salvos no armazenamento local do seu navegador para uso rápido offline. Você pode exportar uma cópia de segurança ou restaurar a base inicial.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar Backup (JSON)</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restaurar Dados Padrão</span>
          </button>
        </div>
      </div>

      {/* About Box */}
      <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700">ESP - MAPAS v2.4.0</div>
        <div>Congregação Central · Grupo de Língua Espanhola</div>
        <div className="text-[11px] text-slate-400">
          Desenvolvido com OpenStreetMap, Leaflet e React
        </div>
      </div>
    </div>
  );
};
