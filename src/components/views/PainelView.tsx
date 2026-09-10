import React from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import {
  MapPin,
  CheckCircle2,
  Clock,
  Home,
  Users,
  TrendingUp,
  Calendar,
  Compass,
  ArrowRight,
  BookOpen,
  RotateCcw,
  UserX,
} from 'lucide-react';
import { TerritorioStatus, VisitaResultado } from '../../types';

export const PainelView: React.FC = () => {
  const {
    territorios,
    enderecos,
    visitas,
    users,
    setActiveTab,
    setSelectedTerritorioId,
    currentUser,
  } = useApp();
  const { t, locale } = useI18n();

  // Address progress calculations
  const totalEnderecos = enderecos.filter((e) => e.ativo).length;
  const visitadosEnderecos = enderecos.filter((e) => e.ativo && e.status === 'visitado').length;
  const pendentesEnderecos = totalEnderecos - visitadosEnderecos;
  const progressoGlobal = totalEnderecos > 0 ? Math.round((visitadosEnderecos / totalEnderecos) * 100) : 0;

  // Territories by status
  const statusCounts: Record<TerritorioStatus, number> = {
    disponivel: territorios.filter((t) => t.status === 'disponivel').length,
    designado_dirigente: territorios.filter((t) => t.status === 'designado_dirigente').length,
    designado_publicador: territorios.filter((t) => t.status === 'designado_publicador').length,
    em_campo: territorios.filter((t) => t.status === 'em_campo').length,
    concluido: territorios.filter((t) => t.status === 'concluido').length,
  };

  // Visits outcomes
  const visitResults: Record<VisitaResultado, number> = {
    visitado: visitas.filter((v) => v.resultado === 'visitado').length,
    revisita: visitas.filter((v) => v.resultado === 'revisita').length,
    estudo_biblico: visitas.filter((v) => v.resultado === 'estudo_biblico').length,
    morador_ausente: visitas.filter((v) => v.resultado === 'morador_ausente').length,
    mudou_se: visitas.filter((v) => v.resultado === 'mudou_se').length,
    nao_visitar: visitas.filter((v) => v.resultado === 'nao_visitar').length,
  };

  const handleOpenTerritorio = (id: string) => {
    setSelectedTerritorioId(id);
    setActiveTab('territorios');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {t('painel.titulo', 'Painel Administrativo')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'painel.subtitulo',
              'Status dos territórios e progresso das visitas em tempo real'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mapa-geral')}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>{t('nav.mapa_geral', 'Mapa Geral')}</span>
          </button>
          <button
            onClick={() => setActiveTab('territorios')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>{t('dash.ver_todos', 'Ver todos os territórios')}</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Endereços */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('painel.total_enderecos', 'Total de Endereços')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalEnderecos}</span>
            <span className="text-xs text-slate-400 font-semibold">cadastrados</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>{enderecos.filter((e) => e.endereco_confirmado).length} confirmados</span>
          </div>
        </div>

        {/* Card 2: Visitados */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('painel.visitados', 'Visitados')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{visitadosEnderecos}</span>
            <span className="text-xs text-emerald-600 font-bold">{progressoGlobal}%</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressoGlobal}%` }}
            />
          </div>
        </div>

        {/* Card 3: Pendentes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('painel.pendentes', 'Pendentes')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{pendentesEnderecos}</span>
            <span className="text-xs text-amber-600 font-bold">
              {100 - progressoGlobal}% restantes
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-medium">
            Aguardando visita de campo
          </div>
        </div>

        {/* Card 4: Territórios em Campo */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('lbl.territorios', 'Territórios')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{territorios.length}</span>
            <span className="text-xs text-blue-600 font-bold">
              {statusCounts.em_campo + statusCounts.designado_publicador} ativos
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            {statusCounts.disponivel} disponíveis p/ designar
          </div>
        </div>
      </div>

      {/* Detailed Status & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Territórios por Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>{t('painel.status_territorios', 'Status dos Territórios')}</span>
            <span className="text-xs text-slate-400 font-normal">{territorios.length} total</span>
          </h3>

          <div className="space-y-3">
            {[
              {
                label: 'Disponível',
                count: statusCounts.disponivel,
                color: 'bg-emerald-500',
                bg: 'bg-emerald-50 text-emerald-800',
              },
              {
                label: 'Designado p/ Dirigente',
                count: statusCounts.designado_dirigente,
                color: 'bg-indigo-500',
                bg: 'bg-indigo-50 text-indigo-800',
              },
              {
                label: 'Designado p/ Publicador',
                count: statusCounts.designado_publicador,
                color: 'bg-blue-500',
                bg: 'bg-blue-50 text-blue-800',
              },
              {
                label: 'Em campo',
                count: statusCounts.em_campo,
                color: 'bg-purple-500',
                bg: 'bg-purple-50 text-purple-800',
              },
              {
                label: 'Concluído',
                count: statusCounts.concluido,
                color: 'bg-slate-400',
                bg: 'bg-slate-100 text-slate-700',
              },
            ].map((st) => (
              <div key={st.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                  <span className="font-semibold text-slate-700">{st.label}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${st.bg}`}>
                  {st.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resultados das Visitas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>{t('painel.resultados_visitas', 'Resultados das Visitas')}</span>
            <span className="text-xs text-slate-400 font-normal">{visitas.length} registradas</span>
          </h3>

          <div className="space-y-2.5">
            {[
              { label: 'Visitado', count: visitResults.visitado, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Revisita', count: visitResults.revisita, icon: RotateCcw, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Estudo bíblico', count: visitResults.estudo_biblico, icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
              { label: 'Morador ausente', count: visitResults.morador_ausente, icon: UserX, color: 'text-slate-600 bg-slate-100' },
              { label: 'Mudou-se', count: visitResults.mudou_se, icon: TrendingUp, color: 'text-rose-600 bg-rose-50' },
            ].map((res) => {
              const Icon = res.icon;
              return (
                <div key={res.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${res.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-700">{res.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md">
                    {res.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Territórios Recentes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">
              {t('dash.territorios_recentes', 'Territórios recentes')}
            </h3>
            <button
              onClick={() => setActiveTab('territorios')}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              {t('dash.ver_todos', 'Ver todos')} →
            </button>
          </div>

          <div className="space-y-2">
            {territorios.slice(0, 4).map((tItem) => {
              const perc = tItem.total_enderecos > 0
                ? Math.round((tItem.total_visitados / tItem.total_enderecos) * 100)
                : 0;

              return (
                <div
                  key={tItem.id}
                  onClick={() => handleOpenTerritorio(tItem.id)}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900">
                        {tItem.numero} - {tItem.nome}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {tItem.bairro} · {tItem.publicador_nome || tItem.dirigente_nome || 'Disponível'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-indigo-600">{perc}%</span>
                    <div className="text-[10px] text-slate-400">
                      {tItem.total_visitados}/{tItem.total_enderecos}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Atividade Recente (Visitas registradas recentemente) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('painel.atividade_recente', 'Atividade Recente')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Últimas visitas registradas em campo pelos publicadores
            </p>
          </div>
          <button
            onClick={() => setActiveTab('visitas')}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            {t('nav.visitas', 'Visitas')} →
          </button>
        </div>

        {visitas.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            {t('dash.sem_visitas_msg', 'Nenhuma visita registrada ainda.')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Endereço</th>
                  <th className="py-2.5 px-3">Território</th>
                  <th className="py-2.5 px-3">Publicador</th>
                  <th className="py-2.5 px-3">Resultado</th>
                  <th className="py-2.5 px-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {visitas.slice(0, 5).map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {v.endereco_rua}, {v.endereco_numero}
                    </td>
                    <td className="py-2.5 px-3">{v.territorio_nome}</td>
                    <td className="py-2.5 px-3">{v.publicador_nome}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 capitalize">
                        {v.resultado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(v.data).toLocaleDateString(locale === 'es' ? 'es-ES' : 'pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
