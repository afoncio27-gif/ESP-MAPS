import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { X, Layers, AlertTriangle } from 'lucide-react';

interface DesignarLoteModalProps {
  selectedTerritorioIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DesignarLoteModal: React.FC<DesignarLoteModalProps> = ({
  selectedTerritorioIds,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { territorios, users, batchAssignTerritorios, currentUser } = useApp();
  const { t } = useI18n();

  const [targetType, setTargetType] = useState<'dirigente' | 'publicador'>('publicador');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [observacoes, setObservacoes] = useState('');

  if (!isOpen) return null;

  const selectedTerritorios = territorios.filter((t) =>
    selectedTerritorioIds.includes(t.id)
  );

  const alreadyAssigned = selectedTerritorios.filter(
    (t) => t.status !== 'disponivel' && t.status !== 'concluido'
  );

  const eligibleUsers = users.filter((u) => {
    if (u.status !== 'aprovado') return false;
    if (targetType === 'dirigente') return u.role === 'DIRIGENTE' || u.role === 'ADM';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    batchAssignTerritorios(selectedTerritorioIds, selectedUserId, targetType, observacoes);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('lote.titulo', 'Designar Territórios em Lote')}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedTerritorioIds.length} {t('lote.territorio_s', 'território(s)')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {alreadyAssigned.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">Aviso: </span>
                {alreadyAssigned.length} {t('lote.ja_designados', 'Territórios já designados serão atualizados com o novo responsável.')}
              </div>
            </div>
          )}

          {/* List of selected territories pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('lote.selecionados', 'Territórios selecionados')}:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {selectedTerritorios.map((t) => (
                <span
                  key={t.id}
                  className="px-2 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  {t.numero} - {t.nome}
                </span>
              ))}
            </div>
          </div>

          {/* Target Type */}
          {currentUser.role === 'ADM' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('designar.designar_para', 'Designar para')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('publicador');
                    setSelectedUserId('');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    targetType === 'publicador'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {t('designar.publicador', 'Publicador')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('dirigente');
                    setSelectedUserId('');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    targetType === 'dirigente'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {t('designar.dirigente', 'Dirigente')}
                </button>
              </div>
            </div>
          )}

          {/* User selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('designar.selecionar', 'Selecionar')} {targetType === 'dirigente' ? 'Dirigente' : 'Publicador'}
            </label>
            <select
              required
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Selecione um usuário...</option>
              {eligibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('designar.obs_opcional', 'Observações (opcional)')}
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Instruções para o lote..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {t('common.cancelar', 'Cancelar')}
            </button>
            <button
              type="submit"
              disabled={!selectedUserId}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-xs transition-colors"
            >
              {t('lote.designar', 'Designar')} {selectedTerritorioIds.length} {t('lote.territorio_s', 'território(s)')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
