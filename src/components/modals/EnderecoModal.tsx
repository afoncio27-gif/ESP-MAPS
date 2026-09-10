import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Endereco, Territorio } from '../../types';
import { X } from 'lucide-react';

interface EnderecoModalProps {
  territorioId?: string;
  initialEndereco?: Endereco | null;
  initialCoords?: { lat: number; lng: number } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EnderecoModal: React.FC<EnderecoModalProps> = ({
  territorioId,
  initialEndereco,
  initialCoords,
  isOpen,
  onClose,
}) => {
  const { territorios, addEndereco, updateEndereco } = useApp();
  const { t } = useI18n();

  const [tId, setTId] = useState<string>(territorioId || '');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('São Paulo');
  const [latitude, setLatitude] = useState<number>(-23.5505);
  const [longitude, setLongitude] = useState<number>(-46.6333);
  const [observacoes, setObservacoes] = useState('');
  const [enderecoConfirmado, setEnderecoConfirmado] = useState(true);

  useEffect(() => {
    if (initialEndereco) {
      setTId(initialEndereco.territorio_id);
      setRua(initialEndereco.rua);
      setNumero(initialEndereco.numero);
      setComplemento(initialEndereco.complemento || '');
      setBairro(initialEndereco.bairro);
      setCidade(initialEndereco.cidade);
      setLatitude(initialEndereco.latitude);
      setLongitude(initialEndereco.longitude);
      setObservacoes(initialEndereco.observacoes || '');
      setEnderecoConfirmado(initialEndereco.endereco_confirmado);
    } else {
      const selectedT = territorios.find((t) => t.id === territorioId);
      setTId(territorioId || (territorios[0]?.id ?? ''));
      setRua('');
      setNumero('');
      setComplemento('');
      setBairro(selectedT?.bairro || '');
      setCidade(selectedT?.cidade || 'São Paulo');
      setLatitude(initialCoords?.lat || selectedT?.latitude || -23.5505);
      setLongitude(initialCoords?.lng || selectedT?.longitude || -46.6333);
      setObservacoes('');
      setEnderecoConfirmado(true);
    }
  }, [initialEndereco, initialCoords, territorioId, territorios]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTerritorio = territorios.find((t) => t.id === tId);
    const terrNome = currentTerritorio?.nome || '';

    if (initialEndereco) {
      updateEndereco(initialEndereco.id, {
        territorio_id: tId,
        territorio_nome: terrNome,
        rua: rua.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        bairro: bairro.trim() || currentTerritorio?.bairro || '',
        cidade: cidade.trim() || currentTerritorio?.cidade || '',
        latitude: Number(latitude),
        longitude: Number(longitude),
        observacoes: observacoes.trim(),
        endereco_confirmado: enderecoConfirmado,
      });
    } else {
      addEndereco({
        territorio_id: tId,
        territorio_nome: terrNome,
        rua: rua.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        bairro: bairro.trim() || currentTerritorio?.bairro || 'Centro',
        cidade: cidade.trim() || currentTerritorio?.cidade || 'São Paulo',
        latitude: Number(latitude),
        longitude: Number(longitude),
        status: 'pendente',
        endereco_confirmado: enderecoConfirmado,
        observacoes: observacoes.trim(),
        ativo: true,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialEndereco
                ? t('endf.editar', 'Editar Endereço')
                : t('endf.novo', 'Novo Endereço')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {/* Território Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('common.territorio', 'Território')}
            </label>
            <select
              required
              value={tId}
              onChange={(e) => {
                setTId(e.target.value);
                const selected = territorios.find((t) => t.id === e.target.value);
                if (selected) {
                  if (!bairro) setBairro(selected.bairro);
                  if (!latitude) setLatitude(selected.latitude);
                  if (!longitude) setLongitude(selected.longitude);
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {territorios.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.numero} - {t.nome} ({t.bairro})
                </option>
              ))}
            </select>
          </div>

          {/* Rua e Número */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('endf.rua', 'Rua / Logradouro')}
              </label>
              <input
                type="text"
                required
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                placeholder="Ex: Rua São Bento"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('endf.numero', 'Número')}
              </label>
              <input
                type="text"
                required
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex: 240"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Complemento & Bairro */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('endf.complemento', 'Complemento')}
              </label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Apto, Casa 2..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Coordenadas GPS */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="0.00001"
                required
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.00001"
                required
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Confirmação Checkbox */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enderecoConfirmado}
                onChange={(e) => setEnderecoConfirmado(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                {t('endf.confirmacao', 'Endereço confirmado (morador hispano verificado)')}
              </span>
            </label>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('common.observacoes', 'Observações')}
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Detalhes adicionais..."
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
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              {initialEndereco ? t('terr.salvar', 'Salvar') : t('terr.criar', 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
