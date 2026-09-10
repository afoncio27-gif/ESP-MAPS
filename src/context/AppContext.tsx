import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Congregacao,
  User,
  UserRole,
  Territorio,
  Endereco,
  Visita,
  DesignacaoDirigente,
  DesignacaoPublicador,
  ProgramacaoCampo,
  ProgramacaoDesignacao,
  Campanha,
  EnderecoCenso,
  Notificacao,
  ActiveTab,
  VisitaResultado,
} from '../types';
import {
  INITIAL_CONGREGACAO,
  INITIAL_USERS,
  INITIAL_TERRITORIOS,
  INITIAL_ENDERECOS,
  INITIAL_VISITAS,
  INITIAL_DESIGNACOES_DIRIGENTE,
  INITIAL_DESIGNACOES_PUBLICADOR,
  INITIAL_PROGRAMACOES_CAMPO,
  INITIAL_CAMPANHAS,
  INITIAL_ENDERECOS_CENSO,
  INITIAL_NOTIFICACOES,
} from '../data/mockData';

export interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  switchUserRole: (role: UserRole) => void;
  congregacoes: Congregacao[];
  currentCongregacao: Congregacao;
  setCurrentCongregacao: (cong: Congregacao) => void;
  switchCongregacao: (congId: string) => void;
  registerCongregacao: (data: {
    nome: string;
    cidade: string;
    estado?: string;
    idioma: string;
    adminNome: string;
    adminEmail?: string;
    adminTelefone?: string;
  }) => { congregacao: Congregacao; adminUser: User };
  registerPublisher: (data: {
    nome: string;
    email?: string;
    telefone?: string;
    role?: UserRole;
  }) => User;
  loginWithCode: (
    primeiroNome: string,
    codigoAcesso: string
  ) => { success: boolean; message?: string; user?: User };
  logout: () => void;
  regenerateUserCode: (userId: string) => string;
  allUsers: User[];
  users: User[];
  territorios: Territorio[];
  enderecos: Endereco[];
  visitas: Visita[];
  designacoesDirigente: DesignacaoDirigente[];
  designacoesPublicador: DesignacaoPublicador[];
  programacoesCampo: ProgramacaoCampo[];
  programacoesDesignacao: ProgramacaoDesignacao[];
  campanhas: Campanha[];
  enderecosCenso: EnderecoCenso[];
  notificacoes: Notificacao[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedTerritorioId: string | null;
  setSelectedTerritorioId: (id: string | null) => void;

  // Actions
  addTerritorio: (data: Partial<Territorio>) => void;
  updateTerritorio: (id: string, data: Partial<Territorio>) => void;
  deleteTerritorio: (id: string) => void;
  assignTerritorio: (
    territorioId: string,
    targetUserId: string,
    targetType: 'dirigente' | 'publicador',
    observacoes?: string
  ) => void;
  revokeTerritorio: (territorioId: string) => void;
  completeTerritorio: (territorioId: string) => void;
  batchAssignTerritorios: (
    territorioIds: string[],
    targetUserId: string,
    targetType: 'dirigente' | 'publicador',
    observacoes?: string
  ) => void;

  addEndereco: (data: Omit<Endereco, 'id'>) => void;
  updateEndereco: (id: string, data: Partial<Endereco>) => void;
  deleteEndereco: (id: string) => void;
  toggleConfirmEndereco: (id: string) => void;

  addVisita: (data: Omit<Visita, 'id' | 'data'>) => void;
  clearVisitasHistorico: () => void;
  clearAllVisitasGeral: () => void;

  addProgramacaoCampo: (data: Omit<ProgramacaoCampo, 'id'>) => void;
  deleteProgramacaoCampo: (id: string) => void;

  addProgramacaoDesignacao: (data: Omit<ProgramacaoDesignacao, 'id' | 'executada'>) => void;
  deleteProgramacaoDesignacao: (id: string) => void;

  addCampanha: (data: Omit<Campanha, 'id'>) => void;
  updateCampanha: (id: string, data: Partial<Campanha>) => void;
  deleteCampanha: (id: string) => void;
  toggleCampanhaAtiva: (id: string) => void;

  addEnderecoCenso: (data: Omit<EnderecoCenso, 'id' | 'data_cadastro'>) => void;
  updateEnderecoCenso: (id: string, data: Partial<EnderecoCenso>) => void;
  deleteEnderecoCenso: (id: string) => void;
  convertCensoToEndereco: (censoId: string, territorioId: string) => void;

  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  deactivateUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  deleteUserPermanently: (userId: string) => void;

  markAllNotificacoesRead: () => void;
  sendTestNotification: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`esp_mapas_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`esp_mapas_${key}`, JSON.stringify(value));
  } catch {}
}

function generatePublisherCode(role: UserRole = 'PUBLICADOR'): string {
  const prefix = role === 'ADM' ? 'ADM' : role === 'DIRIGENTE' ? 'DIR' : 'PUB';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

function generateCongregationCode(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CONG-${randomNum}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Congregations
  const [congregacoes, setCongregacoes] = useState<Congregacao[]>(() =>
    loadStorage('congregacoes', [INITIAL_CONGREGACAO])
  );

  const [currentCongregacaoId, setCurrentCongregacaoId] = useState<string>(() => {
    return loadStorage('current_congregacao_id', INITIAL_CONGREGACAO.id);
  });

  // Master Users across all congregations
  const [rawUsers, setRawUsers] = useState<User[]>(() => {
    const loaded = loadStorage<User[]>('users', INITIAL_USERS);
    return loaded.map((u, idx) => ({
      ...u,
      congregacao_id: u.congregacao_id || 'cong-1',
      codigo_acesso:
        u.codigo_acesso ||
        (u.role === 'ADM'
          ? `ADM-${1001 + idx}`
          : u.role === 'DIRIGENTE'
          ? `DIR-${2002 + idx}`
          : `PUB-${4004 + idx}`),
    }));
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return loadStorage('is_authenticated', true);
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const stored = loadStorage<User | null>('current_user', null);
    if (stored) {
      const match = rawUsers.find((u) => u.id === stored.id);
      if (match) return match;
    }
    return rawUsers.find((u) => u.role === 'ADM') || rawUsers[0];
  });

  // Master Data Collections with backward compatible congregacao_id
  const [allTerritorios, setAllTerritorios] = useState<Territorio[]>(() => {
    const loaded = loadStorage('territorios', INITIAL_TERRITORIOS);
    return loaded.map((t) => ({ ...t, congregacao_id: t.congregacao_id || 'cong-1' }));
  });

  const [allEnderecos, setAllEnderecos] = useState<Endereco[]>(() => {
    const loaded = loadStorage('enderecos', INITIAL_ENDERECOS);
    return loaded.map((e) => ({ ...e, congregacao_id: e.congregacao_id || 'cong-1' }));
  });

  const [allVisitas, setAllVisitas] = useState<Visita[]>(() => {
    const loaded = loadStorage('visitas', INITIAL_VISITAS);
    return loaded.map((v) => ({ ...v, congregacao_id: v.congregacao_id || 'cong-1' }));
  });

  const [allDesignacoesDirigente, setAllDesignacoesDirigente] = useState<DesignacaoDirigente[]>(() => {
    const loaded = loadStorage('desig_dir', INITIAL_DESIGNACOES_DIRIGENTE);
    return loaded.map((d) => ({ ...d, congregacao_id: d.congregacao_id || 'cong-1' }));
  });

  const [allDesignacoesPublicador, setAllDesignacoesPublicador] = useState<DesignacaoPublicador[]>(() => {
    const loaded = loadStorage('desig_pub', INITIAL_DESIGNACOES_PUBLICADOR);
    return loaded.map((d) => ({ ...d, congregacao_id: d.congregacao_id || 'cong-1' }));
  });

  const [allProgramacoesCampo, setAllProgramacoesCampo] = useState<ProgramacaoCampo[]>(() => {
    const loaded = loadStorage('prog_campo', INITIAL_PROGRAMACOES_CAMPO);
    return loaded.map((p) => ({ ...p, congregacao_id: p.congregacao_id || 'cong-1' }));
  });

  const [allProgramacoesDesignacao, setAllProgramacoesDesignacao] = useState<ProgramacaoDesignacao[]>(() => {
    const loaded = loadStorage('prog_desig', []);
    return loaded.map((p) => ({ ...p, congregacao_id: p.congregacao_id || 'cong-1' }));
  });

  const [allCampanhas, setAllCampanhas] = useState<Campanha[]>(() => {
    const loaded = loadStorage('campanhas', INITIAL_CAMPANHAS);
    return loaded.map((c) => ({ ...c, congregacao_id: c.congregacao_id || 'cong-1' }));
  });

  const [allEnderecosCenso, setAllEnderecosCenso] = useState<EnderecoCenso[]>(() => {
    const loaded = loadStorage('censo', INITIAL_ENDERECOS_CENSO);
    return loaded.map((ec) => ({ ...ec, congregacao_id: ec.congregacao_id || 'cong-1' }));
  });

  const [allNotificacoes, setAllNotificacoes] = useState<Notificacao[]>(() => {
    const loaded = loadStorage('notificacoes', INITIAL_NOTIFICACOES);
    return loaded.map((n) => ({ ...n, congregacao_id: n.congregacao_id || 'cong-1' }));
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('painel');
  const [selectedTerritorioId, setSelectedTerritorioId] = useState<string | null>(null);

  // Derive active congregation safely
  const currentCongregacao =
    congregacoes.find((c) => c.id === currentCongregacaoId) ||
    congregacoes[0] ||
    INITIAL_CONGREGACAO;

  const activeCongId = currentCongregacao.id;

  // STRICT MULTI-CONGREGATION DATA ISOLATION
  const users = rawUsers.filter((u) => (u.congregacao_id || 'cong-1') === activeCongId);
  const territorios = allTerritorios.filter((t) => (t.congregacao_id || 'cong-1') === activeCongId);
  const enderecos = allEnderecos.filter((e) => (e.congregacao_id || 'cong-1') === activeCongId);
  const visitas = allVisitas.filter((v) => (v.congregacao_id || 'cong-1') === activeCongId);
  const designacoesDirigente = allDesignacoesDirigente.filter(
    (d) => (d.congregacao_id || 'cong-1') === activeCongId
  );
  const designacoesPublicador = allDesignacoesPublicador.filter(
    (d) => (d.congregacao_id || 'cong-1') === activeCongId
  );
  const programacoesCampo = allProgramacoesCampo.filter(
    (p) => (p.congregacao_id || 'cong-1') === activeCongId
  );
  const programacoesDesignacao = allProgramacoesDesignacao.filter(
    (p) => (p.congregacao_id || 'cong-1') === activeCongId
  );
  const campanhas = allCampanhas.filter((c) => (c.congregacao_id || 'cong-1') === activeCongId);
  const enderecosCenso = allEnderecosCenso.filter(
    (ec) => (ec.congregacao_id || 'cong-1') === activeCongId
  );
  const notificacoes = allNotificacoes.filter(
    (n) => (n.congregacao_id || 'cong-1') === activeCongId && n.user_id === currentUser.id
  );

  // Sync to local storage
  useEffect(() => saveStorage('congregacoes', congregacoes), [congregacoes]);
  useEffect(() => saveStorage('current_congregacao_id', currentCongregacaoId), [currentCongregacaoId]);
  useEffect(() => saveStorage('users', rawUsers), [rawUsers]);
  useEffect(() => saveStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveStorage('is_authenticated', isAuthenticated), [isAuthenticated]);
  useEffect(() => saveStorage('territorios', allTerritorios), [allTerritorios]);
  useEffect(() => saveStorage('enderecos', allEnderecos), [allEnderecos]);
  useEffect(() => saveStorage('visitas', allVisitas), [allVisitas]);
  useEffect(() => saveStorage('desig_dir', allDesignacoesDirigente), [allDesignacoesDirigente]);
  useEffect(() => saveStorage('desig_pub', allDesignacoesPublicador), [allDesignacoesPublicador]);
  useEffect(() => saveStorage('prog_campo', allProgramacoesCampo), [allProgramacoesCampo]);
  useEffect(() => saveStorage('prog_desig', allProgramacoesDesignacao), [allProgramacoesDesignacao]);
  useEffect(() => saveStorage('campanhas', allCampanhas), [allCampanhas]);
  useEffect(() => saveStorage('censo', allEnderecosCenso), [allEnderecosCenso]);
  useEffect(() => saveStorage('notificacoes', allNotificacoes), [allNotificacoes]);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    if (user.congregacao_id && user.congregacao_id !== currentCongregacaoId) {
      setCurrentCongregacaoId(user.congregacao_id);
    }
  };

  const setCurrentCongregacao = (cong: Congregacao) => {
    setCurrentCongregacaoId(cong.id);
  };

  const switchCongregacao = (congId: string) => {
    const targetCong = congregacoes.find((c) => c.id === congId);
    if (!targetCong) return;
    setCurrentCongregacaoId(targetCong.id);

    // Switch current user if user not in this congregation
    if (currentUser.congregacao_id !== targetCong.id) {
      const userInCong =
        rawUsers.find((u) => u.congregacao_id === targetCong.id && u.role === 'ADM') ||
        rawUsers.find((u) => u.congregacao_id === targetCong.id) ||
        rawUsers[0];
      if (userInCong) {
        setCurrentUserState(userInCong);
      }
    }
  };

  // Congregation & Publisher Registration
  const registerCongregacao = (data: {
    nome: string;
    cidade: string;
    estado?: string;
    idioma: string;
    adminNome: string;
    adminEmail?: string;
    adminTelefone?: string;
  }): { congregacao: Congregacao; adminUser: User } => {
    const congId = `cong-${Date.now()}`;
    const congCode = generateCongregationCode();
    const adminCode = generatePublisherCode('ADM');

    const newCong: Congregacao = {
      id: congId,
      nome: data.nome.trim(),
      cidade: data.cidade.trim(),
      estado: data.estado?.trim(),
      idioma: data.idioma.trim(),
      codigo_congregação: congCode,
      criada_em: new Date().toISOString(),
      criada_por_nome: data.adminNome.trim(),
    };

    const adminUser: User = {
      id: `u-${Date.now()}`,
      nome: data.adminNome.trim(),
      email: data.adminEmail?.trim() || `${data.adminNome.toLowerCase().replace(/\s+/g, '.')}@mapas.org`,
      telefone: data.adminTelefone?.trim(),
      role: 'ADM',
      status: 'aprovado',
      criado_em: new Date().toISOString(),
      congregacao_id: congId,
      codigo_acesso: adminCode,
    };

    setCongregacoes((prev) => [...prev, newCong]);
    setRawUsers((prev) => [...prev, adminUser]);
    setCurrentCongregacaoId(congId);
    setCurrentUserState(adminUser);
    setIsAuthenticated(true);

    return { congregacao: newCong, adminUser };
  };

  const registerPublisher = (data: {
    nome: string;
    email?: string;
    telefone?: string;
    role?: UserRole;
  }): User => {
    const role = data.role || 'PUBLICADOR';
    let code = generatePublisherCode(role);
    while (rawUsers.some((u) => u.codigo_acesso === code)) {
      code = generatePublisherCode(role);
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      nome: data.nome.trim(),
      email: data.email?.trim() || `${data.nome.toLowerCase().replace(/\s+/g, '.')}@mapas.org`,
      telefone: data.telefone?.trim(),
      role,
      status: 'aprovado',
      criado_em: new Date().toISOString(),
      congregacao_id: currentCongregacao.id,
      codigo_acesso: code,
    };

    setRawUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const regenerateUserCode = (userId: string): string => {
    const user = rawUsers.find((u) => u.id === userId);
    const role = user?.role || 'PUBLICADOR';
    let newCode = generatePublisherCode(role);
    while (rawUsers.some((u) => u.codigo_acesso === newCode)) {
      newCode = generatePublisherCode(role);
    }
    setRawUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, codigo_acesso: newCode } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUserState((prev) => ({ ...prev, codigo_acesso: newCode }));
    }
    return newCode;
  };

  // Publisher / User Login with First Name and Unique Access Code
  const loginWithCode = (
    primeiroNome: string,
    codigoAcesso: string
  ): { success: boolean; message?: string; user?: User } => {
    const cleanName = primeiroNome.trim().toLowerCase();
    const cleanCode = codigoAcesso.trim().toUpperCase();

    if (!cleanName || !cleanCode) {
      return {
        success: false,
        message: 'Por favor, preencha o seu primeiro nome e o código de acesso.',
      };
    }

    const foundUser = rawUsers.find((u) => {
      const userFirstName = u.nome.trim().split(' ')[0].toLowerCase();
      const userCode = (u.codigo_acesso || '').trim().toUpperCase();
      return (
        userCode === cleanCode &&
        (userFirstName === cleanName || u.nome.toLowerCase() === cleanName)
      );
    });

    if (!foundUser) {
      return {
        success: false,
        message:
          'Primeiro nome ou código de acesso inválido. Verifique o código com o administrador da sua congregação.',
      };
    }

    if (foundUser.status === 'desativado') {
      return {
        success: false,
        message: 'Seu acesso foi desativado pelo administrador da congregação.',
      };
    }

    if (foundUser.status === 'pendente') {
      return {
        success: false,
        message: 'Seu acesso ainda aguarda aprovação pelo administrador.',
      };
    }

    const cong =
      congregacoes.find((c) => c.id === foundUser.congregacao_id) || congregacoes[0];

    setCurrentCongregacaoId(cong.id);
    setCurrentUserState(foundUser);
    setIsAuthenticated(true);

    return { success: true, user: foundUser };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUserRole = (role: UserRole) => {
    const target = users.find((u) => u.role === role && u.status === 'aprovado');
    if (target) {
      setCurrentUser(target);
    } else {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      setRawUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
  };

  // Recalculate territory address stats
  const syncTerritorioStats = (tList: Territorio[], eList: Endereco[]): Territorio[] => {
    return tList.map((t) => {
      const tEnderecos = eList.filter((e) => e.territorio_id === t.id && e.ativo);
      const visitados = tEnderecos.filter((e) => e.status === 'visitado').length;
      return {
        ...t,
        total_enderecos: tEnderecos.length,
        total_visitados: visitados,
      };
    });
  };

  // Territorios Actions
  const addTerritorio = (data: Partial<Territorio>) => {
    const id = `t-${Date.now().toString().slice(-4)}`;
    const newT: Territorio = {
      id,
      congregacao_id: currentCongregacao.id,
      numero: data.numero || `${territorios.length + 1}`.padStart(2, '0'),
      nome: data.nome || `Território ${data.numero || territorios.length + 1}`,
      cidade: data.cidade || currentCongregacao.cidade || 'São Paulo',
      bairro: data.bairro || 'Centro',
      descricao: data.descricao || '',
      latitude: data.latitude || -23.5505,
      longitude: data.longitude || -46.6333,
      status: 'disponivel',
      total_enderecos: 0,
      total_visitados: 0,
    };
    setAllTerritorios((prev) => [...prev, newT]);
  };

  const updateTerritorio = (id: string, data: Partial<Territorio>) => {
    setAllTerritorios((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTerritorio = (id: string) => {
    setAllTerritorios((prev) => prev.filter((t) => t.id !== id));
    setAllEnderecos((prev) => prev.filter((e) => e.territorio_id !== id));
    setAllDesignacoesDirigente((prev) => prev.filter((d) => d.territorio_id !== id));
    setAllDesignacoesPublicador((prev) => prev.filter((d) => d.territorio_id !== id));
    if (selectedTerritorioId === id) setSelectedTerritorioId(null);
  };

  const assignTerritorio = (
    territorioId: string,
    targetUserId: string,
    targetType: 'dirigente' | 'publicador',
    observacoes?: string
  ) => {
    const targetUser = rawUsers.find((u) => u.id === targetUserId);
    if (!targetUser) return;

    const today = new Date().toISOString().split('T')[0];

    setAllTerritorios((prev) =>
      prev.map((t) => {
        if (t.id !== territorioId) return t;
        if (targetType === 'dirigente') {
          return {
            ...t,
            status: 'designado_dirigente',
            dirigente_id: targetUser.id,
            dirigente_nome: targetUser.nome,
            data_designacao: today,
            data_conclusao: undefined,
          };
        } else {
          return {
            ...t,
            status: 'designado_publicador',
            publicador_id: targetUser.id,
            publicador_nome: targetUser.nome,
            data_designacao: today,
            data_conclusao: undefined,
          };
        }
      })
    );

    const targetTerritorio = allTerritorios.find((t) => t.id === territorioId);
    const terrNome = targetTerritorio?.nome || `Território ${territorioId}`;

    if (targetType === 'dirigente') {
      const newDesig: DesignacaoDirigente = {
        id: `dd-${Date.now()}`,
        congregacao_id: currentCongregacao.id,
        territorio_id: territorioId,
        territorio_nome: terrNome,
        dirigente_id: targetUser.id,
        dirigente_nome: targetUser.nome,
        data_designacao: today,
        status: 'ativa',
        observacoes,
      };
      setAllDesignacoesDirigente((prev) => [newDesig, ...prev]);
    } else {
      const newDesig: DesignacaoPublicador = {
        id: `dp-${Date.now()}`,
        congregacao_id: currentCongregacao.id,
        territorio_id: territorioId,
        territorio_nome: terrNome,
        dirigente_id: targetTerritorio?.dirigente_id,
        dirigente_nome: targetTerritorio?.dirigente_nome,
        publicador_id: targetUser.id,
        publicador_nome: targetUser.nome,
        data_designacao: today,
        status: 'ativa',
        observacoes,
      };
      setAllDesignacoesPublicador((prev) => [newDesig, ...prev]);
    }

    // Add notification
    setAllNotificacoes((prev) => [
      {
        id: `not-${Date.now()}`,
        congregacao_id: currentCongregacao.id,
        user_id: targetUserId,
        titulo: 'Território Designado',
        mensagem: `O ${terrNome} foi designado para você.`,
        data: new Date().toISOString(),
        lida: false,
        tipo: 'designacao',
      },
      ...prev,
    ]);
  };

  const revokeTerritorio = (territorioId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAllTerritorios((prev) =>
      prev.map((t) => {
        if (t.id !== territorioId) return t;
        return {
          ...t,
          status: 'disponivel',
          dirigente_id: undefined,
          dirigente_nome: undefined,
          publicador_id: undefined,
          publicador_nome: undefined,
          data_designacao: undefined,
        };
      })
    );

    setAllDesignacoesDirigente((prev) =>
      prev.map((d) =>
        d.territorio_id === territorioId && d.status === 'ativa'
          ? { ...d, status: 'encerrada', data_conclusao: today }
          : d
      )
    );

    setAllDesignacoesPublicador((prev) =>
      prev.map((d) =>
        d.territorio_id === territorioId && d.status === 'ativa'
          ? { ...d, status: 'encerrada', data_conclusao: today }
          : d
      )
    );
  };

  const completeTerritorio = (territorioId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAllTerritorios((prev) =>
      prev.map((t) => {
        if (t.id !== territorioId) return t;
        return {
          ...t,
          status: 'concluido',
          data_conclusao: today,
        };
      })
    );

    setAllDesignacoesDirigente((prev) =>
      prev.map((d) =>
        d.territorio_id === territorioId && d.status === 'ativa'
          ? { ...d, status: 'encerrada', data_conclusao: today }
          : d
      )
    );

    setAllDesignacoesPublicador((prev) =>
      prev.map((d) =>
        d.territorio_id === territorioId && d.status === 'ativa'
          ? { ...d, status: 'encerrada', data_conclusao: today }
          : d
      )
    );
  };

  const batchAssignTerritorios = (
    territorioIds: string[],
    targetUserId: string,
    targetType: 'dirigente' | 'publicador',
    observacoes?: string
  ) => {
    territorioIds.forEach((id) => {
      assignTerritorio(id, targetUserId, targetType, observacoes);
    });
  };

  // Enderecos Actions
  const addEndereco = (data: Omit<Endereco, 'id'>) => {
    const id = `e-${Date.now()}`;
    const newE: Endereco = {
      ...data,
      id,
      congregacao_id: currentCongregacao.id,
    };
    const updated = [...allEnderecos, newE];
    setAllEnderecos(updated);
    setAllTerritorios((prev) => syncTerritorioStats(prev, updated));
  };

  const updateEndereco = (id: string, data: Partial<Endereco>) => {
    const updated = allEnderecos.map((e) => (e.id === id ? { ...e, ...data } : e));
    setAllEnderecos(updated);
    setAllTerritorios((prev) => syncTerritorioStats(prev, updated));
  };

  const deleteEndereco = (id: string) => {
    const updated = allEnderecos.filter((e) => e.id !== id);
    setAllEnderecos(updated);
    setAllTerritorios((prev) => syncTerritorioStats(prev, updated));
  };

  const toggleConfirmEndereco = (id: string) => {
    const updated = allEnderecos.map((e) =>
      e.id === id ? { ...e, endereco_confirmado: !e.endereco_confirmado } : e
    );
    setAllEnderecos(updated);
  };

  // Visitas Actions
  const addVisita = (data: Omit<Visita, 'id' | 'data'>) => {
    const now = new Date().toISOString();
    const newV: Visita = {
      ...data,
      id: `v-${Date.now()}`,
      congregacao_id: currentCongregacao.id,
      data: now,
    };
    setAllVisitas((prev) => [newV, ...prev]);

    const updatedEnderecos = allEnderecos.map((e) => {
      if (e.id === data.endereco_id) {
        return {
          ...e,
          status: 'visitado' as const,
          ultimo_resultado: data.resultado,
          data_ultima_visita: now,
          moradores: data.moradores !== undefined ? data.moradores : e.moradores,
        };
      }
      return e;
    });
    setAllEnderecos(updatedEnderecos);

    setAllTerritorios((prev) => {
      const synced = syncTerritorioStats(prev, updatedEnderecos);
      return synced.map((t) => {
        if (
          t.id === data.territorio_id &&
          (t.status === 'designado_publicador' || t.status === 'designado_dirigente')
        ) {
          return { ...t, status: 'em_campo' };
        }
        return t;
      });
    });
  };

  const clearVisitasHistorico = () => {
    setAllVisitas((prev) => prev.filter((v) => (v.congregacao_id || 'cong-1') !== activeCongId));
  };

  const clearAllVisitasGeral = () => {
    setAllVisitas((prev) => prev.filter((v) => (v.congregacao_id || 'cong-1') !== activeCongId));
    setAllEnderecos((prev) =>
      prev.map((e) =>
        (e.congregacao_id || 'cong-1') === activeCongId
          ? {
              ...e,
              status: 'pendente',
              ultimo_resultado: undefined,
              data_ultima_visita: undefined,
            }
          : e
      )
    );
    setAllTerritorios((prev) =>
      prev.map((t) =>
        (t.congregacao_id || 'cong-1') === activeCongId
          ? {
              ...t,
              total_visitados: 0,
            }
          : t
      )
    );
  };

  // Programacao de Campo
  const addProgramacaoCampo = (data: Omit<ProgramacaoCampo, 'id'>) => {
    const newP: ProgramacaoCampo = {
      ...data,
      id: `pc-${Date.now()}`,
      congregacao_id: currentCongregacao.id,
    };
    setAllProgramacoesCampo((prev) => [...prev, newP]);
  };

  const deleteProgramacaoCampo = (id: string) => {
    setAllProgramacoesCampo((prev) => prev.filter((p) => p.id !== id));
  };

  // Programacao de Designacao
  const addProgramacaoDesignacao = (data: Omit<ProgramacaoDesignacao, 'id' | 'executada'>) => {
    const newPd: ProgramacaoDesignacao = {
      ...data,
      id: `pd-${Date.now()}`,
      congregacao_id: currentCongregacao.id,
      executada: false,
    };
    setAllProgramacoesDesignacao((prev) => [...prev, newPd]);
  };

  const deleteProgramacaoDesignacao = (id: string) => {
    setAllProgramacoesDesignacao((prev) => prev.filter((p) => p.id !== id));
  };

  // Campanhas
  const addCampanha = (data: Omit<Campanha, 'id'>) => {
    const newC: Campanha = {
      ...data,
      id: `c-${Date.now()}`,
      congregacao_id: currentCongregacao.id,
    };
    setAllCampanhas((prev) => [...prev, newC]);
  };

  const updateCampanha = (id: string, data: Partial<Campanha>) => {
    setAllCampanhas((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCampanha = (id: string) => {
    setAllCampanhas((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCampanhaAtiva = (id: string) => {
    setAllCampanhas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ativa: !c.ativa } : c))
    );
  };

  // Censo
  const addEnderecoCenso = (data: Omit<EnderecoCenso, 'id' | 'data_cadastro'>) => {
    const newC: EnderecoCenso = {
      ...data,
      id: `cen-${Date.now()}`,
      congregacao_id: currentCongregacao.id,
      data_cadastro: new Date().toISOString(),
    };
    setAllEnderecosCenso((prev) => [newC, ...prev]);
  };

  const updateEnderecoCenso = (id: string, data: Partial<EnderecoCenso>) => {
    setAllEnderecosCenso((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteEnderecoCenso = (id: string) => {
    setAllEnderecosCenso((prev) => prev.filter((c) => c.id !== id));
  };

  const convertCensoToEndereco = (censoId: string, territorioId: string) => {
    const censo = allEnderecosCenso.find((c) => c.id === censoId);
    const terr = allTerritorios.find((t) => t.id === territorioId);
    if (!censo || !terr) return;

    const newEnd: Endereco = {
      id: `e-${Date.now()}`,
      congregacao_id: currentCongregacao.id,
      territorio_id: terr.id,
      territorio_nome: terr.nome,
      rua: censo.rua,
      numero: censo.numero,
      complemento: censo.complemento,
      bairro: censo.bairro || terr.bairro,
      cidade: censo.cidade || terr.cidade,
      latitude: censo.latitude || terr.latitude,
      longitude: censo.longitude || terr.longitude,
      status: 'pendente',
      endereco_confirmado: true,
      observacoes: censo.observacoes,
      ativo: true,
    };

    const updated = [...allEnderecos, newEnd];
    setAllEnderecos(updated);
    setAllTerritorios((prev) => syncTerritorioStats(prev, updated));
    setAllEnderecosCenso((prev) =>
      prev.map((c) =>
        c.id === censoId
          ? {
              ...c,
              status: 'confirmado',
              territorio_id: terr.id,
              territorio_nome: terr.nome,
            }
          : c
      )
    );
  };

  // User Management
  const approveUser = (userId: string) => {
    setRawUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const code = u.codigo_acesso || generatePublisherCode(u.role);
          return { ...u, status: 'aprovado', codigo_acesso: code };
        }
        return u;
      })
    );
  };

  const rejectUser = (userId: string) => {
    setRawUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setRawUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const deactivateUser = (userId: string) => {
    setRawUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'desativado' } : u))
    );
  };

  const deleteUser = (userId: string) => {
    // Unassign territories currently assigned to this user
    setAllTerritorios((prev) =>
      prev.map((t) => {
        let changed = false;
        const newT = { ...t };
        if (t.dirigente_id === userId) {
          newT.dirigente_id = undefined;
          newT.dirigente_nome = undefined;
          if (newT.status === 'designado_dirigente') newT.status = 'disponivel';
          changed = true;
        }
        if (t.publicador_id === userId) {
          newT.publicador_id = undefined;
          newT.publicador_nome = undefined;
          if (newT.status === 'designado_publicador' || newT.status === 'em_campo') {
            newT.status = 'disponivel';
          }
          changed = true;
        }
        return changed ? newT : t;
      })
    );

    // Remove user
    setRawUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const deleteUserPermanently = deleteUser;

  // Notifications
  const markAllNotificacoesRead = () => {
    setAllNotificacoes((prev) =>
      prev.map((n) =>
        (n.congregacao_id || 'cong-1') === activeCongId && n.user_id === currentUser.id
          ? { ...n, lida: true }
          : n
      )
    );
  };

  const sendTestNotification = () => {
    const newN: Notificacao = {
      id: `not-${Date.now()}`,
      congregacao_id: currentCongregacao.id,
      user_id: currentUser.id,
      titulo: 'Notificação de teste',
      mensagem: 'Seu sistema de notificações está funcionando corretamente.',
      data: new Date().toISOString(),
      lida: false,
      tipo: 'sistema',
    };
    setAllNotificacoes((prev) => [newN, ...prev]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setCongregacoes([INITIAL_CONGREGACAO]);
    setCurrentCongregacaoId(INITIAL_CONGREGACAO.id);
    setRawUsers(INITIAL_USERS);
    setCurrentUserState(INITIAL_USERS[0]);
    setIsAuthenticated(true);
    setAllTerritorios(INITIAL_TERRITORIOS);
    setAllEnderecos(INITIAL_ENDERECOS);
    setAllVisitas(INITIAL_VISITAS);
    setAllDesignacoesDirigente(INITIAL_DESIGNACOES_DIRIGENTE);
    setAllDesignacoesPublicador(INITIAL_DESIGNACOES_PUBLICADOR);
    setAllProgramacoesCampo(INITIAL_PROGRAMACOES_CAMPO);
    setAllProgramacoesDesignacao([]);
    setAllCampanhas(INITIAL_CAMPANHAS);
    setAllEnderecosCenso(INITIAL_ENDERECOS_CENSO);
    setAllNotificacoes(INITIAL_NOTIFICACOES);
    setSelectedTerritorioId(null);
    setActiveTab('painel');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        switchUserRole,
        congregacoes,
        currentCongregacao,
        setCurrentCongregacao,
        switchCongregacao,
        registerCongregacao,
        registerPublisher,
        loginWithCode,
        logout,
        regenerateUserCode,
        allUsers: rawUsers,
        users,
        territorios,
        enderecos,
        visitas,
        designacoesDirigente,
        designacoesPublicador,
        programacoesCampo,
        programacoesDesignacao,
        campanhas,
        enderecosCenso,
        notificacoes,
        activeTab,
        setActiveTab,
        selectedTerritorioId,
        setSelectedTerritorioId,
        addTerritorio,
        updateTerritorio,
        deleteTerritorio,
        assignTerritorio,
        revokeTerritorio,
        completeTerritorio,
        batchAssignTerritorios,
        addEndereco,
        updateEndereco,
        deleteEndereco,
        toggleConfirmEndereco,
        addVisita,
        clearVisitasHistorico,
        clearAllVisitasGeral,
        addProgramacaoCampo,
        deleteProgramacaoCampo,
        addProgramacaoDesignacao,
        deleteProgramacaoDesignacao,
        addCampanha,
        updateCampanha,
        deleteCampanha,
        toggleCampanhaAtiva,
        addEnderecoCenso,
        updateEnderecoCenso,
        deleteEnderecoCenso,
        convertCensoToEndereco,
        approveUser,
        rejectUser,
        updateUserRole,
        deactivateUser,
        deleteUser,
        deleteUserPermanently,
        markAllNotificacoesRead,
        sendTestNotification,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
