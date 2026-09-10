import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Endereco } from '../../types';
import {
  Building2,
  Search,
  Plus,
  Navigation,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { EnderecoModal } from '../modals/EnderecoModal';
import { RegistrarVisitaModal } from '../modals/RegistrarVisitaModal';

export const EnderecosView: React.FC = () => {
  const {
    enderecos,
    territorios,
    toggleConfirmEndereco,
    deleteEndereco,
    currentUser,
    setSelectedTerritorioId,
    setActiveTab,
  } = useApp();
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [territorioFilter, setTerritorioFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendentes' | 'visitados'>('todos');
  const [confirmFilter, setConfirmFilter] = useState<'todos' | 'confirmados' | 'nao_confirmados'>('todos');

  // Modals
  const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false);
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null);
  const [visitaModalEndereco, setVisitaModalEndereco] = useState<Endereco | null>(null);
  const [deletingEndereco, setDeletingEndereco] = useState<Endereco | null>(null);

  const activeEnderecos = enderecos.filter((e) => e.ativo);

  const filtered = activeEnderecos.filter((e) => {
    const matchSearch =
      e.rua.toLowerCase().includes(search.toLowerCase()) ||
      e.numero.toLowerCase().includes(search.toLowerCase()) ||
      e.bairro.toLowerCase().includes(search.toLowerCase()) ||
      (e.territorio_nome && e.territorio_nome.toLowerCase().includes(search.toLowerCase())) ||
      (e.observacoes && e.observacoes.toLowerCase().includes(search.toLowerCase()));

    const matchTerr = !territorioFilter || e.territorio_id === territorioFilter;
    const matchStatus =
      statusFilter === 'todos' ? true : e.status === (statusFilter === 'visitados' ? 'visitado' : 'pendente');
    const matchConfirm =
      confirmFilter === 'todos'
        ? true
        : confirmFilter === 'confirmados'
        ? e.endereco_confirmado
        : !e.endereco_confirmado;

    return matchSearch && matchTerr && matchStatus && matchConfirm;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {t('nav.enderecos', 'Endereços')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeEnderecos.length} endereços em língua estrangeira cadastrados na congregação
          </p>
        </div>

        {(currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
          <button
            onClick={() => {
              setEditingEndereco(null);
              setIsEnderecoModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('end.novo', 'Novo Endereço')}</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar rua, número, bairro..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Territory filter */}
          <div>
            <select
              value={territorioFilter}
              onChange={(e) => setTerritorioFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Todos os territórios</option>
              {territorios.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.numero} - {t.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="todos">Status: Todos</option>
              <option value="pendentes">Status: Pendentes</option>
              <option value="visitados">Status: Visitados</option>
            </select>
          </div>

          {/* Confirmation filter */}
          <div>
            <select
              value={confirmFilter}
              onChange={(e) => setConfirmFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="todos">Confirmação: Todos</option>
              <option value="confirmados">Apenas Confirmados</option>
              <option value="nao_confirmados">Não Confirmados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Addresses Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {t('end.nenhum', 'Nenhum endereço cadastrado.')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Endereço</th>
                  <th className="py-3 px-4">Bairro / Cidade</th>
                  <th className="py-3 px-4">Território</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Confirmação</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((end) => {
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${end.latitude},${end.longitude}`;

                  return (
                    <tr key={end.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {end.rua}, {end.numero}
                        </div>
                        {end.complemento && (
                          <div className="text-[11px] text-slate-400">{end.complemento}</div>
                        )}
                        {end.observacoes && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                            {end.observacoes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {end.bairro} · {end.cidade}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedTerritorioId(end.territorio_id);
                            setActiveTab('territorios');
                          }}
                          className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{end.territorio_nome}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            end.status === 'visitado'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {end.status === 'visitado' ? 'Visitado' : 'Pendente'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleConfirmEndereco(end.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                            end.endereco_confirmado
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Clique para alternar confirmação"
                        >
                          {end.endereco_confirmado ? '★ Confirmado' : 'Não conf.'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Navegar no Google Maps"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setVisitaModalEndereco(end)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors"
                          >
                            Visitar
                          </button>
                          {currentUser.role === 'ADM' && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingEndereco(end);
                                  setIsEnderecoModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingEndereco(end)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Endereco */}
      <EnderecoModal
        initialEndereco={editingEndereco}
        isOpen={isEnderecoModalOpen}
        onClose={() => {
          setIsEnderecoModalOpen(false);
          setEditingEndereco(null);
        }}
      />

      {/* Modal: Registrar Visita */}
      {visitaModalEndereco && (
        <RegistrarVisitaModal
          endereco={visitaModalEndereco}
          isOpen={!!visitaModalEndereco}
          onClose={() => setVisitaModalEndereco(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      {deletingEndereco && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Excluir Endereço</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Deseja realmente remover o endereço {deletingEndereco.rua}, {deletingEndereco.numero}?
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingEndereco(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  deleteEndereco(deletingEndereco.id);
                  setDeletingEndereco(null);
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
