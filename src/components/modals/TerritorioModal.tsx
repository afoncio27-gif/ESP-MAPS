import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Territorio } from '../../types';
import { X } from 'lucide-react';

interface TerritorioModalProps {
  initialTerritorio?: Territorio | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TerritorioModal: React.FC<TerritorioModalProps> = ({
  initialTerritorio,
  isOpen,
  onClose,
}) => {
  const { addTerritorio, updateTerritorio, territorios } = useApp();
  const { t } = useI18n();

  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('São Paulo');
  const [bairro, setBairro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState<number>(-23.5505);
  const [longitude, setLongitude] = useState<number>(-46.6333);

  useEffect(() => {
    if (initialTerritorio) {
      setNumero(initialTerritorio.numero);
      setNome(initialTerritorio.nome);
      setCidade(initialTerritorio.cidade);
      setBairro(initialTerritorio.bairro);
      setDescricao(initialTerritorio.descricao || '');
      setLatitude(initialTerritorio.latitude);
      setLongitude(initialTerritorio.longitude);
    } else {
      const nextNum = `${territorios.length + 1}`.padStart(2, '0');
      setNumero(nextNum);
      setNome(`Território ${nextNum}`);
      setCidade('São Paulo');
      setBairro('');
      setDescricao('');
      setLatitude(-23.5505);
      setLongitude(-46.6333);
    }
  }, [initialTerritorio, territorios.length]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialTerritorio) {
      updateTerritorio(initialTerritorio.id, {
        numero: numero.trim(),
        nome: nome.trim(),
        cidade: cidade.trim(),
        bairro: bairro.trim(),
        descricao: descricao.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    } else {
      addTerritorio({
        numero: numero.trim(),
        nome: nome.trim(),
        cidade: cidade.trim(),
        bairro: bairro.trim(),
        descricao: descricao.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
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
              {initialTerritorio
                ? t('terr.editar_titulo', 'Editar Território')
                : t('terr.novo_titulo', 'Novo Território')}
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
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Número
              </label>
              <input
                type="text"
                required
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="01"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('terr.nome', 'Nome')}
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Território 01 - Centro"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('terr.bairro', 'Bairro')}
              </label>
              <input
                type="text"
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('terr.cidade', 'Cidade')}
              </label>
              <input
                type="text"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="São Paulo"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('terr.latitude', 'Latitude (centro)')}
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
                {t('terr.longitude', 'Longitude (centro)')}
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('terr.descricao', 'Descrição')}
            </label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Instruções e características do território..."
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
              {initialTerritorio ? t('terr.salvar', 'Salvar') : t('terr.criar', 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
