import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Endereco, VisitaResultado } from '../../types';
import { X, Check, AlertCircle } from 'lucide-react';

interface RegistrarVisitaModalProps {
  endereco: Endereco;
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrarVisitaModal: React.FC<RegistrarVisitaModalProps> = ({
  endereco,
  isOpen,
  onClose,
}) => {
  const { addVisita, currentUser, campanhas } = useApp();
  const { t } = useI18n();

  const [resultado, setResultado] = useState<VisitaResultado>('visitado');
  const [estrangeiro, setEstrangeiro] = useState(true);
  const [moradores, setMoradores] = useState<number>(endereco.moradores || 1);
  const [convidadoCampanha, setConvidadoCampanha] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  const activeCampanha = campanhas.find((c) => c.ativa);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVisita({
      endereco_id: endereco.id,
      endereco_rua: endereco.rua,
      endereco_numero: endereco.numero,
      endereco_bairro: endereco.bairro,
      territorio_id: endereco.territorio_id,
      territorio_nome: endereco.territorio_nome,
      publicador_id: currentUser.id,
      publicador_nome: currentUser.nome,
      resultado,
      estrangeiro,
      moradores: Number(moradores) || 0,
      convidado_campanha: convidadoCampanha,
      campanha_id: activeCampanha?.id,
      observacoes: observacoes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('visita.titulo', 'Registrar Visita')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {endereco.rua}, {endereco.numero} {endereco.complemento || ''}
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
          {/* Resultado */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('common.resultado', 'Resultado')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 'visitado', label: 'Visitado', color: 'border-emerald-300 bg-emerald-50/40 text-emerald-900' },
                { val: 'revisita', label: 'Revisita', color: 'border-indigo-300 bg-indigo-50/40 text-indigo-900' },
                { val: 'estudo_biblico', label: 'Estudo bíblico', color: 'border-purple-300 bg-purple-50/40 text-purple-900' },
                { val: 'morador_ausente', label: 'Morador ausente', color: 'border-slate-300 bg-slate-50/40 text-slate-800' },
                { val: 'mudou_se', label: 'Mudou-se', color: 'border-rose-300 bg-rose-50/40 text-rose-900' },
                { val: 'nao_visitar', label: 'Não visitar', color: 'border-red-300 bg-red-50/40 text-red-900' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setResultado(opt.val as VisitaResultado)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${
                    resultado === opt.val
                      ? `${opt.color} ring-2 ring-indigo-500 ring-offset-1 font-bold`
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  {resultado === opt.val && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Estrangeiro checkbox */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={estrangeiro}
                onChange={(e) => setEstrangeiro(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Falou com estrangeiro / morador hispano
                </span>
                <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
                  {t('visita.encontrado_aviso', 'Essa opção só deve ser marcada caso tenha falado com algum estrangeiro no endereço.')}
                </span>
              </div>
            </label>
          </div>

          {/* Número de moradores */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('visita.numero_moradores', 'Número de moradores')}
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={moradores}
              onChange={(e) => setMoradores(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Campanha Ativa */}
          {activeCampanha && (
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={convidadoCampanha}
                  onChange={(e) => setConvidadoCampanha(e.target.checked)}
                  className="mt-0.5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">
                    {t('visita.pessoa_convidada', 'Pessoa convidada para a campanha')}
                  </span>
                  <span className="text-[11px] text-indigo-700 font-medium block mt-0.5">
                    {activeCampanha.nome}
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('common.observacoes', 'Observações')}
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex.: Morador receptivo, aceitou tratado em espanhol, sugeriu voltar no sábado à tarde..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Footer buttons */}
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
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              {t('common.registrar', 'Registrar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
