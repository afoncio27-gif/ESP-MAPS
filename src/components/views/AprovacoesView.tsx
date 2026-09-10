import React from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { UserCheck, Check, X, Mail, Phone, Clock } from 'lucide-react';

export const AprovacoesView: React.FC = () => {
  const { users, approveUser, rejectUser } = useApp();
  const { t, locale } = useI18n();

  const pendingUsers = users.filter((u) => u.status === 'pendente');

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-600" />
          <span>{t('nav.aprovacoes', 'Aprovações de Acesso')}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Publicadores que solicitaram cadastro no sistema e aguardam autorização de um administrador
        </p>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Nenhuma solicitação pendente
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Todos os cadastros foram processados. Novos pedidos de acesso aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{u.nome}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Aguardando aprovação
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.email}</span>
                  </div>
                  {u.telefone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.telefone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Solicitado em {new Date(u.data_cadastro).toLocaleDateString(locale === 'es' ? 'es-ES' : 'pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => rejectUser(u.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Rejeitar</span>
                </button>
                <button
                  onClick={() => approveUser(u.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aprovar Acesso</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
