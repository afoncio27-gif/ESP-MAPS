import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { EnderecoCenso } from '../../types';
import {
  FileCheck,
  Search,
  Plus,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit2,
  Trash2,
  Check,
} from 'lucide-react';
import { CensoModal } from '../modals/CensoModal';

export const CensoView: React.FC = () => {
  const {
    enderecosCenso,
    territorios,
    integrateCensoToTerritorio,
    updateEnderecoCenso,
    deleteEnderecoCenso,
    currentUser,
  } = useApp();
  const { t, locale } = useI18n();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'integrado'>('todos');

  // Modals
  const [isCensoModalOpen, setIsCensoModalOpen] = useState(false);
  const [editingCenso, setEditingCenso] = useState<EnderecoCenso | null>(null);
  const [integratingCenso, setIntegratingCenso] = useState<EnderecoCenso | null>(null);
  const [selectedTerritorioId, setSelectedTerritorioId] = useState('');

  const filtered = enderecosCenso.filter((c) => {
    const matchSearch =
      c.rua.toLowerCase().includes(search.toLowerCase()) ||
      c.numero.toLowerCase().includes(search.toLowerCase()) ||
      c.bairro.toLowerCase().includes(search.toLowerCase()) ||
      (c.cadastrado_por && c.cadastrado_por.toLowerCase().includes(search.toLowerCase())) ||
      (c.observacoes && c.observacoes.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'todos' ? true : c.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleIntegrate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!integratingCenso || !selectedTerritorioId) return;

    integrateCensoToTerritorio(integratingCenso.id, selectedTerritorioId);
    setIntegratingCenso(null);
    setSelectedTerritorioId('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {t('nav.censo', 'Censo de Endereços')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de novos endereços hispanos encontrados no campo para triagem e integração
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCenso(null);
            setIsCensoModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar no Censo</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por rua, bairro, cadastrado por..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendentes de Integração</option>
              <option value="integrado">Já Integrados aos Mapas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Censo Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Nenhum endereço encontrado no censo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Endereço</th>
                  <th className="py-3 px-4">Bairro / Cidade</th>
                  <th className="py-3 px-4">Cadastrado Por</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {c.rua}, {c.numero}
                      </div>
                      {c.complemento && (
                        <div className="text-[11px] text-slate-400">{c.complemento}</div>
                      )}
                      {c.observacoes && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                          {c.observacoes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {c.bairro} · {c.cidade}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {c.cadastrado_por || 'Publicador'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'integrado'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status === 'integrado' ? 'Integrado ao Mapa' : 'Pendente de Triagem'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(c.data_cadastro).toLocaleDateString(
                        locale === 'es' ? 'es-ES' : 'pt-BR'
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.status === 'pendente' &&
                          (currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
                            <button
                              onClick={() => {
                                setIntegratingCenso(c);
                                setSelectedTerritorioId(territorios[0]?.id || '');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Integrar ao Mapa</span>
                            </button>
                          )}

                        <button
                          onClick={() => {
                            setEditingCenso(c);
                            setIsCensoModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {currentUser.role === 'ADM' && (
                          <button
                            onClick={() => deleteEnderecoCenso(c.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Censo */}
      <CensoModal
        initialCenso={editingCenso}
        isOpen={isCensoModalOpen}
        onClose={() => {
          setIsCensoModalOpen(false);
          setEditingCenso(null);
        }}
      />

      {/* Modal: Integrar ao Território */}
      {integratingCenso && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-5 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Integrar Endereço ao Mapa
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Vincular {integratingCenso.rua}, {integratingCenso.numero} ({integratingCenso.bairro}) a um território existente.
            </p>

            <form onSubmit={handleIntegrate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selecione o Território de Destino:
                </label>
                <select
                  required
                  value={selectedTerritorioId}
                  onChange={(e) => setSelectedTerritorioId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {territorios.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.numero} - {t.nome} ({t.bairro})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIntegratingCenso(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  {t('common.cancelar', 'Cancelar')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Confirmar Integração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
