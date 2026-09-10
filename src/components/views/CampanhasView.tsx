import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Campanha } from '../../types';
import { Megaphone, Plus, Calendar, Check, X, Edit2, Trash2 } from 'lucide-react';

export const CampanhasView: React.FC = () => {
  const { campanhas, addCampanha, updateCampanha, deleteCampanha, currentUser, visitas } = useApp();
  const { t, locale } = useI18n();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampanha, setEditingCampanha] = useState<Campanha | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampanha) {
      updateCampanha(editingCampanha.id, {
        nome: nome.trim(),
        descricao: descricao.trim(),
        data_inicio: dataInicio,
        data_fim: dataFim,
      });
    } else {
      addCampanha({
        nome: nome.trim(),
        descricao: descricao.trim(),
        data_inicio: dataInicio,
        data_fim: dataFim,
        ativa: true,
      });
    }
    setIsModalOpen(false);
    setEditingCampanha(null);
  };

  const handleToggleAtiva = (campanha: Campanha) => {
    updateCampanha(campanha.id, { ativa: !campanha.ativa });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-indigo-600" />
            <span>{t('nav.campanhas', 'Campanhas Especiais')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie campanhas de distribuição de convites (Memorial, Congressos) e relatórios de convidados
          </p>
        </div>

        {currentUser.role === 'ADM' && (
          <button
            onClick={() => {
              setEditingCampanha(null);
              setNome('');
              setDescricao('');
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Campanha</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campanhas.map((camp) => {
          const convidadosCount = visitas.filter((v) => v.campanha_id === camp.id).length;

          return (
            <div
              key={camp.id}
              className={`bg-white rounded-2xl p-5 border shadow-2xs transition-all flex flex-col justify-between ${
                camp.ativa ? 'border-indigo-600 ring-2 ring-indigo-500/15' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{camp.nome}</h3>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(camp.data_inicio).toLocaleDateString(
                          locale === 'es' ? 'es-ES' : 'pt-BR'
                        )}{' '}
                        até{' '}
                        {new Date(camp.data_fim).toLocaleDateString(
                          locale === 'es' ? 'es-ES' : 'pt-BR'
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      camp.ativa
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {camp.ativa ? 'Ativa' : 'Encerrada'}
                  </span>
                </div>

                {camp.descricao && (
                  <p className="text-xs text-slate-600 mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed">
                    {camp.descricao}
                  </p>
                )}

                <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-900">
                    Pessoas convidadas nesta campanha:
                  </span>
                  <span className="text-base font-black text-indigo-700">
                    {convidadosCount}
                  </span>
                </div>
              </div>

              {currentUser.role === 'ADM' && (
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleAtiva(camp)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                      camp.ativa
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent shadow-xs'
                    }`}
                  >
                    {camp.ativa ? 'Desativar Campanha' : 'Ativar Campanha'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCampanha(camp);
                        setNome(camp.nome);
                        setDescricao(camp.descricao || '');
                        setDataInicio(camp.data_inicio);
                        setDataFim(camp.data_fim);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCampanha(camp.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Nova/Editar Campanha */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingCampanha ? 'Editar Campanha' : 'Nova Campanha Especial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome da Campanha
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Campanha do Memorial 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Data Início
                  </label>
                  <input
                    type="date"
                    required
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    required
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição / Instruções
                </label>
                <textarea
                  rows={2}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Instruções para distribuição de convites..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  {t('common.cancelar', 'Cancelar')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
