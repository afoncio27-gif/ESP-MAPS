import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Territorio, User } from '../../types';
import { X, Check, ShieldAlert } from 'lucide-react';

interface DesignarModalProps {
  territorio: Territorio;
  isOpen: boolean;
  onClose: () => void;
}

export const DesignarModal: React.FC<DesignarModalProps> = ({
  territorio,
  isOpen,
  onClose,
}) => {
  const { users, currentUser, assignTerritorio } = useApp();
  const { t } = useI18n();

  // If user is ADM, can choose whether to assign to Dirigente or Publicador
  // If user is Dirigente, assigns to Publicador
  const [targetType, setTargetType] = useState<'dirigente' | 'publicador'>(
    currentUser.role === 'DIRIGENTE' ? 'publicador' : 'publicador'
  );
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [observacoes, setObservacoes] = useState('');

  if (!isOpen) return null;

  const eligibleUsers = users.filter((u) => {
    if (u.status !== 'aprovado') return false;
    if (targetType === 'dirigente') {
      return u.role === 'DIRIGENTE' || u.role === 'ADM';
    } else {
      return true; // Any publisher or conductor can receive personal assignment
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    assignTerritorio(territorio.id, selectedUserId, targetType, observacoes.trim());
    onClose();
  };

  const hasUnvisited = territorio.total_visitados < territorio.total_enderecos;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('designar.titulo', 'Designar Território')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {territorio.nome} ({territorio.bairro})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {hasUnvisited && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                {t(
                  'designar.aviso_enderecos',
                  'Atenção: alguns endereços deste território ainda não foram visitados.'
                )}
              </p>
            </div>
          )}

          {/* Type of recipient (Dirigente vs Publicador) for ADM */}
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Selecione um usuário...</option>
              {eligibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} ({u.role})
                </option>
              ))}
            </select>
            {eligibleUsers.length === 0 && (
              <p className="text-xs text-rose-500 mt-1">
                {t('designar.nenhum', 'Nenhum disponível.')}
              </p>
            )}
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
              placeholder="Instruções para o trabalho neste território..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Buttons */}
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
              {t('designar.confirmar', 'Confirmar Designação')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
