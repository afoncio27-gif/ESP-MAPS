import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { User } from '../../types';
import { UserCog, MapPin, FolderSync, ShieldCheck, Mail, Phone, Trash2, KeyRound, Copy, Check } from 'lucide-react';

export const DirigentesView: React.FC = () => {
  const {
    users,
    territorios,
    designacoesDirigente,
    updateUserRole,
    deleteUser,
    currentUser,
    setActiveTab,
    setSelectedTerritorioId,
  } = useApp();
  const { t } = useI18n();

  const [deletingDirigente, setDeletingDirigente] = useState<User | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const dirigentes = users.filter((u) => u.role === 'DIRIGENTE' || u.role === 'ADM');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-indigo-600" />
          <span>{t('nav.dirigentes', 'Dirigentes de Saída de Campo')}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Irmãos designados para dirigir o ministério de campo no grupo hispano
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dirigentes.map((d) => {
          const assignedTerritorios = territorios.filter((t) => t.dirigente_id === d.id);
          const activeDesigs = designacoesDirigente.filter(
            (desig) => desig.dirigente_id === d.id && desig.status === 'ativo'
          );

          return (
            <div
              key={d.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm uppercase">
                      {d.nome.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{d.nome}</h3>
                      <span className="text-[11px] font-semibold text-indigo-600">
                        {d.role}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {assignedTerritorios.length} mapa(s)
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[11px] font-semibold text-slate-500">Acesso:</span>
                      <span className="font-mono font-bold text-xs text-indigo-700">
                        {d.codigo_acesso || '—'}
                      </span>
                    </div>
                    {d.codigo_acesso && (
                      <button
                        type="button"
                        onClick={() => handleCopyCode(d.codigo_acesso || '', d.id)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                        title="Copiar código"
                      >
                        {copiedId === d.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{d.email}</span>
                  </div>
                  {d.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{d.telefone}</span>
                    </div>
                  )}
                </div>

                {/* Assigned territories list */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Territórios em posse:
                  </span>
                  {assignedTerritorios.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Nenhum território no momento</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedTerritorios.map((terr) => (
                        <button
                          key={terr.id}
                          onClick={() => {
                            setSelectedTerritorioId(terr.id);
                            setActiveTab('territorios');
                          }}
                          className="px-2 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                        >
                          {terr.numero}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('programar')}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <FolderSync className="w-3.5 h-3.5" />
                  <span>Programar Mapas</span>
                </button>

                {currentUser.role === 'ADM' && d.id !== currentUser.id && (
                  <button
                    onClick={() => setDeletingDirigente(d)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Excluir Dirigente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Confirmação para Excluir Dirigente */}
      {deletingDirigente && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Excluir Dirigente</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Deseja realmente remover o dirigente <strong>{deletingDirigente.nome}</strong>? Os territórios designados a ele ficarão desvinculados e retornarão para o status de disponível.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingDirigente(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  deleteUser(deletingDirigente.id);
                  setDeletingDirigente(null);
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
