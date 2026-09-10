import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { History, Search, Trash2, CheckCircle2, RotateCcw, BookOpen, UserX, AlertTriangle } from 'lucide-react';

export const VisitasView: React.FC = () => {
  const { visitas, deleteVisita, clearAllVisitas, currentUser } = useApp();
  const { t, locale } = useI18n();

  const [search, setSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('todos');
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const filtered = visitas.filter((v) => {
    const matchSearch =
      v.endereco_rua.toLowerCase().includes(search.toLowerCase()) ||
      v.endereco_numero.toLowerCase().includes(search.toLowerCase()) ||
      v.territorio_nome.toLowerCase().includes(search.toLowerCase()) ||
      v.publicador_nome.toLowerCase().includes(search.toLowerCase()) ||
      (v.observacoes && v.observacoes.toLowerCase().includes(search.toLowerCase()));

    const matchOutcome = outcomeFilter === 'todos' ? true : v.resultado === outcomeFilter;

    return matchSearch && matchOutcome;
  });

  const getOutcomeBadge = (res: string) => {
    switch (res) {
      case 'visitado':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'revisita':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'estudo_biblico':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'morador_ausente':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'mudou_se':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'nao_visitar':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {t('nav.visitas', 'Histórico de Visitas')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de todas as visitas realizadas em campo pelos publicadores
          </p>
        </div>

        {currentUser.role === 'ADM' && visitas.length > 0 && (
          <button
            onClick={() => setIsConfirmClearOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Histórico</span>
          </button>
        )}
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
              placeholder="Buscar por endereço, publicador, território..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="todos">Todos os resultados</option>
              <option value="visitado">Visitado</option>
              <option value="revisita">Revisita</option>
              <option value="estudo_biblico">Estudo bíblico</option>
              <option value="morador_ausente">Morador ausente</option>
              <option value="mudou_se">Mudou-se</option>
              <option value="nao_visitar">Não visitar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Nenhuma visita encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Endereço</th>
                  <th className="py-3 px-4">Território</th>
                  <th className="py-3 px-4">Publicador</th>
                  <th className="py-3 px-4">Resultado</th>
                  <th className="py-3 px-4">Detalhes</th>
                  <th className="py-3 px-4">Data</th>
                  {currentUser.role === 'ADM' && <th className="py-3 px-4 text-right">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {v.endereco_rua}, {v.endereco_numero}
                      </div>
                      <div className="text-[11px] text-slate-400">{v.endereco_bairro}</div>
                      {v.observacoes && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5 max-w-xs">
                          {v.observacoes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {v.territorio_nome}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {v.publicador_nome}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getOutcomeBadge(
                          v.resultado
                        )}`}
                      >
                        {v.resultado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] space-y-0.5">
                      {v.estrangeiro && (
                        <div className="text-indigo-600 font-semibold">✓ Morador Hispano</div>
                      )}
                      {v.moradores !== undefined && v.moradores > 0 && (
                        <div>{v.moradores} morador(es)</div>
                      )}
                      {v.convidado_campanha && (
                        <div className="text-purple-600 font-medium">★ Convidado Campanha</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(v.data).toLocaleDateString(locale === 'es' ? 'es-ES' : 'pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    {currentUser.role === 'ADM' && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteVisita(v.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Excluir visita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Clear All Visits */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Limpar todo o Histórico</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Deseja realmente apagar todas as visitas registradas? Essa ação reiniciará os status dos endereços.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  clearAllVisitas();
                  setIsConfirmClearOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
