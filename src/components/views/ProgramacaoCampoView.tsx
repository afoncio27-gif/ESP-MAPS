import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { ProgramacaoCampo } from '../../types';
import { CalendarDays, Plus, Clock, MapPin, Trash2, X, Navigation } from 'lucide-react';

export const ProgramacaoCampoView: React.FC = () => {
  const {
    programacaoCampo,
    addProgramacaoCampo,
    deleteProgramacaoCampo,
    currentUser,
  } = useApp();
  const { t } = useI18n();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaSemana, setDiaSemana] = useState('Sábado');
  const [horario, setHorario] = useState('09:00');
  const [pontoEncontro, setPontoEncontro] = useState('');
  const [modalidade, setModalidade] = useState('Presencial');
  const [observacoes, setObservacoes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProgramacaoCampo({
      dia_semana: diaSemana,
      horario,
      ponto_encontro: pontoEncontro.trim(),
      modalidade,
      observacoes: observacoes.trim(),
      ativo: true,
    });
    setIsModalOpen(false);
    setPontoEncontro('');
    setObservacoes('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {t('nav.programacao_campo', 'Programação de Campo')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dias, horários e pontos de encontro para as saídas de campo no grupo hispano
          </p>
        </div>

        {(currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Saída de Campo</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programacaoCampo.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                    {p.dia_semana}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{p.horario}</span>
                  </h3>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {p.modalidade}
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{p.ponto_encontro}</span>
              </div>

              {p.observacoes && (
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed italic">
                  {p.observacoes}
                </p>
              )}
            </div>

            {currentUser.role === 'ADM' && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => deleteProgramacaoCampo(p.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Nova Programação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Nova Saída de Campo
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dia da Semana
                  </label>
                  <select
                    value={diaSemana}
                    onChange={(e) => setDiaSemana(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].map(
                      (d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ponto de Encontro
                </label>
                <input
                  type="text"
                  required
                  value={pontoEncontro}
                  onChange={(e) => setPontoEncontro(e.target.value)}
                  placeholder="Ex: Praça da Sé (em frente à estátua)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Modalidade
                </label>
                <input
                  type="text"
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                  placeholder="Presencial, Carrinhos, Telefone..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observações
                </label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Levar tratados em espanhol, etc."
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
                  Salvar Programação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
