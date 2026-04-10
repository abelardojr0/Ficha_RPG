import { PODERES_ESPADAS } from "./powers-espadas";
import { PODERES_OUROS } from "./powers-ouros";
import { PODERES_PAUS } from "./powers-paus";
import { PODERES_COPAS } from "./powers-copas";
export type NaipePoder = "Espadas" | "Ouros" | "Paus" | "Copas";

export type PowerAction =
  | "Padrao"
  | "Movimento"
  | "Livre"
  | "Reacao"
  | "Nenhuma";

export type PowerRange =
  | "Pessoal"
  | "Toque"
  | "Corpo a Corpo"
  | "Perto"
  | "Distancia"
  | "A Distancia"
  | "Area"
  | "Percepcao"
  | "Graduacao";

export type PowerDuration =
  | "Instantanea"
  | "Instantaneo"
  | "Sustentado"
  | "Continuo"
  | "Temporaria"
  | "Permanente"
  | "Variavel";

export type PowerModifier = {
  nome: string;
  custo: string;
  descricao?: string;
};

export type PowerDetailSection = {
  titulo: string;
  descricao?: string[];
  itens?: string[];
};

export type PowerDetailTable = {
  titulo: string;
  colunas: string[];
  linhas: string[][];
};

export type PowerDetails = {
  introducao: string[];
  secoes: PowerDetailSection[];
  tabelas?: PowerDetailTable[];
};

export type PowerDefinition = {
  id: string;
  nome: string;
  naipe: NaipePoder;
  tipo: string;
  acao: PowerAction;
  alcance: PowerRange;
  duracao: PowerDuration;
  custoPontosPorGraduacao: number | null;
  custoPontosTexto: string;
  custoEterBase: string;
  extras: PowerModifier[];
  falhas: PowerModifier[];
  resumo?: string;
  efeitoPrincipal?: string;
  detalhes?: PowerDetails;
  observacoes?: string;
};

export const MAX_POWER_GRADUATION_LIMIT = 11;
export const MAX_POWER_GRADUATION_RULE = `${MAX_POWER_GRADUATION_LIMIT}`;

// Regra recomendada para custo de eter dinamico por graduacao.
export const getEterCostByGraduacao = (graduacao: number): number =>
  Math.ceil(Math.max(1, graduacao) / 2);



export const PODERES_POR_NAIPE: Record<NaipePoder, PowerDefinition[]> = {
  Espadas: PODERES_ESPADAS,
  Ouros: PODERES_OUROS,
  Paus: PODERES_PAUS,
  Copas: PODERES_COPAS,
};


