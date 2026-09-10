import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Endereco, Territorio } from '../../types';
import { LeafletMap } from '../map/LeafletMap';
import { RegistrarVisitaModal } from '../modals/RegistrarVisitaModal';
import { DesignarModal } from '../modals/DesignarModal';
import { EnderecoModal } from '../modals/EnderecoModal';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Clock,
  Plus,
  Compass,
  Navigation,
  Check,
  X,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Edit2,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface TerritorioDetalheViewProps {
  territorioId: string;
  onBack: () => void;
}

export const TerritorioDetalheView: React.FC<TerritorioDetalheViewProps> = ({
  territorioId,
  onBack,
}) => {
  const {
    territorios,
    enderecos,
    concludeTerritorio,
    revokeTerritorio,
    toggleConfirmEndereco,
    deleteEndereco,
    deleteTerritorio,
    currentUser,
  } = useApp();
  const { t } = useI18n();

  const territorio = territorios.find((t) => t.id === territorioId);

  const [addressFilter, setAddressFilter] = useState<'todos' | 'pendentes' | 'visitados'>('todos');
  const [selectedEndereco, setSelectedEndereco] = useState<Endereco | null>(null);

  // Modals
  const [visitaModalEndereco, setVisitaModalEndereco] = useState<Endereco | null>(null);
  const [isDesignarModalOpen, setIsDesignarModalOpen] = useState(false);
  const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false);
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null);
  const [deletingEndereco, setDeletingEndereco] = useState<Endereco | null>(null);
  const [mapClickedCoords, setMapClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isConfirmConcludeOpen, setIsConfirmConcludeOpen] = useState(false);
  const [isConfirmRevokeOpen, setIsConfirmRevokeOpen] = useState(false);
  const [isConfirmDeleteTerritorioOpen, setIsConfirmDeleteTerritorioOpen] = useState(false);

  if (!territorio) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-slate-700">Território não encontrado.</p>
        <button
          onClick={onBack}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          {t('common.voltar', 'Voltar')}
        </button>
      </div>
    );
  }

  const terrEnderecos = enderecos.filter((e) => e.territorio_id === territorio.id && e.ativo);

  const filteredEnderecos = terrEnderecos.filter((e) => {
    if (addressFilter === 'pendentes') return e.status === 'pendente';
    if (addressFilter === 'visitados') return e.status === 'visitado';
    return true;
  });

  const total = terrEnderecos.length;
  const visitados = terrEnderecos.filter((e) => e.status === 'visitado').length;
  const pendentes = total - visitados;
  const progresso = total > 0 ? Math.round((visitados / total) * 100) : 0;
  const confirmadosCount = terrEnderecos.filter((e) => e.endereco_confirmado).length;

  const handleMapClick = (lat: number, lng: number) => {
    setMapClickedCoords({ lat, lng });
    setEditingEndereco(null);
    setIsEnderecoModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar with Back button and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {territorio.numero} - {territorio.nome}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {territorio.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {territorio.bairro} · {territorio.cidade} · {total} endereços cadastrados
            </p>
          </div>
        </div>

        {/* Territory Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Address button */}
          {(currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
            <button
              onClick={() => {
                setEditingEndereco(null);
                setMapClickedCoords(null);
                setIsEnderecoModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>{t('td.adicionar_endereco', 'Adicionar Endereço')}</span>
            </button>
          )}

          {/* Designate button */}
          {(currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
            <button
              onClick={() => setIsDesignarModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>{t('designar.titulo', 'Designar')}</span>
            </button>
          )}

          {/* Revoke button if assigned */}
          {(territorio.status !== 'disponivel' && territorio.status !== 'concluido') &&
            (currentUser.role === 'ADM' || currentUser.role === 'DIRIGENTE') && (
              <button
                onClick={() => setIsConfirmRevokeOpen(true)}
                className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>{t('td.revogar', 'Revogar')}</span>
              </button>
            )}

          {/* Conclude Territory button */}
          {territorio.status !== 'concluido' && (
            <button
              onClick={() => setIsConfirmConcludeOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('td.concluir', 'Concluir Território')}</span>
            </button>
          )}

          {/* Delete Territory button (ADMIN only) */}
          {currentUser.role === 'ADM' && (
            <button
              onClick={() => setIsConfirmDeleteTerritorioOpen(true)}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Excluir Território"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Excluir Território</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Responsibility Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Responsável Atual
            </span>
            <div className="mt-1 text-sm font-black text-slate-900">
              {territorio.publicador_nome || territorio.dirigente_nome || 'Nenhum (Disponível)'}
            </div>
            <div className="text-xs text-slate-500">
              {territorio.data_designacao
                ? `Desde ${new Date(territorio.data_designacao).toLocaleDateString()}`
                : 'Não designado'}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Progresso
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{progresso}%</span>
              <span className="text-xs text-slate-500 font-semibold">
                ({visitados} de {total} visitados)
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Endereços Confirmados
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600">{confirmadosCount}</span>
              <span className="text-xs text-slate-400">/ {total}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Hispano verificado</span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pendentes de Visita
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-600">{pendentes}</span>
              <span className="text-xs text-slate-400">a visitar</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Nesta rodada de trabalho</span>
          </div>
        </div>

        {territorio.descricao && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-xl">
            <span className="font-bold text-slate-800">Instruções: </span>
            {territorio.descricao}
          </div>
        )}
      </div>

      {/* Interactive Map View */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">
              Mapa do Território ({terrEnderecos.length} pontos)
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Clique em qualquer marcador para ver opções ou navegar
          </span>
        </div>

        <LeafletMap
          enderecos={terrEnderecos}
          center={[territorio.latitude, territorio.longitude]}
          zoom={16}
          onMapClick={handleMapClick}
          onSelectEndereco={(end) => setSelectedEndereco(end)}
          onRegistrarVisita={(end) => setVisitaModalEndereco(end)}
          height="380px"
        />
      </div>

      {/* Addresses Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Endereços deste Território ({filteredEnderecos.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setAddressFilter('todos')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                addressFilter === 'todos'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('td.todos', 'Todos')} ({total})
            </button>
            <button
              onClick={() => setAddressFilter('pendentes')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                addressFilter === 'pendentes'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('td.pendentes', 'Pendentes')} ({pendentes})
            </button>
            <button
              onClick={() => setAddressFilter('visitados')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                addressFilter === 'visitados'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('td.visitados', 'Visitados')} ({visitados})
            </button>
          </div>
        </div>

        {filteredEnderecos.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400">
              {t('td.sem_enderecos', 'Nenhum endereço encontrado para este filtro.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredEnderecos.map((end) => {
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${end.latitude},${end.longitude}`;
              const isSelected = selectedEndereco?.id === end.id;

              return (
                <div
                  key={end.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header: address + confirmation badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>
                            {end.rua}, {end.numero}
                          </span>
                          {end.complemento && (
                            <span className="text-slate-400 text-[11px] font-normal">
                              ({end.complemento})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {end.bairro} · {end.cidade}
                        </div>
                      </div>

                      {/* Status & Confirmation badges */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            end.status === 'visitado'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {end.status === 'visitado' ? 'Visitado' : 'Pendente'}
                        </span>

                        <button
                          onClick={() => toggleConfirmEndereco(end.id)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            end.endereco_confirmado
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Clique para alternar confirmação"
                        >
                          {end.endereco_confirmado ? '★ Confirmado' : 'Não conf.'}
                        </button>
                      </div>
                    </div>

                    {/* Observações */}
                    {end.observacoes && (
                      <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-normal">
                        {end.observacoes}
                      </p>
                    )}

                    {/* Last visit info if visited */}
                    {end.data_ultima_visita && (
                      <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>
                          Última visita: {new Date(end.data_ultima_visita).toLocaleDateString()}
                        </span>
                        {end.ultimo_resultado && (
                          <span className="font-semibold text-slate-600 capitalize">
                            {end.ultimo_resultado.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {currentUser.role === 'ADM' && (
                        <>
                          <button
                            onClick={() => {
                              setEditingEndereco(end);
                              setIsEnderecoModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingEndereco(end)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-slate-500" />
                        <span>Navegar</span>
                      </a>
                      <button
                        onClick={() => setVisitaModalEndereco(end)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                      >
                        {t('visita.titulo', 'Visitar')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Registrar Visita */}
      {visitaModalEndereco && (
        <RegistrarVisitaModal
          endereco={visitaModalEndereco}
          isOpen={!!visitaModalEndereco}
          onClose={() => setVisitaModalEndereco(null)}
        />
      )}

      {/* Modal: Designar Território */}
      <DesignarModal
        territorio={territorio}
        isOpen={isDesignarModalOpen}
        onClose={() => setIsDesignarModalOpen(false)}
      />

      {/* Modal: Adicionar / Editar Endereço */}
      <EnderecoModal
        territorioId={territorio.id}
        initialEndereco={editingEndereco}
        initialCoords={mapClickedCoords}
        isOpen={isEnderecoModalOpen}
        onClose={() => {
          setIsEnderecoModalOpen(false);
          setEditingEndereco(null);
          setMapClickedCoords(null);
        }}
      />

      {/* Confirm Conclude Modal */}
      {isConfirmConcludeOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('td.concluir_titulo', 'Concluir Território')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t(
                'td.concluir_msg',
                'Ao concluir o território, o status passará para concluído e o histórico de designação será finalizado.'
              )}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsConfirmConcludeOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  concludeTerritorio(territorio.id);
                  setIsConfirmConcludeOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                {t('td.confirmar_conclusao', 'Confirmar Conclusão')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Revoke Modal */}
      {isConfirmRevokeOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('td.revogar_titulo', 'Revogar Designação')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t(
                'td.revogar_msg',
                'Deseja realmente revogar a designação deste território? Ele voltará ao status de disponível.'
              )}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsConfirmRevokeOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  revokeTerritorio(territorio.id);
                  setIsConfirmRevokeOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
              >
                {t('td.confirmar_revogacao', 'Confirmar Revogação')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Exclusão de Território */}
      {isConfirmDeleteTerritorioOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('terr.excluir_titulo', 'Excluir território')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t(
                'terr.excluir_msg',
                'Deseja realmente excluir este território? Esta ação não pode ser desfeita.'
              )}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsConfirmDeleteTerritorioOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  deleteTerritorio(territorio.id);
                  setIsConfirmDeleteTerritorioOpen(false);
                  onBack();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                {t('confirm.excluir', 'Excluir')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Exclusão de Endereço */}
      {deletingEndereco && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Excluir Endereço</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Deseja realmente remover o endereço {deletingEndereco.rua}, {deletingEndereco.numero}? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingEndereco(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  deleteEndereco(deletingEndereco.id);
                  setDeletingEndereco(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                {t('confirm.excluir', 'Excluir')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
