import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Territorio, TerritorioStatus } from '../../types';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Layers,
  UserCheck,
  CheckCircle2,
  Trash2,
  Edit2,
  ArrowRight,
  Home,
} from 'lucide-react';
import { TerritorioModal } from '../modals/TerritorioModal';
import { DesignarModal } from '../modals/DesignarModal';
import { DesignarLoteModal } from '../modals/DesignarLoteModal';

export const TerritoriosView: React.FC = () => {
  const {
    territorios,
    deleteTerritorio,
    setSelectedTerritorioId,
    currentUser,
  } = useApp();
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [bairroFilter, setBairroFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isTerritorioModalOpen, setIsTerritorioModalOpen] = useState(false);
  const [editingTerritorio, setEditingTerritorio] = useState<Territorio | null>(null);
  const [designarModalTerritorio, setDesignarModalTerritorio] = useState<Territorio | null>(null);
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
  const [deletingTerritorio, setDeletingTerritorio] = useState<Territorio | null>(null);

  // Extract all unique bairros
  const bairros = Array.from(new Set(territorios.map((t) => t.bairro))).filter(Boolean);

  const filteredTerritorios = territorios.filter((t) => {
    const matchSearch =
      t.nome.toLowerCase().includes(search.toLowerCase()) ||
      t.numero.toLowerCase().includes(search.toLowerCase()) ||
      t.bairro.toLowerCase().includes(search.toLowerCase()) ||
      (t.publicador_nome && t.publicador_nome.toLowerCase().includes(search.toLowerCase())) ||
      (t.dirigente_nome && t.dirigente_nome.toLowerCase().includes(search.toLowerCase()));

    const matchBairro = !bairroFilter || t.bairro === bairroFilter;
    const matchStatus = statusFilter === 'todos' || t.status === statusFilter;

    return matchSearch && matchBairro && matchStatus;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTerritorios.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTerritorios.map((t) => t.id));
    }
  };

  const getStatusBadge = (status: TerritorioStatus) => {
    switch (status) {
      case 'disponivel':
        return { label: 'Disponível', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'designado_dirigente':
        return { label: 'Designado p/ Dirigente', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'designado_publicador':
        return { label: 'Designado p/ Publicador', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'em_campo':
        return { label: 'Em campo', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'concluido':
        return { label: 'Concluído', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {t('nav.territorios', 'Territórios')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('terr.subtitulo', 'Gerencie os territórios da congregação')}
          </p>
        </div>

        {currentUser.role === 'ADM' && (
          <button
            onClick={() => {
              setEditingTerritorio(null);
              setIsTerritorioModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('terr.novo', 'Novo Território')}</span>
          </button>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por número, nome, bairro..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Bairro Filter */}
          <div className="relative">
            <select
              value={bairroFilter}
              onChange={(e) => setBairroFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">{t('terr.todos_bairros', 'Todos os bairros')}</option>
              {bairros.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="todos">Todos os status</option>
              <option value="disponivel">Disponível</option>
              <option value="designado_dirigente">Designado p/ Dirigente</option>
              <option value="designado_publicador">Designado p/ Publicador</option>
              <option value="em_campo">Em campo</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>

        {/* Batch Selection Action Bar */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-900">
                {selectedIds.length} {t('terr.selecionados', 'território(s) selecionado(s)')}
              </span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline ml-2"
              >
                {t('terr.limpar', 'Limpar seleção')}
              </button>
            </div>

            {(currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
              <button
                onClick={() => setIsLoteModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-indigo-700 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('terr.designar_selecionados', 'Designar Selecionados')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Territórios Grid */}
      {filteredTerritorios.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">
            {t('terr.nenhum', 'Nenhum território')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {t('terr.nenhum_msg', 'Crie ou aguarde a designação de territórios.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerritorios.map((terr) => {
            const isSelected = selectedIds.includes(terr.id);
            const statusBadge = getStatusBadge(terr.status);
            const progress =
              terr.total_enderecos > 0
                ? Math.round((terr.total_visitados / terr.total_enderecos) * 100)
                : 0;

            return (
              <div
                key={terr.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-2xs hover:shadow-md ${
                  isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top Bar: Checkbox, Number and Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {(currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(terr.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-900">
                            {terr.numero}
                          </span>
                          <span className="font-bold text-sm text-slate-900 truncate max-w-[170px]">
                            {terr.nome}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium block">
                          {terr.bairro || t('terr.sem_bairro', 'Sem bairro')} · {terr.cidade}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusBadge.bg}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Description if available */}
                  {terr.descricao && (
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                      {terr.descricao}
                    </p>
                  )}

                  {/* Assigned to info */}
                  <div className="mt-3 text-xs">
                    <div className="text-slate-500 flex items-center justify-between">
                      <span>{t('terr.designado_para', 'Designado para:')}</span>
                      <span className="font-bold text-slate-900">
                        {terr.publicador_nome || terr.dirigente_nome || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Address Progress bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Progresso de visitas</span>
                      <span className="font-bold text-indigo-600">
                        {terr.total_visitados}/{terr.total_enderecos} ({progress}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {(currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
                      <button
                        onClick={() => setDesignarModalTerritorio(terr)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title={t('designar.titulo', 'Designar Território')}
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}

                    {currentUser.role === 'ADM' && (
                      <>
                        <button
                          onClick={() => {
                            setEditingTerritorio(terr);
                            setIsTerritorioModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingTerritorio(terr)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedTerritorioId(terr.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>{t('td.detalhes', 'Detalhes')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Territorio Create/Edit Modal */}
      <TerritorioModal
        initialTerritorio={editingTerritorio}
        isOpen={isTerritorioModalOpen}
        onClose={() => {
          setIsTerritorioModalOpen(false);
          setEditingTerritorio(null);
        }}
      />

      {/* Designar Single Territory Modal */}
      {designarModalTerritorio && (
        <DesignarModal
          territorio={designarModalTerritorio}
          isOpen={!!designarModalTerritorio}
          onClose={() => setDesignarModalTerritorio(null)}
        />
      )}

      {/* Designar em Lote Modal */}
      {isLoteModalOpen && (
        <DesignarLoteModal
          selectedTerritorioIds={selectedIds}
          isOpen={isLoteModalOpen}
          onClose={() => setIsLoteModalOpen(false)}
          onSuccess={() => setSelectedIds([])}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTerritorio && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('terr.excluir_titulo', 'Excluir território')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t(
                'terr.excluir_msg',
                'Deseja realmente excluir este território? Esta ação não pode ser desfeita.'
              )}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingTerritorio(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  deleteTerritorio(deletingTerritorio.id);
                  setDeletingTerritorio(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                {t('confirm.excluir', 'Excluir')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
