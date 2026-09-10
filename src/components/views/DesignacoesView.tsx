import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { FolderSync, UserCheck, Calendar, CheckCircle2, RotateCcw, FileText, Search } from 'lucide-react';

export const DesignacoesView: React.FC = () => {
  const {
    designacoesDirigente,
    designacoesPublicador,
    territorios,
    revokeTerritorio,
    concludeTerritorio,
    setSelectedTerritorioId,
    setActiveTab,
  } = useApp();
  const { t, locale } = useI18n();

  const [activeSubTab, setActiveSubTab] = useState<'dirigentes' | 'publicadores' | 'registro_s13'>('publicadores');
  const [statusFilter, setStatusFilter] = useState<'todas' | 'ativas' | 'concluidas'>('todas');
  const [search, setSearch] = useState('');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(locale === 'es' ? 'es-ES' : 'pt-BR');
  };

  const filteredDirigentes = designacoesDirigente.filter((d) => {
    const matchStatus =
      statusFilter === 'todas' ? true : d.status === (statusFilter === 'ativas' ? 'ativo' : 'concluido');
    const matchSearch =
      d.territorio_nome.toLowerCase().includes(search.toLowerCase()) ||
      d.dirigente_nome.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredPublicadores = designacoesPublicador.filter((d) => {
    const matchStatus =
      statusFilter === 'todas' ? true : d.status === (statusFilter === 'ativas' ? 'ativo' : 'concluido');
    const matchSearch =
      d.territorio_nome.toLowerCase().includes(search.toLowerCase()) ||
      d.publicador_nome.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {t('nav.designacoes', 'Designações')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Histórico e controle de designações para dirigentes e publicadores
          </p>
        </div>

        <button
          onClick={() => setActiveTab('territorios')}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <FolderSync className="w-4 h-4" />
          <span>Nova Designação</span>
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('publicadores')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'publicadores'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('desig.tab_publicadores', 'Para Publicadores')} ({designacoesPublicador.length})
          </button>
          <button
            onClick={() => setActiveSubTab('dirigentes')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'dirigentes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('desig.tab_dirigentes', 'Para Dirigentes')} ({designacoesDirigente.length})
          </button>
          <button
            onClick={() => setActiveSubTab('registro_s13')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'registro_s13'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            Registro de Designações (S-13)
          </button>
        </div>

        {activeSubTab !== 'registro_s13' && (
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar designação..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-52"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todas">Todas</option>
              <option value="ativas">Ativas</option>
              <option value="concluidas">Concluídas</option>
            </select>
          </div>
        )}
      </div>

      {/* Content: Publicadores */}
      {activeSubTab === 'publicadores' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {filteredPublicadores.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              {t('desig.nenhuma_publicador', 'Nenhuma designação para publicadores encontrada.')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Território</th>
                    <th className="py-3 px-4">Publicador</th>
                    <th className="py-3 px-4">Data Início</th>
                    <th className="py-3 px-4">Data Devolução</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPublicadores.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {d.territorio_nome}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {d.publicador_nome}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(d.data_inicio)}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(d.data_devolucao)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'ativo'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {d.status === 'ativo' ? 'Ativo' : 'Concluído'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {d.status === 'ativo' && (
                          <button
                            onClick={() => revokeTerritorio(d.territorio_id)}
                            className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition-colors"
                          >
                            Revogar
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedTerritorioId(d.territorio_id);
                            setActiveTab('territorios');
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          Ver Território
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Content: Dirigentes */}
      {activeSubTab === 'dirigentes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {filteredDirigentes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              {t('desig.nenhuma_dirigente', 'Nenhuma designação para dirigentes encontrada.')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Território</th>
                    <th className="py-3 px-4">Dirigente</th>
                    <th className="py-3 px-4">Data Início</th>
                    <th className="py-3 px-4">Data Fim</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDirigentes.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {d.territorio_nome}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {d.dirigente_nome}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(d.data_inicio)}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(d.data_fim)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'ativo'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {d.status === 'ativo' ? 'Ativo' : 'Concluído'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {d.status === 'ativo' && (
                          <button
                            onClick={() => revokeTerritorio(d.territorio_id)}
                            className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition-colors"
                          >
                            Revogar
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedTerritorioId(d.territorio_id);
                            setActiveTab('territorios');
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          Ver Território
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Content: S-13 Territory Assignment Record Card */}
      {activeSubTab === 'registro_s13' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Registro de Designação de Território (S-13)
                </h3>
                <p className="text-xs text-slate-400">
                  Visão consolidada do cartão de registro de cada território da congregação
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Imprimir Registro
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {territorios.map((terr) => {
                const desigs = designacoesPublicador.filter((p) => p.territorio_id === terr.id);

                return (
                  <div
                    key={terr.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <div className="font-extrabold text-sm text-slate-900">
                        {terr.numero} · {terr.nome}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        {terr.bairro}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Total de Endereços:</span>
                        <span className="font-bold text-slate-900">{terr.total_enderecos}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Designado atualmente:</span>
                        <span className="font-bold text-indigo-700">
                          {terr.publicador_nome || terr.dirigente_nome || 'Disponível'}
                        </span>
                      </div>
                    </div>

                    {/* Historical entries for this territory */}
                    <div className="mt-2 pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Histórico de designações
                      </span>
                      {desigs.length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic">Sem registros prévios</span>
                      ) : (
                        <div className="space-y-1">
                          {desigs.map((d) => (
                            <div
                              key={d.id}
                              className="text-[11px] flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200"
                            >
                              <span className="font-medium text-slate-800">{d.publicador_nome}</span>
                              <span className="text-slate-400">
                                {formatDate(d.data_inicio)} → {formatDate(d.data_devolucao)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
