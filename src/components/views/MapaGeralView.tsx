import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Endereco } from '../../types';
import { LeafletMap } from '../map/LeafletMap';
import { RegistrarVisitaModal } from '../modals/RegistrarVisitaModal';
import { Map, Layers, Compass, Filter } from 'lucide-react';

export const MapaGeralView: React.FC = () => {
  const { enderecos, territorios } = useApp();
  const { t } = useI18n();

  const [territorioFilter, setTerritorioFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendentes' | 'visitados'>('todos');
  const [visitaModalEndereco, setVisitaModalEndereco] = useState<Endereco | null>(null);

  const activeEnderecos = enderecos.filter((e) => e.ativo);

  const filteredEnderecos = activeEnderecos.filter((e) => {
    const matchTerr = !territorioFilter || e.territorio_id === territorioFilter;
    const matchStatus =
      statusFilter === 'todos' ? true : e.status === (statusFilter === 'visitados' ? 'visitado' : 'pendente');
    return matchTerr && matchStatus;
  });

  const total = activeEnderecos.length;
  const visitados = activeEnderecos.filter((e) => e.status === 'visitado').length;
  const progresso = total > 0 ? Math.round((visitados / total) * 100) : 0;

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Map className="w-6 h-6 text-indigo-600" />
            <span>{t('nav.mapa_geral', 'Mapa Geral da Congregação')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualização de todos os pontos e endereços em mapa geográfico
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700">
            {visitados}/{total} visitados ({progresso}%)
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Territory filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={territorioFilter}
              onChange={(e) => setTerritorioFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos os territórios ({territorios.length})</option>
              {territorios.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.numero} - {t.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'todos' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Todos ({filteredEnderecos.length})
            </button>
            <button
              onClick={() => setStatusFilter('pendentes')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'pendentes' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setStatusFilter('visitados')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'visitados' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Visitados
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Confirmado / Visitado</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>Revisita</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>Estudo Bíblico</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Ausente</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Pendente</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs">
        <LeafletMap
          enderecos={filteredEnderecos}
          zoom={14}
          onRegistrarVisita={(end) => setVisitaModalEndereco(end)}
          height="620px"
        />
      </div>

      {/* Modal: Registrar Visita */}
      {visitaModalEndereco && (
        <RegistrarVisitaModal
          endereco={visitaModalEndereco}
          isOpen={!!visitaModalEndereco}
          onClose={() => setVisitaModalEndereco(null)}
        />
      )}
    </div>
  );
};
