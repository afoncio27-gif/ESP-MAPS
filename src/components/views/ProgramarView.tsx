import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { CalendarClock, Check, MapPin, Sparkles, Send } from 'lucide-react';

export const ProgramarView: React.FC = () => {
  const { territorios, users, batchAssignTerritorios } = useApp();
  const { t } = useI18n();

  const dirigentes = users.filter((u) => u.role === 'DIRIGENTE' || u.role === 'ADM');
  const [selectedDirigenteId, setSelectedDirigenteId] = useState(dirigentes[0]?.id || '');
  const [selectedTerritorioIds, setSelectedTerritorioIds] = useState<string[]>([]);
  const [dataProgramada, setDataProgramada] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [successMessage, setSuccessMessage] = useState('');

  const disponiveis = territorios.filter((t) => t.status === 'disponivel' || t.status === 'concluido');

  const toggleTerritorio = (id: string) => {
    setSelectedTerritorioIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleProgramar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDirigenteId || selectedTerritorioIds.length === 0) return;

    const dirigente = users.find((u) => u.id === selectedDirigenteId);

    batchAssignTerritorios(
      selectedTerritorioIds,
      selectedDirigenteId,
      'dirigente',
      `Liberação programada para ${dataProgramada}`
    );

    setSuccessMessage(
      `Sucesso! ${selectedTerritorioIds.length} território(s) designados para o dirigente ${dirigente?.nome}.`
    );
    setSelectedTerritorioIds([]);
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-indigo-600" />
          <span>{t('nav.programar', 'Programar Liberação de Mapas')}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Agende e distribua blocos de mapas com antecedência para os dirigentes das saídas de campo
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleProgramar} className="space-y-5">
        {/* Dirigente e Data */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            1. Selecione o Dirigente e a Data da Saída
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dirigente Responsável
              </label>
              <select
                required
                value={selectedDirigenteId}
                onChange={(e) => setSelectedDirigenteId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {dirigentes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome} ({d.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data do Trabalho
              </label>
              <input
                type="date"
                required
                value={dataProgramada}
                onChange={(e) => setDataProgramada(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Territórios Disponíveis */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              2. Selecione os Territórios para a Liberação ({selectedTerritorioIds.length} selecionados)
            </h3>
            {disponiveis.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (selectedTerritorioIds.length === disponiveis.length) {
                    setSelectedTerritorioIds([]);
                  } else {
                    setSelectedTerritorioIds(disponiveis.map((t) => t.id));
                  }
                }}
                className="text-xs text-indigo-600 hover:underline font-bold"
              >
                {selectedTerritorioIds.length === disponiveis.length
                  ? 'Desmarcar todos'
                  : 'Selecionar todos disponíveis'}
              </button>
            )}
          </div>

          {disponiveis.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              Nenhum território livre no momento. Conclua ou revogue territórios ativos.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-1">
              {disponiveis.map((terr) => {
                const isChecked = selectedTerritorioIds.includes(terr.id);
                return (
                  <div
                    key={terr.id}
                    onClick={() => toggleTerritorio(terr.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-slate-900">
                        {terr.numero} - {terr.nome}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {terr.bairro} · {terr.total_enderecos} endereços
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={selectedTerritorioIds.length === 0}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Liberar e Notificar Dirigente</span>
          </button>
        </div>
      </form>
    </div>
  );
};
