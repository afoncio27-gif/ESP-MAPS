import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { User, UserRole } from '../../types';
import {
  Users,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  UserPlus,
  KeyRound,
  Copy,
  Check,
  Share2,
  RefreshCw,
  Info,
  Phone,
  Mail,
  Shield,
} from 'lucide-react';

export const PublicadoresView: React.FC = () => {
  const {
    users,
    updateUserRole,
    deleteUser,
    currentUser,
    registerPublisher,
    regenerateUserCode,
    currentCongregacao,
  } = useApp();
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('PUBLICADOR');

  // Modal: Cadastrar Publicador
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoRole, setNovoRole] = useState<UserRole>('PUBLICADOR');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoEmail, setNovoEmail] = useState('');

  // Modal: Credenciais Geradas
  const [createdCredentials, setCreatedCredentials] = useState<{
    user: User;
    primeiroNome: string;
    codigo: string;
  } | null>(null);

  // Copy feedback
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    return (
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.telefone && u.telefone.includes(search)) ||
      (u.codigo_acesso && u.codigo_acesso.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserRole(editingUser.id, newRole);
    setEditingUser(null);
  };

  const handleRegisterPublisherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    const newUser = registerPublisher({
      nome: novoNome.trim(),
      role: novoRole,
      telefone: novoTelefone.trim() || undefined,
      email: novoEmail.trim() || undefined,
    });

    const firstName = newUser.nome.split(' ')[0];
    setCreatedCredentials({
      user: newUser,
      primeiroNome: firstName,
      codigo: newUser.codigo_acesso || '',
    });

    // Reset form
    setNovoNome('');
    setNovoRole('PUBLICADOR');
    setNovoTelefone('');
    setNovoEmail('');
    setIsRegisterModalOpen(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleShareWhatsApp = (user: User) => {
    const firstName = user.nome.split(' ')[0];
    const code = user.codigo_acesso || '';
    const message = encodeURIComponent(
      `Olá ${firstName}! Seu acesso ao sistema de mapas e territórios da congregação *${currentCongregacao.nome}* foi gerado.\n\nPara acessar o sistema:\n• Primeiro Nome: *${firstName}*\n• Código de Acesso: *${code}*\n\nBasta inserir essas informações na tela inicial do aplicativo!`
    );
    const phoneClean = user.telefone ? user.telefone.replace(/\D/g, '') : '';
    const url = phoneClean
      ? `https://api.whatsapp.com/send?phone=55${phoneClean}&text=${message}`
      : `https://api.whatsapp.com/send?text=${message}`;
    window.open(url, '_blank');
  };

  const handleRegenerate = (userId: string) => {
    const newCode = regenerateUserCode(userId);
    handleCopy(newCode, `regen-${userId}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>{t('nav.publicadores', 'Publicadores & Acessos')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Congregação: <strong className="text-slate-800">{currentCongregacao.nome}</strong> • Cada publicador possui um código único de acesso
          </p>
        </div>

        {currentUser.role === 'ADM' && (
          <button
            id="btn-cadastrar-publicador"
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Publicador</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="input-busca-publicadores"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, código de acesso, email ou telefone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Publicador</th>
                <th className="py-3.5 px-4">Código de Acesso</th>
                <th className="py-3.5 px-4">Contato</th>
                <th className="py-3.5 px-4">Papel</th>
                <th className="py-3.5 px-4">Status</th>
                {currentUser.role === 'ADM' && <th className="py-3.5 px-4 text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Nenhum publicador encontrado nesta congregação.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const firstName = u.nome.split(' ')[0];
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{u.nome}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>Primeiro nome: <strong className="text-slate-600">{firstName}</strong></span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs tracking-wider px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
                            {u.codigo_acesso || '—'}
                          </span>
                          {u.codigo_acesso && (
                            <>
                              <button
                                id={`copy-code-${u.id}`}
                                type="button"
                                onClick={() => handleCopy(u.codigo_acesso || '', u.id)}
                                title="Copiar Código de Acesso"
                                className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              >
                                {copiedCodeId === u.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                id={`share-wa-${u.id}`}
                                type="button"
                                onClick={() => handleShareWhatsApp(u)}
                                title="Enviar credenciais via WhatsApp"
                                className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <div>{u.telefone || '—'}</div>
                        {u.email && <div className="text-[11px] text-slate-400">{u.email}</div>}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'ADM'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : u.role === 'DIRIGENTE'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            u.status === 'aprovado'
                              ? 'bg-emerald-50 text-emerald-800'
                              : u.status === 'pendente'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      {currentUser.role === 'ADM' && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleRegenerate(u.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Gerar novo código de acesso"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setNewRole(u.role);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Alterar Função"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {u.id !== currentUser.id && (
                              <button
                                onClick={() => setDeletingUser(u)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Excluir Publicador"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CADASTRAR NOVO PUBLICADOR */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Novo Publicador</h3>
                  <p className="text-[11px] text-slate-500">
                    Gera automaticamente um código de acesso exclusivo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPublisherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Mateo Fernández"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Função / Papel
                  </label>
                  <select
                    value={novoRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="PUBLICADOR">Publicador</option>
                    <option value="DIRIGENTE">Dirigente</option>
                    <option value="ADM">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="tel"
                    value={novoTelefone}
                    onChange={(e) => setNovoTelefone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="publicador@email.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-900 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Ao cadastrar, o sistema criará um <strong>código único</strong> para o publicador acessar o aplicativo com seu primeiro nome e esse código.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Cadastrar e Gerar Código
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREDENCIAIS GERADAS COM SUCESSO */}
      {createdCredentials && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Publicador Cadastrado com Sucesso!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Compartilhe as credenciais abaixo para que o publicador possa acessar o aplicativo.
            </p>

            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Nome Completo:</span>
                <strong className="text-slate-900">{createdCredentials.user.nome}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Primeiro Nome para Acesso:</span>
                <strong className="text-indigo-600 font-bold">{createdCredentials.primeiroNome}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium text-xs">Código de Acesso Único:</span>
                <span className="font-mono text-sm font-black px-2.5 py-1 bg-indigo-600 text-white rounded-lg tracking-wider">
                  {createdCredentials.codigo}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `Acesso ESP-MAPAS:\nPrimeiro Nome: ${createdCredentials.primeiroNome}\nCódigo: ${createdCredentials.codigo}`,
                    'credentials-copy'
                  )
                }
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCodeId === 'credentials-copy' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Dados</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleShareWhatsApp(createdCredentials.user)}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Enviar WhatsApp</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCreatedCredentials(null)}
              className="w-full mt-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Exclusão de Publicador */}
      {deletingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Excluir Publicador</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Deseja realmente remover o publicador <strong>{deletingUser.nome}</strong>? Territórios que estiverem designados a ele retornarão ao status de disponível.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t('common.cancelar', 'Cancelar')}
              </button>
              <button
                onClick={() => {
                  deleteUser(deletingUser.id);
                  setDeletingUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {t('confirm.excluir', 'Excluir')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Papel */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Alterar Papel de Acesso
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Publicador
                </label>
                <div className="font-bold text-slate-900 text-sm">{editingUser.nome}</div>
                <div className="text-xs text-slate-400">{editingUser.email}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Novo Papel
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="PUBLICADOR">PUBLICADOR</option>
                  <option value="DIRIGENTE">DIRIGENTE</option>
                  <option value="ADM">ADM</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
