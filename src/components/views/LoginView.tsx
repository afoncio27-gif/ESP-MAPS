import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  KeyRound,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  Phone,
  Mail,
  Shield,
  AlertCircle,
  Info,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Congregacao, User as AppUser } from '../../types';

export const LoginView: React.FC = () => {
  const {
    loginWithCode,
    registerCongregacao,
    congregacoes,
    allUsers,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register Congregation form state
  const [congNome, setCongNome] = useState('');
  const [congCidade, setCongCidade] = useState('');
  const [congEstado, setCongEstado] = useState('SP');
  const [congIdioma, setCongIdioma] = useState('Espanhol');
  const [adminNome, setAdminNome] = useState('');
  const [adminTelefone, setAdminTelefone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Success modal after creating congregation
  const [createdCongInfo, setCreatedCongInfo] = useState<{
    congregacao: Congregacao;
    adminUser: AppUser;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!primeiroNome.trim()) {
      setLoginError('Informe o seu primeiro nome.');
      return;
    }
    if (!codigoAcesso.trim()) {
      setLoginError('Informe o seu código de acesso.');
      return;
    }

    setIsLoggingIn(true);
    const result = loginWithCode(primeiroNome, codigoAcesso);
    setIsLoggingIn(false);

    if (!result.success) {
      setLoginError(result.message || 'Credenciais inválidas.');
    }
  };

  const handleQuickLogin = (nome: string, codigo: string) => {
    setPrimeiroNome(nome.split(' ')[0]);
    setCodigoAcesso(codigo);
    setLoginError(null);
    loginWithCode(nome.split(' ')[0], codigo);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!congNome.trim()) {
      setRegisterError('Informe o nome da congregação.');
      return;
    }
    if (!congCidade.trim()) {
      setRegisterError('Informe a cidade da congregação.');
      return;
    }
    if (!adminNome.trim()) {
      setRegisterError('Informe o nome do administrador responsável.');
      return;
    }

    setIsRegistering(true);
    try {
      const result = registerCongregacao({
        nome: congNome,
        cidade: congCidade,
        estado: congEstado,
        idioma: congIdioma,
        adminNome,
        adminTelefone,
        adminEmail,
      });
      setCreatedCongInfo(result);
    } catch {
      setRegisterError('Erro ao cadastrar a congregação. Tente novamente.');
    } finally {
      setIsRegistering(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background visual geometry */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              ESP <span className="text-indigo-400 font-semibold">- MAPAS</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Gestão de Territórios & Congregações</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Isolamento e Acesso Exclusivo por Congregação</span>
        </div>
      </header>

      {/* Main Form Center Card */}
      <main className="relative z-10 max-w-md sm:max-w-xl mx-auto w-full px-4 py-4 flex-1 flex flex-col justify-center">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {/* Navigation Tabs */}
          <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-700/60 mb-6">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Acessar com Código</span>
            </button>
            <button
              id="tab-register-btn"
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegisterError(null);
              }}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Cadastrar Congregação</span>
            </button>
          </div>

          {/* TAB 1: LOGIN COM PRIMEIRO NOME E CODIGO */}
          {activeTab === 'login' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Acesso do Publicador & ADM
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Digite seu primeiro nome e o código de acesso exclusivo fornecido pelo administrador da congregação.
                </p>
              </div>

              {loginError && (
                <div
                  id="login-error-alert"
                  className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="input-primeiro-nome"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Seu Primeiro Nome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="input-primeiro-nome"
                      type="text"
                      value={primeiroNome}
                      onChange={(e) => setPrimeiroNome(e.target.value)}
                      placeholder="Ex: Carlos, Mateo ou Sofia"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="input-codigo-acesso"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Código Único de Acesso
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="input-codigo-acesso"
                      type="text"
                      value={codigoAcesso}
                      onChange={(e) => setCodigoAcesso(e.target.value.toUpperCase())}
                      placeholder="Ex: PUB-4004 ou ADM-1001"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm tracking-wider font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    Cada publicador possui um código exclusivo gerado pelo ADM ao cadastrá-lo.
                  </p>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{isLoggingIn ? 'Verificando...' : 'Entrar no Sistema'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Access / Demo accounts for testing */}
              <div className="mt-6 pt-5 border-t border-slate-700/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Acessos de Demonstração Rápidos
                  </span>
                  <span className="text-[11px] text-slate-500">Clique para testar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allUsers
                    .filter((u) => u.status === 'aprovado')
                    .slice(0, 4)
                    .map((user) => {
                      const firstName = user.nome.split(' ')[0];
                      const roleColor =
                        user.role === 'ADM'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                          : user.role === 'DIRIGENTE'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20';

                      return (
                        <button
                          key={user.id}
                          id={`quick-login-${user.id}`}
                          type="button"
                          onClick={() => handleQuickLogin(user.nome, user.codigo_acesso || '')}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all group cursor-pointer ${roleColor}`}
                        >
                          <div className="truncate">
                            <p className="text-xs font-semibold text-white group-hover:text-indigo-200">
                              {firstName}
                            </p>
                            <p className="text-[11px] opacity-80">{user.role}</p>
                          </div>
                          <span className="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/60 text-slate-200">
                            {user.codigo_acesso}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CADASTRAR NOVA CONGREGAÇÃO */}
          {activeTab === 'register' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Cadastrar Nova Congregação
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Cadastre sua congregação para criar uma base de territórios e publicadores totalmente isolada.
                </p>
              </div>

              {registerError && (
                <div
                  id="register-error-alert"
                  className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                  <span>{registerError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="input-cong-nome"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Nome da Congregação / Grupo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      id="input-cong-nome"
                      type="text"
                      value={congNome}
                      onChange={(e) => setCongNome(e.target.value)}
                      placeholder="Ex: Congregação Alvorada - Grupo Espanhol"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="input-cong-cidade"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                    >
                      Cidade
                    </label>
                    <input
                      id="input-cong-cidade"
                      type="text"
                      value={congCidade}
                      onChange={(e) => setCongCidade(e.target.value)}
                      placeholder="Ex: Curitiba"
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="input-cong-idioma"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                    >
                      Idioma do Grupo
                    </label>
                    <select
                      id="input-cong-idioma"
                      value={congIdioma}
                      onChange={(e) => setCongIdioma(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="Espanhol">Espanhol</option>
                      <option value="Português">Português</option>
                      <option value="Inglês">Inglês</option>
                      <option value="Crioulo Haitiano">Crioulo Haitiano</option>
                      <option value="Libras">Libras</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-3">
                    Dados do Administrador Responsável
                  </span>

                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="input-admin-nome"
                        className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                      >
                        Nome Completo do ADM
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="input-admin-nome"
                          type="text"
                          value={adminNome}
                          onChange={(e) => setAdminNome(e.target.value)}
                          placeholder="Ex: Roberto Gomes"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="input-admin-telefone"
                          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                        >
                          WhatsApp / Telefone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <input
                            id="input-admin-telefone"
                            type="tel"
                            value={adminTelefone}
                            onChange={(e) => setAdminTelefone(e.target.value)}
                            placeholder="(41) 99999-8888"
                            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="input-admin-email"
                          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                        >
                          Email (Opcional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <input
                            id="input-admin-email"
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="admin@email.com"
                            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-submit-register-cong"
                  type="submit"
                  disabled={isRegistering}
                  className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>
                    {isRegistering ? 'Cadastrando...' : 'Criar Congregação e Iniciar como ADM'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-4 py-4 text-center text-xs text-slate-500">
        <p>
          Sistema Multi-Congregações com isolamento de dados. Cada congregação mantém seus próprios territórios, endereços e publicadores.
        </p>
      </footer>

      {/* SUCCESS MODAL AFTER REGISTERING CONGREGATION */}
      {createdCongInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-center text-white">
              Congregação Criada com Sucesso!
            </h3>
            <p className="text-sm text-slate-300 text-center mt-1">
              Guarde os dados abaixo para acessar novamente sempre que precisar.
            </p>

            <div className="mt-5 space-y-3 bg-slate-900/90 rounded-xl p-4 border border-slate-700/60">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Congregação
                </span>
                <p className="text-sm font-semibold text-white">
                  {createdCongInfo.congregacao.nome}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Código da Congregação
                  </span>
                  <p className="text-sm font-mono font-bold text-emerald-400">
                    {createdCongInfo.congregacao.codigo_congregação}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      createdCongInfo.congregacao.codigo_congregação || '',
                      'cong-code'
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedCode === 'cong-code' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Seu Código de Acesso (ADM)
                  </span>
                  <p className="text-base font-mono font-bold text-indigo-400">
                    {createdCongInfo.adminUser.codigo_acesso}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Primeiro nome:{' '}
                    <strong className="text-white">
                      {createdCongInfo.adminUser.nome.split(' ')[0]}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      createdCongInfo.adminUser.codigo_acesso || '',
                      'admin-code'
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-indigo-600/30 hover:bg-indigo-600/50 rounded-lg text-indigo-200 border border-indigo-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedCode === 'admin-code' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                Para acessar futuramente, informe seu primeiro nome (
                <strong>{createdCongInfo.adminUser.nome.split(' ')[0]}</strong>) e seu código (
                <strong>{createdCongInfo.adminUser.codigo_acesso}</strong>).
              </span>
            </div>

            <button
              id="btn-enter-cong-dashboard"
              type="button"
              onClick={() => setCreatedCongInfo(null)}
              className="w-full mt-5 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Acessar Painel da Congregação</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
