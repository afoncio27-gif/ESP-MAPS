export type UserRole = 'ADM' | 'DIRIGENTE' | 'PUBLICADOR';

export interface Congregacao {
  id: string;
  nome: string;
  cidade: string;
  estado?: string;
  idioma: string;
  codigo_congregação: string;
  criada_em: string;
  criada_por_nome: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  status: 'aprovado' | 'pendente' | 'desativado';
  telefone?: string;
  criado_em: string;
  avatar?: string;
  congregacao_id: string;
  codigo_acesso: string;
}

export type TerritorioStatus = 
  | 'disponivel'
  | 'designado_dirigente'
  | 'designado_publicador'
  | 'em_campo'
  | 'concluido';

export interface Territorio {
  id: string;
  congregacao_id?: string;
  numero: string;
  nome: string;
  cidade: string;
  bairro: string;
  descricao?: string;
  latitude: number;
  longitude: number;
  status: TerritorioStatus;
  dirigente_id?: string;
  dirigente_nome?: string;
  publicador_id?: string;
  publicador_nome?: string;
  data_designacao?: string;
  data_conclusao?: string;
  total_enderecos: number;
  total_visitados: number;
}

export type EnderecoStatus = 'pendente' | 'visitado';

export interface Endereco {
  id: string;
  congregacao_id?: string;
  territorio_id: string;
  territorio_nome: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  latitude: number;
  longitude: number;
  status: EnderecoStatus;
  endereco_confirmado: boolean;
  observacoes?: string;
  ativo: boolean;
  ultimo_resultado?: VisitaResultado;
  data_ultima_visita?: string;
  moradores?: number;
}

export type VisitaResultado = 
  | 'visitado'
  | 'revisita'
  | 'estudo_biblico'
  | 'morador_ausente'
  | 'mudou_se'
  | 'nao_visitar';

export interface Visita {
  id: string;
  congregacao_id?: string;
  endereco_id: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  territorio_id: string;
  territorio_nome: string;
  publicador_id: string;
  publicador_nome: string;
  resultado: VisitaResultado;
  estrangeiro: boolean;
  moradores?: number;
  convidado_campanha: boolean;
  campanha_id?: string;
  observacoes?: string;
  data: string; // ISO date string
}

export interface DesignacaoDirigente {
  id: string;
  congregacao_id?: string;
  territorio_id: string;
  territorio_nome: string;
  dirigente_id: string;
  dirigente_nome: string;
  data_designacao: string;
  data_conclusao?: string;
  status: 'ativa' | 'encerrada' | 'programada';
  observacoes?: string;
}

export interface DesignacaoPublicador {
  id: string;
  congregacao_id?: string;
  territorio_id: string;
  territorio_nome: string;
  dirigente_id?: string;
  dirigente_nome?: string;
  publicador_id: string;
  publicador_nome: string;
  data_designacao: string;
  data_conclusao?: string;
  status: 'ativa' | 'encerrada';
  observacoes?: string;
}

export interface ProgramacaoCampo {
  id: string;
  congregacao_id?: string;
  data: string;
  hora: string;
  local: string;
  idioma: string;
  descricao?: string;
  dirigente_id?: string;
  dirigente_nome: string;
}

export interface ProgramacaoDesignacao {
  id: string;
  congregacao_id?: string;
  data: string;
  hora: string;
  dirigente_id: string;
  dirigente_nome: string;
  territorios_ids: string[];
  observacoes?: string;
  executada: boolean;
}

export interface Campanha {
  id: string;
  congregacao_id?: string;
  nome: string;
  inicio: string;
  fim: string;
  ativa: boolean;
  descricao?: string;
}

export interface EnderecoCenso {
  id: string;
  congregacao_id?: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  latitude?: number;
  longitude?: number;
  territorio_id?: string;
  territorio_nome?: string;
  status: 'pendente' | 'confirmado';
  observacoes?: string;
  cadastrado_por: string;
  data_cadastro: string;
}

export interface Notificacao {
  id: string;
  congregacao_id?: string;
  user_id: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  tipo: 'designacao' | 'sistema' | 'aprovacao' | 'aviso';
}

export type ActiveTab =
  | 'painel'
  | 'territorios'
  | 'meus-territorios'
  | 'designacoes'
  | 'enderecos'
  | 'censo'
  | 'mapa-geral'
  | 'visitas'
  | 'programacao-campo'
  | 'publicadores'
  | 'dirigentes'
  | 'programar'
  | 'relatorios'
  | 'campanhas'
  | 'aprovacoes'
  | 'configuracoes';
