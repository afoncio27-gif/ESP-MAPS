import React from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { Compass, MapPin, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const MeusTerritoriosView: React.FC = () => {
  const {
    territorios,
    currentUser,
    setSelectedTerritorioId,
    setActiveTab,
  } = useApp();
  const { t } = useI18n();

  // Find territories assigned to this user
  const meusTerritorios = territorios.filter((t) => {
    if (currentUser.role === 'DIRIGENTE') {
      return t.dirigente_id === currentUser.id || t.publicador_id === currentUser.id;
    }
    if (currentUser.role === 'PUBLICADOR') {
      return t.publicador_id === currentUser.id;
    }
    // For ADM, show territories where they are assigned directly or all if none
    return (
      t.publicador_id === currentUser.id ||
      t.dirigente_id === currentUser.id
    );
  });

  const handleOpenTerritorio = (id: string) => {
    setSelectedTerritorioId(id);
    setActiveTab('territorios');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {t('nav.meus_territorios', 'Meus Territórios')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Territórios sob sua responsabilidade para ministério de campo
          </p>
        </div>

        <button
          onClick={() => setActiveTab('programacao-campo')}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-2xs self-start sm:self-auto"
        >
          <span>{t('nav.programacao_campo', 'Ver Programação de Campo')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {meusTerritorios.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {t('meus.sem_territorios', 'Nenhum território atribuído no momento')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {t(
              'meus.sem_territorios_msg',
              'Você não possui territórios ativos no momento. Solicite uma designação a um dos dirigentes ou administrador.'
            )}
          </p>
          <div className="mt-4">
            <button
              onClick={() => setActiveTab('territorios')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              Ver todos os territórios
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meusTerritorios.map((terr) => {
            const progress =
              terr.total_enderecos > 0
                ? Math.round((terr.total_visitados / terr.total_enderecos) * 100)
                : 0;

            return (
              <div
                key={terr.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-indigo-600">
                          {terr.numero}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">
                          {terr.nome}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 font-medium block mt-0.5">
                        {terr.bairro} · {terr.cidade}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {terr.status.replace('_', ' ')}
                    </span>
                  </div>

                  {terr.descricao && (
                    <p className="text-xs text-slate-600 mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 line-clamp-2">
                      {terr.descricao}
                    </p>
                  )}

                  {/* Progress info */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Progresso de visitas:</span>
                      <span className="font-bold text-indigo-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{terr.total_visitados} visitados</span>
                      <span>{terr.total_enderecos - terr.total_visitados} pendentes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenTerritorio(terr.id)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Trabalhar Território</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
