import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaWeightHanging } from "react-icons/fa6";
import { GiRollingEnergy, GiWalkingBoot, GiScrollQuill } from "react-icons/gi";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { IoMdHeartHalf } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import {
  getEterCostByGraduacao,
  PODERES_POR_NAIPE,
  type NaipePoder,
  type PowerDefinition,
} from "./data/powers";
import logoImage from "./assets/logo.png";
import "./App.css";

type Dice = "D4" | "D6" | "D8" | "D10" | "D12";
type CombatDice = "-" | Dice;
const EQUIP_BONUS_LIMIT = 2;

const getMaxPositiveBonus = (value: string): number => {
  const matches = value.match(/\+\d+/g);
  if (!matches) {
    return 0;
  }

  return matches.reduce((max, token) => {
    const parsed = Number.parseInt(token.replace("+", ""), 10);
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);
};

const reachesEquipmentCap = (value: string): boolean =>
  getMaxPositiveBonus(value) >= EQUIP_BONUS_LIMIT;

const getAcessoBadgeClass = (acesso: string): string => {
  switch (acesso) {
    case "Comum":
      return "acesso-comum";
    case "Avancado":
      return "acesso-avancado";
    case "Raro":
      return "acesso-raro";
    case "Especial":
      return "acesso-especial";
    default:
      return "acesso-comum";
  }
};
type Naipe = "Espadas" | "Ouros" | "Paus" | "Copas" | "";
type VantagemCategoria = "Combate" | "Pericia" | "Sorte" | "Geral" | "Eter";
type DesvantagemCategoria =
  | "Combate"
  | "Eter"
  | "Comportamental"
  | "Fisica"
  | "Psicologica"
  | "Condicao";
type DesvantagemNivel = "Leve" | "Moderada" | "Severa";
type ResistancePowerSource =
  | ""
  | "Protecao"
  | "Campo de Forca"
  | "Blindagem"
  | "Conversao";

type Atributo =
  | "Forca"
  | "Agilidade"
  | "Tecnica"
  | "Intelecto"
  | "Presenca"
  | "Vontade"
  | "Constituicao";

type CharacterAdvantage = {
  id: string;
  catalogId: string;
  nome: string;
  categoria: VantagemCategoria;
  graduacao: number;
  temGraduacao: boolean;
  custoPorGraduacao: number;
  resumo: string;
  efeito: string;
};

type AdvantageDefinition = {
  id: string;
  nome: string;
  categoria: VantagemCategoria;
  temGraduacao: boolean;
  custoPorGraduacao: number;
  resumo: string;
  efeito: string;
};

type CharacterDisadvantage = {
  id: string;
  catalogId: string;
  nome: string;
  categoria: DesvantagemCategoria;
  nivel: DesvantagemNivel;
  graduacao: number;
  temGraduacao: boolean;
  ppPorGraduacao: number;
  resumo: string;
  efeito: string;
};

type DisadvantageDefinition = {
  id: string;
  nome: string;
  categoria: DesvantagemCategoria;
  nivel: DesvantagemNivel;
  temGraduacao: boolean;
  ppPorGraduacao: number;
  resumo: string;
  efeito: string;
};

type BasicTechniqueDefinition = {
  nome: string;
  tipo: string;
  custoPPPorGraduacao: number;
  acao: string;
  duracao: string;
  basePE: number;
  descricao: string;
  limitacoes: string;
};

type DevelopedTechniqueType = "Primaria" | "Avancada" | "Especial";

type DevelopedTechniqueBasePower = {
  id: string;
  powerId: string;
  graduacao: string;
};

type DevelopedTechniqueModifierSet = {
  bonusDano: string;
  bonusPrecisao: string;
  penetracao: string;
  danoAmpliado: string;
  ataqueMultiplo: "1" | "2" | "3";
  area: "" | "3m" | "5m" | "10m";
  controleNivel: "" | "Leve" | "Moderado" | "Forte";
  controleEstado: string;
  controleAtributoResistencia: "Forca" | "Agilidade" | "Vontade";
  alcanceEtapas: "0" | "1" | "2" | "3" | "4";
  duracao: "" | "Sustentada" | "Continua";
  duracaoEstendida: boolean;
  ativacaoRapida: "" | "Livre" | "Reacao";
  preparacao: "" | "preparacao" | "turno-completo";
  bonusDefesa: string;
  reducaoDanoRecebido: string;
  absorcao: boolean;
  reflexo: boolean;
  limitacaoPerdeMovimento: boolean;
  limitacaoCondicaoEspecifica: boolean;
  limitacaoContatoDireto: boolean;
  limitacaoAlvoEspecifico: boolean;
  limitacaoUsoCena: boolean;
  modificadorPersonalizadoNome: string;
  modificadorPersonalizadoCusto: string;
};

type DevelopedTechnique = {
  id: string;
  nome: string;
  tipo: DevelopedTechniqueType;
  conceito: string;
  efeito: string;
  acao: string;
  alcance: string;
  alvo: string;
  duracao: string;
  gatilho: string;
  poderesBase: DevelopedTechniqueBasePower[];
  modificadores: DevelopedTechniqueModifierSet;
  custoBasePE: number;
  custoModificadoresPE: number;
  reducoesPE: number;
  custoFinalPE: number;
  limiteAdicionalPE: number;
  adicionalAplicadoPE: number;
  maiorGraduacaoBase: number;
  bonusDiretoAplicado: number;
  createdAt: string;
};

type DevelopedTechniqueDraft = {
  nome: string;
  tipo: DevelopedTechniqueType;
  conceito: string;
  efeito: string;
  acao: string;
  alcance: string;
  alvo: string;
  duracao: string;
  gatilho: string;
  poderesBase: DevelopedTechniqueBasePower[];
  modificadores: DevelopedTechniqueModifierSet;
};

type EquipmentEra = "Medieval" | "Moderno" | "Futurista";
type EquipmentKind = "Armas" | "Protecoes" | "Utilitarios";

type EquipmentWeaponEntry = {
  nome: string;
  subcategoria: string;
  tipo: string;
  alcance: string;
  dano: string;
  acerto: string;
  efeito: string;
  peso: string;
  acesso: string;
};

type EquipmentProtectionEntry = {
  nome: string;
  subcategoria: string;
  tipo: string;
  resistencia: string;
  defesa: string;
  efeito: string;
  penalidade: string;
  peso: string;
  acesso: string;
};

type EquipmentUtilityEntry = {
  nome: string;
  subcategoria: string;
  tipo: string;
  efeito: string;
  limite: string;
  peso: string;
  acesso: string;
};

type CharacterPower = {
  id: string;
  powerId: string;
  graduacao: string;
  extrasSelecionados: string[];
  falhasSelecionadas: string[];
};

type ConhecimentoEntry = {
  area: string;
  graduacoes: string;
};

type CharacterSheet = {
  id: string;
  nome: string;
  grupo?: string;
  imagemUrl?: string;
  imagemViewUrl?: string;
  nivel: string;
  jogador: string;
  xp: string;
  conceito: string;
  naipe: Naipe;
  carga: string;
  mov: string;
  periciasExtra: string;
  atributos: Record<Atributo, Dice>;
  combate: {
    ataqueCac: CombatDice;
    disparo: CombatDice;
    resistenciaPoderFonte: ResistancePowerSource;
    defesa: string;
  };
  pericias: Record<string, string>;
  conhecimentos: ConhecimentoEntry[];
  tecnicasBasicas: Record<string, { graduacao: string }>;
  vantagens: CharacterAdvantage[];
  desvantagens: CharacterDisadvantage[];
  poderes: CharacterPower[];
  tecnicasDesenvolvidas: DevelopedTechnique[];
  equipamentos: string;
  parentId?: string;
  localSaved?: boolean;
};

type EditorTabId =
  | "identidade"
  | "base"
  | "pericias"
  | "tecnicas"
  | "tecnicas-desenvolvimento"
  | "vantagens"
  | "desvantagens"
  | "poderes"
  | "equipamentos";

type EditorTabDefinition = {
  id: EditorTabId;
  label: string;
  descricao: string;
};

type SheetSummary = {
  id: string;
  nome: string;
  grupo?: string;
  imagemUrl?: string;
  imagemViewUrl?: string;
  imageUrl?: string;
  fotoUrl?: string;
  nivel: string;
  jogador: string;
  updatedAt: string;
};

type GroupAttachment = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  createdAt?: string;
  file?: File;
};

type GroupRecord = {
  id: string;
  key: string;
  name: string;
  description: string;
  hasPassword: boolean;
  imageUrl: string;
  sheetCount: number;
  attachmentCount: number;
  attachments: GroupAttachment[];
};

type GroupApiSummary = {
  id?: string;
  nome?: string;
  name?: string;
  descricao?: string;
  description?: string;
  hasPassword?: boolean;
  imagemUrl?: string;
  imagemViewUrl?: string;
  imageUrl?: string;
  fotoUrl?: string;
  sheetCount?: number;
  attachmentCount?: number;
};

type GroupFileApiSummary = {
  id?: string;
  nome?: string;
  mimeType?: string;
  tamanhoBytes?: number;
  url?: string;
  createdAt?: string;
};

const getSheetPreviewImageUrl = (sheet: SheetSummary) =>
  sheet.imagemViewUrl ||
  sheet.imagemUrl ||
  sheet.imageUrl ||
  sheet.fotoUrl ||
  "";

type PendingConfirmation = {
  title: string;
  message: string;
  confirmLabel: string;
  variant?: "default" | "danger";
  action:
    | { type: "apply-pretipo"; pretipoId: string }
    | { type: "delete-character"; characterId: string }
    | { type: "reset-principal"; characterId: string };
};

const TOTAL_PP = 180;
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "https://ficha-rpg-server.onrender.com/api"
).replace(/\/$/, "");
const HOME_ROUTE = "/";
const CREATE_SHEET_ROUTE = "/criar-ficha";
const QUICK_SHEET_ROUTE = "/ficha-rapida";
const SHEET_PASSWORD_MIN_LENGTH = 4;
const CHARACTER_DRAFT_STORAGE_KEY = "ficha-rpg:editor-draft:v1";

type LocalDraftPayload = {
  characters: CharacterSheet[];
  selectedId: string;
  activeSheetId: string | null;
  activeEditorTab: EditorTabId;
  poderesPanelAtivo: "catalogo" | "arsenal";
  naipePoderSelecionado: NaipePoder;
  catalogoSearch: string;
  catalogoFiltroAcao: string;
  catalogoFiltroDuracao: string;
  catalogoFiltroTipo: string;
  equipamentosEra: EquipmentEra;
  equipamentosTipo: EquipmentKind;
  equipamentosSubcategoria: string;
  fichaGeradaPagina: 1 | 2;
  tecnicaDraft: DevelopedTechniqueDraft;
  vantagemCategoriaSelecionada: VantagemCategoria | "";
  vantagemSelecionadaId: string;
  vantagemGraduacao: string;
  desvantagemCategoriaSelecionada: DesvantagemCategoria | "";
  desvantagemSelecionadaId: string;
  desvantagemGraduacao: string;
  pretipoSelecionado: string;
};

const getCharacterPrincipalId = (character: CharacterSheet): string =>
  character.parentId ?? character.id;

const normalizeGroupKey = (value: string): string => value.trim();

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

const isApiImageUrl = (value: unknown): boolean =>
  typeof value === "string" &&
  (value.includes("/api/sheets/") || value.includes("/uploads/"));

// Get the image URL suitable for displaying in <img src>
// Prefers imagemViewUrl (display URL) if available, falls back to imagemUrl (base64)
const getCharacterImageForDisplay = (
  character: CharacterSheet | null,
): string => {
  if (!character) return "";
  return character.imagemViewUrl || character.imagemUrl || "";
};

const readDraftFromLocalStorage = (): LocalDraftPayload | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CHARACTER_DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<LocalDraftPayload>;
    if (!parsed || !Array.isArray(parsed.characters) || !parsed.selectedId) {
      return null;
    }

    return parsed as LocalDraftPayload;
  } catch {
    return null;
  }
};

const removeDraftGroupFromLocalStorage = (principalId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const existingDraft = readDraftFromLocalStorage();
  if (!existingDraft) {
    return;
  }

  const remainingCharacters = existingDraft.characters.filter(
    (character) => getCharacterPrincipalId(character) !== principalId,
  );

  if (remainingCharacters.length === 0) {
    window.localStorage.removeItem(CHARACTER_DRAFT_STORAGE_KEY);
    return;
  }

  const nextSelectedId = remainingCharacters.some(
    (character) => character.id === existingDraft.selectedId,
  )
    ? existingDraft.selectedId
    : remainingCharacters[0].id;

  window.localStorage.setItem(
    CHARACTER_DRAFT_STORAGE_KEY,
    JSON.stringify({
      ...existingDraft,
      characters: remainingCharacters,
      selectedId: nextSelectedId,
      activeSheetId:
        existingDraft.activeSheetId === principalId
          ? getCharacterPrincipalId(remainingCharacters[0])
          : existingDraft.activeSheetId,
    } satisfies LocalDraftPayload),
  );
};

type AppScreen = "home" | "editor" | "quick-sheet" | "group";

const getScreenFromPathname = (pathname: string): AppScreen => {
  if (pathname === CREATE_SHEET_ROUTE) {
    return "editor";
  }

  if (pathname === QUICK_SHEET_ROUTE) {
    return "quick-sheet";
  }

  return "home";
};

const ATRIBUTOS = [
  "Forca",
  "Agilidade",
  "Tecnica",
  "Intelecto",
  "Presenca",
  "Vontade",
  "Constituicao",
] as const satisfies readonly Atributo[];

const ATRIBUTO_SIGLA: Record<Atributo, string> = {
  Forca: "FOR",
  Agilidade: "AGI",
  Tecnica: "TEC",
  Intelecto: "INT",
  Presenca: "PRE",
  Vontade: "VON",
  Constituicao: "CON",
};

const PERICIAS = [
  "Acrobacia",
  "Analise de Eter",
  "Atletismo",
  "Concentracao",
  "Enganar",
  "Expressao",
  "Furtividade",
  "Intimidacao",
  "Intuicao",
  "Investigacao",
  "Ladinagem",
  "Medicina",
  "Percepcao",
  "Persuasao",
  "Sobrevivencia",
] as const;

const VANTAGEM_CATEGORIAS: VantagemCategoria[] = [
  "Combate",
  "Pericia",
  "Sorte",
  "Geral",
  "Eter",
];

const DESVANTAGEM_CATEGORIAS: DesvantagemCategoria[] = [
  "Combate",
  "Eter",
  "Comportamental",
  "Fisica",
  "Psicologica",
  "Condicao",
];

const DESVANTAGEM_PP_POR_NIVEL: Record<DesvantagemNivel, number> = {
  Leve: 1,
  Moderada: 2,
  Severa: 4,
};

const DESVANTAGENS_MAX_PP = 10;
const DESVANTAGENS_MAX_SEVERAS = 2;
const DESVANTAGENS_MAX_LEVES = 6;

const VANTAGENS_CATALOGO: AdvantageDefinition[] = [
  {
    id: "acao-em-movimento",
    nome: "Acao em Movimento",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Divide deslocamento antes e depois de atacar.",
    efeito: "Permite dividir o deslocamento antes e depois de atacar.",
  },
  {
    id: "ataque-poderoso",
    nome: "Ataque Poderoso",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 4,
    resumo: "-3 no ataque para +3 no dano.",
    efeito:
      "Sofre -3 no ataque para receber +3 no dano. Declarar antes da rolagem, 1 vez por turno.",
  },
  {
    id: "ataque-defensivo",
    nome: "Ataque Defensivo",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "-3 no ataque para +3 em Defesa contra o proximo ataque.",
    efeito:
      "Sofre -3 no ataque para receber +3 em Defesa contra o proximo ataque.",
  },
  {
    id: "ataque-imprudente",
    nome: "Ataque Imprudente",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "-3 em Defesa para +3 no ataque.",
    efeito: "Sofre -3 em Defesa para receber +3 no ataque.",
  },
  {
    id: "critico-aprimorado",
    nome: "Critico Aprimorado",
    categoria: "Combate",
    temGraduacao: true,
    custoPorGraduacao: 4,
    resumo: "+1 no alcance critico por graduacao (max 3 grads, ate 17-20).",
    efeito:
      "Aumenta alcance critico em +1 por graduacao. Limite de 3 graduacoes (alcance 17-20).",
  },
  {
    id: "acuidade",
    nome: "Acuidade",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Usa Agilidade no lugar de Forca para dano com armas leves.",
    efeito:
      "Permite usar Agilidade no lugar de Forca para dano com armas leves.",
  },
  {
    id: "iniciativa-aprimorada",
    nome: "Iniciativa Aprimorada",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 5,
    resumo: "Compra duas cartas de iniciativa e escolhe uma.",
    efeito: "Compra duas cartas de iniciativa e escolhe uma.",
  },
  {
    id: "ataque-domino",
    nome: "Ataque Domino",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Apos derrotar um inimigo, ataca outro adjacente (1 vez por turno).",
    efeito:
      "Apos derrotar um inimigo, pode atacar outro adjacente (1 vez por turno).",
  },
  {
    id: "mira-aprimorada",
    nome: "Mira Aprimorada",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo:
      "Usa acao de movimento com acao principal para Disparo com +3 sem se deslocar.",
    efeito:
      "Usa acao de movimento com acao principal para realizar Disparo com +3, sem qualquer deslocamento no turno. Declarar antes da rolagem.",
  },
  {
    id: "defesa-aprimorada",
    nome: "Defesa Aprimorada",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Usa acao de movimento com acao principal para +3 em Defesa sem atacar ou se deslocar.",
    efeito:
      "Usa acao de movimento com acao principal para +3 em Defesa ate o proximo turno, sem atacar ou se deslocar no turno.",
  },
  {
    id: "luta-no-chao",
    nome: "Luta no Chao",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Nao sofre penalidades ao lutar caido.",
    efeito: "Nao sofre penalidades por lutar caido.",
  },
  {
    id: "ataque-preciso",
    nome: "Ataque Preciso",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Ignora cobertura leve e camuflagem.",
    efeito: "Ignora penalidades de cobertura ou camuflagem leve.",
  },
  {
    id: "arma-improvisada",
    nome: "Arma Improvisada",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Objetos improvisados sem penalidade e com dano adequado.",
    efeito:
      "Objetos improvisados nao sofrem penalidade e causam dano adequado.",
  },
  {
    id: "maestria-em-arremesso",
    nome: "Maestria em Arremesso",
    categoria: "Combate",
    temGraduacao: true,
    custoPorGraduacao: 2,
    resumo:
      "+1 no ataque com armas arremessadas por graduacao; com 2+ grads ignora penalidades leves de alcance (max 3 grads).",
    efeito:
      "+1 no teste de ataque com armas arremessadas por graduacao. Com 2+ grads, ignora penalidades leves de alcance. Limite: 3 graduacoes.",
  },
  {
    id: "prender-arma",
    nome: "Prender Arma",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Pode tentar desarmar inimigo que falhe CaC.",
    efeito: "Pode tentar desarmar inimigo que falhe ataque corpo a corpo.",
  },
  {
    id: "redirecionar",
    nome: "Redirecionar",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 6,
    resumo:
      "Quando inimigo falha ataque CaC por 5+, redireciona para outro alvo adjacente (1 vez por turno).",
    efeito:
      "Quando inimigo falha ataque CaC por 5+, pode como reacao redirecionar para outro alvo adjacente. Realiza teste CaC contra Defesa do novo alvo. 1 vez por turno.",
  },
  {
    id: "maestria-em-pericia",
    nome: "Maestria em Pericia",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Permite escolher 10 em testes mesmo sob pressao.",
    efeito: "Permite testes de rotina mesmo sob pressao.",
  },
  {
    id: "contatos",
    nome: "Contatos",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "+2 em investigacoes sociais e menos tempo para informacoes.",
    efeito:
      "Concede +2 em investigacoes sociais e reduz tempo para obter informacoes.",
  },
  {
    id: "bem-informado",
    nome: "Bem Informado",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo:
      "Permite obter informacoes relevantes sobre pessoas e organizacoes.",
    efeito:
      "Permite obter informacoes relevantes ao encontrar pessoas ou organizacoes.",
  },
  {
    id: "rastreador",
    nome: "Rastreador",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Usa Percepcao para rastrear com +2 e ignora penalidades leves.",
    efeito:
      "Permite usar Percepcao para rastrear com +2 e ignorar penalidades leves.",
  },
  {
    id: "finta-agil",
    nome: "Finta Agil",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Permite usar Acrobacia para fintar em combate.",
    efeito:
      "Permite usar Acrobacia no lugar de Enganacao para fintas em combate.",
  },
  {
    id: "assustar",
    nome: "Assustar",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Permite usar Intimidacao para fintas em combate.",
    efeito: "Permite usar Intimidacao para realizar fintas em combate.",
  },
  {
    id: "faz-tudo",
    nome: "Faz-Tudo",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Usa pericias sem treinamento sem penalidade.",
    efeito: "Permite usar pericias sem treinamento sem sofrer penalidade.",
  },
  {
    id: "ferramentas-improvisadas",
    nome: "Ferramentas Improvisadas",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Ignora falta de ferramentas e recebe +1 em testes tecnicos.",
    efeito:
      "Ignora penalidades por falta de ferramentas e recebe +1 em testes tecnicos.",
  },
  {
    id: "idiomas",
    nome: "Idiomas",
    categoria: "Pericia",
    temGraduacao: true,
    custoPorGraduacao: 1,
    resumo: "Cada graduacao concede um idioma adicional.",
    efeito: "Cada graduacao concede um idioma adicional.",
  },
  {
    id: "inventor",
    nome: "Inventor",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Permite criar dispositivos tecnologicos temporarios.",
    efeito: "Permite criar dispositivos tecnologicos temporarios.",
  },
  {
    id: "empatia-com-animais",
    nome: "Empatia com Animais",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Permite interacao social com animais via Persuasao ou Intuicao.",
    efeito:
      "Permite interacao social com animais usando Persuasao ou Intuicao.",
  },
  {
    id: "tontear",
    nome: "Tontear",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Presenca vs Vontade: sucesso causa -2 em testes do alvo ate 2 turnos (1 vez por cena).",
    efeito:
      "Teste de Presenca (Intimidacao ou Enganacao) vs Vontade: sucesso causa -2 nos testes do alvo ate o fim do proximo turno. Sucesso por 5+ estende por mais 1 turno. 1 vez por cena.",
  },
  {
    id: "presenca-marcante",
    nome: "Presenca Marcante",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo:
      "+2 em Persuasao ou Enganacao quando aparencia pode influenciar o alvo.",
    efeito:
      "+2 em Persuasao ou Enganacao em interacoes sociais onde a aparencia influencia o alvo. Nao se aplica a interacoes hostis ja estabelecidas.",
  },
  {
    id: "sorte",
    nome: "Acaso",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "+1 Pedra de Eter Menor adicional no inicio de cada sessao.",
    efeito:
      "+1 Pedra de Eter Menor adicional no inicio de cada sessao. A pedra segue as regras normais de uso e nao se acumula entre sessoes.",
  },
  {
    id: "esforco-supremo",
    nome: "Esforco Supremo",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 5,
    resumo:
      "Gasta 1 Pedra de Eter para +5/+8/+10 em um teste conforme tipo (1 vez por cena).",
    efeito:
      "Gasta 1 Pedra de Eter para bonus em um teste: Menor +5, Maior +8, Rara +10. Declarar apos rolagem, antes do resultado. 1 vez por cena.",
  },
  {
    id: "tomar-a-iniciativa",
    nome: "Tomar a Iniciativa",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Descarta carta de iniciativa abaixo de 5 e compra outra.",
    efeito: "Pode trocar carta de iniciativa abaixo de 5.",
  },
  {
    id: "inspirar",
    nome: "Inspirar",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Gasta 1 Pedra de Eter para conceder +2 em teste de um aliado antes da rolagem.",
    efeito:
      "Gasta 1 Pedra de Eter para conceder +2 em um teste de um aliado antes da rolagem. 1 vez por turno.",
  },
  {
    id: "fluxo-favoravel",
    nome: "Fluxo Favoravel",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Pedras de Eter com bonus numerico concedem valor adicional: Menor +1, Maior +2, Rara +2.",
    efeito:
      "Ao usar Pedra de Eter com bonus numerico direto, recebe adicional: Menor +1, Maior +2, Rara +2. Aplica-se 1 vez por uso.",
  },
  {
    id: "dupla-oportunidade",
    nome: "Dupla Oportunidade",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 4,
    resumo:
      "Uma vez por cena, aplica dois efeitos de uma Pedra Menor na mesma acao.",
    efeito:
      "Uma vez por cena, ao usar Pedra de Eter Menor, pode aplicar dois efeitos distintos dela na mesma acao ou momento. Nao pode repetir o mesmo efeito.",
  },
  {
    id: "beneficio",
    nome: "Beneficio",
    categoria: "Geral",
    temGraduacao: true,
    custoPorGraduacao: 2,
    resumo: "Concede recurso narrativo ou social definido com o mestre.",
    efeito: "Concede recurso narrativo ou social definido com o mestre.",
  },
  {
    id: "memoria-eidetica",
    nome: "Memoria Eidetica",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "+2 em testes para lembrar, reconhecer ou reconstruir informacoes.",
    efeito:
      "+2 em testes para lembrar, reconhecer ou reconstruir informacoes. Sucesso pode fornecer detalhes adicionais.",
  },
  {
    id: "destemido",
    nome: "Destemido",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "+2 contra medo, intimidacao e pressao psicologica.",
    efeito:
      "+2 em testes contra medo, intimidacao ou pressao psicologica. Sucesso por 5+ ignora efeitos secundarios leves associados.",
  },
  {
    id: "duro-de-matar",
    nome: "Duro de Matar",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 4,
    resumo:
      "Ao chegar a 0 PV, permanece consciente ate o fim do proximo turno (1 vez por cena).",
    efeito:
      "Ao atingir 0 PV, permanece consciente e funcional ate o fim do proximo turno. Fica inconsciente se nao estabilizado. Nao evita morte imediata. 1 vez por cena.",
  },
  {
    id: "interpor-se",
    nome: "Interpor-se",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Pode receber um ataque no lugar de um aliado (1 vez por rodada).",
    efeito: "Pode receber um ataque no lugar de um aliado (1 vez por rodada).",
  },
  {
    id: "lideranca",
    nome: "Lideranca",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Remove condicao negativa leve de um aliado (1 vez por cena).",
    efeito: "Remove condicao negativa leve de um aliado (1 vez por cena).",
  },
  {
    id: "trabalho-em-equipe",
    nome: "Sinergia",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Concede +2 ao aliado ao ajudar em testes de equipe.",
    efeito:
      "Ao realizar acao de ajuda em teste de equipe, concede +2 ao aliado em vez do bonus padrao.",
  },
  {
    id: "tolerancia-maior",
    nome: "Resistencia Ambiental",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 1,
    resumo:
      "+2 em testes contra condicoes ambientais adversas (frio, calor, fadiga).",
    efeito:
      "+2 em testes para resistir a condicoes ambientais adversas como frio, calor, fadiga ou ambientes hostis.",
  },
  {
    id: "recuperacao-rapida",
    nome: "Recuperacao Rapida",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "+1 adicional por fonte ao receber cura.",
    efeito:
      "+1 adicional por fonte ao receber cura. Nao afeta recuperacao passiva continua.",
  },
  {
    id: "presenca-impositiva",
    nome: "Presenca Impositiva",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Teste de Presenca concede +2 social contra alvos da cena.",
    efeito:
      "Ao iniciar interacao social, teste de Presenca bem-sucedido concede +2 em testes sociais contra esses alvos durante a cena.",
  },
  {
    id: "adaptacao-rapida",
    nome: "Adaptacao Rapida",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Uma vez por cena, ao falhar teste (exceto ataque), pode refaze-lo com -2.",
    efeito:
      "Uma vez por cena, ao falhar em um teste (exceto ataque), pode refaze-lo com -2. O novo resultado deve ser aceito.",
  },
  {
    id: "foco-inabalavel",
    nome: "Foco Inabalavel",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 4,
    resumo: "+2 em testes para manter concentracao e resistir interrupcoes.",
    efeito:
      "+2 em testes para manter concentracao, resistir distracoes e sustentar acoes continuas sob pressao.",
  },
  {
    id: "reserva-de-eter",
    nome: "Reserva de Eter",
    categoria: "Eter",
    temGraduacao: true,
    custoPorGraduacao: 3,
    resumo: "+5 no Eter maximo por graduacao (max 3 grads).",
    efeito: "+5 Eter maximo por graduacao. Limite de 3 graduacoes.",
  },
  {
    id: "tecnica-eficiente",
    nome: "Tecnica Eficiente",
    categoria: "Eter",
    temGraduacao: false,
    custoPorGraduacao: 4,
    resumo: "Reduz custo de tecnicas em 1 PE (minimo 2, 1 vez por turno).",
    efeito: "Reduz custo de tecnicas em 1 PE (minimo 2, 1 vez por turno).",
  },
  {
    id: "controle-eter",
    nome: "Controle de Eter",
    categoria: "Eter",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "+2 em testes de Tecnica para controlar Eter, sustentar tecnicas e resistir interferencias.",
    efeito:
      "+2 em testes de Tecnica relacionados ao controle de Eter (sustentar, evitar falhas, resistir interferencias).",
  },
  {
    id: "pressao-de-eter",
    nome: "Pressao de Eter",
    categoria: "Eter",
    temGraduacao: false,
    custoPorGraduacao: 4,
    resumo: "Inimigos proximos sofrem -1 em resistencia contra suas tecnicas.",
    efeito:
      "Inimigos proximos sofrem -1 em resistencia contra suas tecnicas (nao acumula).",
  },
  {
    id: "deteccao-de-eter",
    nome: "Deteccao de Eter",
    categoria: "Eter",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "+2 ao usar Foco e Campo para detectar Eter.",
    efeito: "+2 ao usar Foco e Campo para detectar Eter e suas manifestacoes.",
  },
  {
    id: "fluxo-reservado",
    nome: "Fluxo Reservado",
    categoria: "Eter",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Ao chegar a 0 PE, recupera 3 PE automaticamente (1 vez por cena).",
    efeito: "Ao chegar a 0 PE, recupera 3 PE automaticamente (1 vez por cena).",
  },
  {
    id: "descarga-controlada",
    nome: "Descarga Controlada",
    categoria: "Eter",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Ao usar tecnica ofensiva, pode gastar +3 PE para +2 no dano ou efeito (1 vez por turno).",
    efeito:
      "Ao usar tecnica ofensiva, pode aumentar custo em +3 PE para +2 no dano ou efeito principal. Declarar antes da execucao. 1 vez por turno.",
  },
  {
    id: "estabilidade-de-fluxo",
    nome: "Estabilidade de Fluxo",
    categoria: "Eter",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Uma vez por cena, ao falhar teste de Tecnica, pode refaze-lo com -2.",
    efeito:
      "Uma vez por cena, ao falhar teste de Tecnica (uso de Eter), pode refaze-lo com -2. Deve aceitar o novo resultado.",
  },
];

const VANTAGEM_BY_ID = new Map(
  VANTAGENS_CATALOGO.map((item) => [item.id, item]),
);

const DESVANTAGENS_CATALOGO: DisadvantageDefinition[] = [
  {
    id: "precisao-reduzida",
    nome: "Precisao Reduzida",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Ao falhar ataque por 2 ou menos, sofre -2 no proximo ataque ate o fim do turno.",
    efeito:
      "Sempre que falhar em um teste de ataque por 2 ou menos, recebe -2 no proximo teste de ataque ate o fim do turno.",
  },
  {
    id: "defesa-instavel",
    nome: "Defesa Instavel",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Ao sofrer dano >= 8 ou critico, recebe -2 em Defesa; nova ativacao agrava para -3.",
    efeito:
      "Ao sofrer dano igual ou superior a 8 ou acerto critico, recebe -2 em Defesa ate o proximo turno. Nova ativacao sob efeito agrava para -3.",
  },
  {
    id: "postura-exposta",
    nome: "Postura Exposta",
    categoria: "Combate",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo:
      "A partir do 2o ataque recebido no turno, sofre -2 em Defesa; com 3+ ataques, -4.",
    efeito:
      "Ao ser alvo de 2 ou mais ataques no mesmo turno, sofre -2 em Defesa contra os adicionais. Se for alvo de 3 ou mais, a penalidade passa a -4.",
  },
  {
    id: "reacao-lenta",
    nome: "Reacao Lenta",
    categoria: "Combate",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo:
      "-2 em testes reativos (esquivas, contra-ataques e respostas defensivas).",
    efeito:
      "Sofre -2 em testes de reacao, como esquivas, contra-ataques e respostas defensivas imediatas.",
  },
  {
    id: "ataque-comprometido",
    nome: "Ataque Comprometido",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Errar ataque por 5+ causa -2 em Defesa ate o proximo turno.",
    efeito:
      "Sempre que errar um ataque por 5 ou mais, sofre -2 em Defesa ate o inicio do proximo turno.",
  },
  {
    id: "comprometimento-excessivo",
    nome: "Comprometimento Excessivo",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Apos atacar, nao pode se deslocar e, adjacente a inimigo, sofre -1 em Defesa.",
    efeito:
      "Sempre que realizar um ataque no turno, nao pode se deslocar apos o ataque. Se terminar adjacente a inimigo, sofre -1 em Defesa ate o proximo turno.",
  },
  {
    id: "foco-limitado",
    nome: "Foco Limitado",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Ao trocar de alvo ainda ao alcance, sofre -2 no ataque.",
    efeito:
      "Sempre que atacar um alvo diferente do anterior enquanto o anterior ainda estiver ao alcance, sofre -2 no teste de ataque.",
  },
  {
    id: "tempo-de-recuperacao",
    nome: "Tempo de Recuperacao",
    categoria: "Combate",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo:
      "No proximo turno, primeiro ataque sofre -2; se falhar, nao pode atacar novamente no turno.",
    efeito:
      "Sempre que atacar, no inicio do proximo turno sofre -2 no primeiro ataque. Se esse ataque falhar, nao pode realizar outros ataques nesse turno.",
  },
  {
    id: "abertura-previsivel",
    nome: "Abertura Previsivel",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Repetir mesmo tipo de ataque em turnos consecutivos concede +1 Defesa aos inimigos.",
    efeito:
      "Ao repetir o mesmo tipo de ataque em turnos consecutivos, inimigos recebem +1 em testes de Defesa contra seus ataques ate o fim do turno.",
  },
  {
    id: "dificuldade-em-finalizar",
    nome: "Dificuldade em Finalizar",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Contra alvos com metade ou menos dos PV, sofre -2 no ataque.",
    efeito:
      "Sempre que atacar alvo com metade ou menos dos PV maximos, sofre -2 no teste de ataque.",
  },
  {
    id: "resposta-lenta-a-erros",
    nome: "Resposta Lenta a Erros",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Ao falhar ataque, sofre -1 no proximo ataque ate o fim do turno.",
    efeito:
      "Sempre que falhar em um teste de ataque, sofre -1 no proximo teste de ataque ate o final do turno.",
  },
  {
    id: "reserva-reduzida",
    nome: "Reserva Reduzida",
    categoria: "Eter",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Eter maximo reduzido em -5 PE.",
    efeito: "Seu Eter maximo e reduzido em -5 PE.",
  },
  {
    id: "fluxo-instavel",
    nome: "Fluxo Instavel",
    categoria: "Eter",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Tecnicas de custo >= 4 PE perdem +1 PE; em sequencia, +2 PE.",
    efeito:
      "Ao usar tecnica com custo >= 4 PE, perde +1 PE adicional. Se usar outra tecnica no mesmo turno ou no seguinte, a perda adicional passa a +2 PE.",
  },
  {
    id: "sobrecarga",
    nome: "Sobrecarga",
    categoria: "Eter",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Tecnica de custo >= 5 PE causa -2 geral no proximo turno; recorrencia bloqueia movimento.",
    efeito:
      "Ao usar tecnica com custo >= 5 PE, no proximo turno sofre -2 em todos os testes. Se repetir sob efeito, nao pode realizar acao de movimento.",
  },
  {
    id: "colapso-sensivel",
    nome: "Colapso Sensivel",
    categoria: "Eter",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo:
      "Ao chegar a 0 PE, fica incapacitado por 1 turno e depois sofre -1 em Tecnica.",
    efeito:
      "Quando o Eter atinge 0, fica incapacitado por 1 turno completo. Depois, sofre -1 em testes de Tecnica ate o fim do turno seguinte (1 vez por cena).",
  },
  {
    id: "corpo-incompativel",
    nome: "Corpo Incompativel",
    categoria: "Eter",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo: "Apos usar tecnica, nao pode usar tecnica no turno seguinte.",
    efeito:
      "Sempre que utilizar uma tecnica que consuma Eter, nao pode utilizar outra tecnica no proximo turno.",
  },
  {
    id: "arrogante",
    nome: "Arrogante",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "Penalidade ao receber ajuda.",
    efeito: "Ao receber ajuda em testes, sofre -2 no resultado final.",
  },
  {
    id: "impaciente",
    nome: "Impaciente",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo:
      "-2 em acoes que exigem preparacao/espera; pode agir antes para ignorar penalidade.",
    efeito:
      "Em acoes com preparacao ou coordenacao, sofre -2. Pode agir imediatamente para ignorar a penalidade, resolvendo antes dos demais e sem beneficios de coordenacao posterior.",
  },
  {
    id: "ingenuo",
    nome: "Ingenuo",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 para detectar mentira, manipulacao ou intencoes ocultas.",
    efeito:
      "Sofre -2 em testes para detectar mentira, manipulacao ou intencoes ocultas em interacoes sociais diretas.",
  },
  {
    id: "teimoso",
    nome: "Teimoso",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo:
      "Ao mudar decisao relevante em andamento, sofre -2 na nova abordagem.",
    efeito:
      "Sempre que tentar mudar uma decisao relevante ja iniciada, sofre -2 em testes relacionados a nova abordagem ate o fim do turno.",
  },
  {
    id: "temperamental",
    nome: "Temperamental",
    categoria: "Comportamental",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Sob pressao emocional, sofre -1 geral e nao pode ajudar.",
    efeito:
      "Ao sofrer dano significativo, falhar teste relevante ou ser provocado, sofre -1 em testes ate o fim do proximo turno e nao pode usar acao de ajuda.",
  },
  {
    id: "codigo-de-honra",
    nome: "Codigo de Honra",
    categoria: "Comportamental",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Violar o codigo gera -2 na acao; quebrar o codigo gera -1 geral ate o fim da cena.",
    efeito:
      "Ao violar diretamente o codigo, sofre -2 em testes ligados a acao. Se quebrar o codigo, sofre -1 em testes ate o fim da cena.",
  },
  {
    id: "timido",
    nome: "Timido",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 no primeiro teste ao iniciar interacao social relevante.",
    efeito:
      "Sempre que iniciar interacao social relevante, sofre -2 no primeiro teste social realizado.",
  },
  {
    id: "excesso-de-confianca",
    nome: "Excesso de Confianca",
    categoria: "Comportamental",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "-2 em avaliacao de risco/cautela e -1 ao escolher opcao segura quando havia risco claro.",
    efeito:
      "Sofre -2 em testes de avaliacao de risco, planejamento ou cautela. Ao escolher abordagem segura em vez de opcao claramente arriscada, sofre -1 em testes da acao ate o fim do turno.",
  },
  {
    id: "provocador",
    nome: "Provocador",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo:
      "-2 para evitar/reduzir/encerrar conflitos sociais; pode virar alvo prioritario em hostilidade.",
    efeito:
      "Sofre -2 em testes para evitar, reduzir ou encerrar conflitos sociais. Em hostilidade, pode ser considerado alvo prioritario.",
  },
  {
    id: "dependente-de-aprovacao",
    nome: "Dependente de Aprovacao",
    categoria: "Comportamental",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Sem apoio direto de aliado, sofre -2 no primeiro teste da acao.",
    efeito:
      "Sempre que iniciar acao sem apoio direto de aliado, sofre -2 no primeiro teste realizado. Apoio previo ignora a penalidade.",
  },
  {
    id: "marca-registrada",
    nome: "Marca Registrada",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo:
      "-2 em disfarce, anonimato e infiltracao quando reconhecimento for relevante.",
    efeito:
      "Sempre que tentar ocultar identidade ou agir de forma discreta, sofre -2 em testes de disfarce, anonimato ou infiltracao.",
  },
  {
    id: "expressao-transparente",
    nome: "Expressao Transparente",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 em Enganacao para mentir/ocultar emocoes em interacao direta.",
    efeito:
      "Sempre que tentar mentir, ocultar emocoes ou manipular informacoes, sofre -2 em testes de Enganacao.",
  },
  {
    id: "presenca-intimidadora",
    nome: "Presenca Intimidadora",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 em Persuasao e interacoes positivas no primeiro contato.",
    efeito:
      "Ao iniciar interacao social com quem nao o conhece, sofre -2 em testes de Persuasao e outras interacoes sociais positivas.",
  },
  {
    id: "amputacao-braco",
    nome: "Amputacao - Braco",
    categoria: "Fisica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Nao usa armas de duas maos.",
    efeito: "Nao pode usar armas de duas maos e sofre -2 em acoes bimanuais.",
  },
  {
    id: "amputacao-perna",
    nome: "Amputacao - Perna",
    categoria: "Fisica",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo: "Movimento reduzido pela metade.",
    efeito: "Deslocamento reduzido pela metade e -2 em mobilidade/esquiva.",
  },
  {
    id: "cego",
    nome: "Cego",
    categoria: "Fisica",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo:
      "-5 em testes que dependam de visao e em ataques a distancia realizados por voce.",
    efeito:
      "Sofre -5 em testes que dependam diretamente de visao. Ataques a distancia realizados por voce sofrem -5.",
  },
  {
    id: "fragil",
    nome: "Fragil",
    categoria: "Fisica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Recebe +1 de dano adicional por fonte de dano direto.",
    efeito:
      "Sempre que sofrer dano direto, recebe +1 de dano adicional (uma vez por fonte).",
  },
  {
    id: "sobrecarga-corporal",
    nome: "Sobrecarga Corporal",
    categoria: "Fisica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Deslocamento reduzido e -1 em Defesa contra ataques que dependam de esquiva.",
    efeito:
      "Seu deslocamento e reduzido e voce sofre -1 em Defesa contra ataques que dependam de esquiva.",
  },
  {
    id: "desnutrido",
    nome: "Desnutrido",
    categoria: "Fisica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "-1 em testes de Forca e Constituicao; apos dano direto, -1 em testes fisicos ate o proximo turno.",
    efeito:
      "Sofre -1 em testes baseados em Forca e Constituicao. Apos sofrer dano direto, sofre -1 em testes fisicos ate o proximo turno.",
  },
  {
    id: "aparencia-desagradavel",
    nome: "Aparencia Desagradavel",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 em Persuasao ao iniciar interacao com quem nao o conhece.",
    efeito:
      "Sempre que iniciar interacao social com alguem que nao o conheca, sofre -2 em testes de Persuasao.",
  },
  {
    id: "ansiedade",
    nome: "Ansiedade",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Sob pressao, -2 no primeiro teste da acao; se falhar, -1 ate o fim do turno.",
    efeito:
      "Ao iniciar acao relevante sob pressao, sofre -2 no primeiro teste. Se falhar, sofre -1 em testes ate o final do turno.",
  },
  {
    id: "autodestrutivo",
    nome: "Autodestrutivo",
    categoria: "Psicologica",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo:
      "Ao sofrer hostilidade, -2 em Defesa e em acoes defensivas/recuo; ao agir ofensivamente contra a fonte, ignora penalidade de teste.",
    efeito:
      "Ao sofrer dano ou acao hostil direta, sofre -2 em Defesa ate o proximo turno e -2 em testes de acao defensiva/recuo nesse periodo. Ao agir ofensivamente contra a fonte do gatilho, ignora a penalidade de teste dessa desvantagem ate o fim do turno.",
  },
  {
    id: "culpa",
    nome: "Culpa",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Ao causar dano, -2 em ataques ate o proximo turno; ao incapacitar, -2 em testes ate o fim do turno seguinte.",
    efeito:
      "Sempre que causar dano a outro personagem, sofre -2 em testes de ataque ate o inicio do proximo turno. Se incapacitar alvo, sofre -2 em testes ate o fim do turno seguinte.",
  },
  {
    id: "dependencia-emocional",
    nome: "Dependencia Emocional",
    categoria: "Psicologica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "Sob pressao sem acesso ao vinculo, -2 no primeiro teste da acao.",
    efeito:
      "Sob pressao sem acesso direto ao vinculo, sofre -2 no primeiro teste ao iniciar uma acao. Apoio direto ignora a penalidade.",
  },
  {
    id: "fobia",
    nome: "Fobia",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Sob exposicao ao gatilho, sofre -2 em testes e -1 adicional ao se aproximar voluntariamente.",
    efeito:
      "Quando exposto diretamente ao objeto da fobia, sofre -2 em testes. Ao se aproximar voluntariamente da fonte, sofre -1 adicional ate o final do turno.",
  },
  {
    id: "instabilidade-emocional",
    nome: "Instabilidade Emocional",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Ao sofrer dano ou falhar teste, sofre -1 geral; nova ativacao agrava para -2.",
    efeito:
      "Sempre que sofrer dano ou falhar em teste, sofre -1 em todos os testes ate o inicio do proximo turno. Nova ativacao sob efeito agrava para -2.",
  },
  {
    id: "obsessivo",
    nome: "Obsessivo",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Com foco relevante em cena, sofre -2 fora dele e recebe +1 quando agir alinhado ao foco.",
    efeito:
      "Quando o foco de obsessao estiver presente ou relacionado a cena, sofre -2 em testes fora dele. Ao agir alinhado ao foco, recebe +1 em testes da acao.",
  },
  {
    id: "paranoico",
    nome: "Paranoico",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "-2 em testes sociais de confianca, cooperacao e negociacao, e para aceitar ajuda sem evidencia.",
    efeito:
      "Sofre -2 em testes sociais que envolvam confianca, cooperacao ou negociacao e -2 para aceitar ajuda/informacoes sem evidencia clara.",
  },
  {
    id: "trauma",
    nome: "Trauma",
    categoria: "Psicologica",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo:
      "Sob gatilho, -2 em testes e nao pode executar acoes de concentracao/preparo ate o fim do proximo turno; depois -1.",
    efeito:
      "Ao ser exposto ao gatilho de trauma, sofre -2 em testes e nao pode realizar acoes que exijam concentracao/preparo ate o fim do proximo turno. Depois sofre -1 em testes ate o fim do turno seguinte (max 1 vez por cena).",
  },
  {
    id: "inercia-emocional",
    nome: "Inercia Emocional",
    categoria: "Psicologica",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo:
      "Sob pressao, -1 em testes; em iniciativa desfavoravel, -2. Falha gera -1 no proximo teste do turno.",
    efeito:
      "Ao iniciar turno em situacao de pressao, sofre -1 em testes ate o proximo turno. Em iniciativa desfavoravel, a penalidade sobe para -2. Se falhar em teste nesse periodo, sofre -1 adicional no proximo teste do mesmo turno.",
  },
  {
    id: "dependencia-fisica",
    nome: "Dependencia Fisica",
    categoria: "Condicao",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Sem fator de dependencia, -1 geral; no turno seguinte, -2 geral e -2 em Tecnica.",
    efeito:
      "Sem acesso ao fator de dependencia, sofre -1 em todos os testes. Se continuar sem acesso ate o inicio do proximo turno, sofre -2 em testes e -2 em testes de Tecnica.",
  },
  {
    id: "sensibilidade",
    nome: "Sensibilidade",
    categoria: "Condicao",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Sob estimulo definido, sofre -2 em testes; exposicao intensa adiciona -2 em acoes de concentracao/precisao.",
    efeito:
      "Ao ficar exposto ao estimulo definido, sofre -2 em testes. Se a exposicao for intensa/continua, sofre -2 adicionais em acoes que exijam concentracao ou precisao.",
  },
  {
    id: "fraqueza",
    nome: "Fraqueza",
    categoria: "Condicao",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo:
      "Sob exposicao ao elemento de fraqueza, sofre -3 geral e nao pode usar Tecnicas que consumam Eter.",
    efeito:
      "Quando exposto ao elemento de fraqueza definido, sofre -3 em todos os testes e nao pode usar Tecnicas que consumam Eter enquanto durar a exposicao.",
  },
  {
    id: "exaustao-progressiva",
    nome: "Exaustao Progressiva",
    categoria: "Condicao",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Apos 2 turnos de esforco intenso, -1 em fisicos/Tecnica; persistindo, -2 e bloqueio de esforco maximo.",
    efeito:
      "Apos dois turnos consecutivos de acoes intensas, sofre -1 em testes fisicos e de Tecnica. Se continuar, a penalidade sobe para -2 e nao pode realizar acoes de esforco maximo ate interromper por 1 turno.",
  },
  {
    id: "dependencia-quimica",
    nome: "Dependencia Quimica",
    categoria: "Condicao",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo:
      "Sem a substancia por 1 cena, -1 geral; na cena seguinte, -2 e bloqueio de Tecnicas.",
    efeito:
      "Ao passar uma cena sem a substancia definida, sofre -1 em todos os testes. Na cena seguinte sem consumo, sofre -2 em testes e nao pode utilizar Tecnicas ate consumir novamente.",
  },
];

const DESVANTAGEM_BY_ID = new Map(
  DESVANTAGENS_CATALOGO.map((item) => [item.id, item]),
);

const PERICIA_INFO: Record<string, { atributo: Atributo; descricao: string }> =
  {
    Acrobacia: {
      atributo: "Agilidade",
      descricao:
        "Controle corporal avancado para equilibrio, saltos dificeis, manobras evasivas e deslocamento preciso em ambientes perigosos.",
    },
    "Analise de Eter": {
      atributo: "Tecnica",
      descricao:
        "Capacidade de interpretar o fluxo de Eter, reconhecer assinaturas e analisar manifestacoes e tecnicas em uso.",
    },
    Atletismo: {
      atributo: "Forca",
      descricao:
        "Capacidade fisica bruta para escalar, nadar, saltar grandes distancias e realizar esforcos intensos.",
    },
    Concentracao: {
      atributo: "Vontade",
      descricao:
        "Capacidade de manter foco mental sob pressao, resistir interrupcoes e sustentar acoes continuas em situacoes criticas.",
    },
    Enganar: {
      atributo: "Presenca",
      descricao:
        "Capacidade de manipular percepcoes por mentiras, omissoes e encenacao convincente mesmo sob pressao.",
    },
    Expressao: {
      atributo: "Presenca",
      descricao:
        "Capacidade de comunicar ideias, emocoes e intencoes por performance artistica ou corporal, como atuacao, musica, danca e oratoria.",
    },
    Furtividade: {
      atributo: "Agilidade",
      descricao:
        "Capacidade de agir sem ser percebido, mover-se silenciosamente e infiltrar-se em locais protegidos.",
    },
    Percepcao: {
      atributo: "Vontade",
      descricao:
        "Atencao ativa ao ambiente para detectar ameacas, perceber detalhes e antecipar perigos antes que se tornem evidentes.",
    },
    Investigacao: {
      atributo: "Intelecto",
      descricao:
        "Capacidade analitica para examinar pistas, interpretar evidencias e reconstruir acontecimentos complexos.",
    },
    Intuicao: {
      atributo: "Presenca",
      descricao:
        "Percepcao emocional para interpretar comportamentos, detectar manipulacoes e ler intencoes ocultas.",
    },
    Persuasao: {
      atributo: "Presenca",
      descricao:
        "Habilidade social para convencer, negociar e influenciar decisoes por argumentacao e carisma.",
    },
    Intimidacao: {
      atributo: "Presenca",
      descricao:
        "Capacidade de impor medo e pressao psicologica para dominar conversas ou desmoralizar adversarios.",
    },
    Ladinagem: {
      atributo: "Agilidade",
      descricao:
        "Habilidade manual precisa para abrir fechaduras, desarmar armadilhas e manipular mecanismos delicados.",
    },
    Conhecimento: {
      atributo: "Intelecto",
      descricao:
        "Cultura e aprendizado acumulado em campos academicos e praticos, com especializacoes por area.",
    },
    Medicina: {
      atributo: "Intelecto",
      descricao:
        "Conhecimento medico para diagnosticar, estabilizar feridos, tratar doencas e realizar primeiros socorros.",
    },
    Sobrevivencia: {
      atributo: "Intelecto",
      descricao:
        "Conhecimento pratico para rastrear, orientar-se e extrair recursos em ambientes hostis e condicoes adversas.",
    },
  };

const PERICIA_KEY_ALIAS: Record<string, string | undefined> = {
  Enganar: "Enganacao",
};

const getPericiaSheetValue = (
  pericias: Record<string, string>,
  pericia: string,
): string => {
  const current = pericias[pericia];
  if (current !== undefined) {
    return current;
  }

  const alias = PERICIA_KEY_ALIAS[pericia];
  if (!alias) {
    return "";
  }

  return pericias[alias] ?? "";
};

const CONHECIMENTO_OPTIONS = [
  {
    value: "Arcano",
    descricao:
      "ocultismo, magia e fenomenos sobrenaturais, astrologia, numerologia e topicos similares.",
  },
  {
    value: "Arte",
    descricao:
      "belas artes e artes graficas, incluindo historia da arte e tecnicas artisticas. Antiguidades, arte moderna, fotografia, musica e danca.",
  },
  {
    value: "Atualidades",
    descricao:
      "acontecimentos recentes nas noticias, esportes, politica, entretenimento e assuntos internacionais.",
  },
  {
    value: "Ciencias biologicas",
    descricao: "biologia, botanica, genetica e medicina.",
  },
  {
    value: "Ciencias comportamentais",
    descricao: "psicologia, sociologia e criminologia.",
  },
  {
    value: "Ciencias da Terra",
    descricao: "geografia, geologia, oceanografia e paleontologia.",
  },
  {
    value: "Ciencias fisicas",
    descricao: "engenharia, fisica, matematica e quimica.",
  },
  {
    value: "Tecnologia",
    descricao:
      "operacao, reparo, adaptacao e desenvolvimento de dispositivos tecnologicos.",
  },
  {
    value: "Cultura popular",
    descricao:
      "musica e personalidades populares, filmes e livros de genero, lendas urbanas, quadrinhos, ficcao cientifica, jogos e generalidades.",
  },
  {
    value: "Educacao civica",
    descricao:
      "lei, legislacao, direitos e obrigacoes legais. Instituicoes e processos politicos e governamentais.",
  },
  {
    value: "Historia",
    descricao:
      "eventos, personalidades e culturas do passado. Arqueologia e antiguidades.",
  },
  {
    value: "Manha",
    descricao:
      "cultura urbana e cultura de rua, personalidades e eventos do submundo local.",
  },
  {
    value: "Negocios",
    descricao:
      "procedimentos de negocios e estrategias de investimento. Procedimentos burocraticos e como navegar por eles.",
  },
  {
    value: "Tatica",
    descricao: "tecnicas e estrategias para manobrar forcas em combate.",
  },
  {
    value: "Teologia e filosofia",
    descricao:
      "artes liberais, etica, conceitos filosoficos e o estudo da fe, pratica e experiencia religiosa.",
  },
] as const;

const TECNICAS_BASICAS: BasicTechniqueDefinition[] = [
  {
    nome: "Supressao",
    tipo: "Sensorial",
    custoPPPorGraduacao: 2,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 1,
    descricao:
      "Comprime o fluxo de Eter dentro do proprio corpo ate praticamente eliminar sua manifestacao externa. Para qualquer percepcao baseada em Eter, o personagem deixa de existir.",
    limitacoes:
      "Impossivel atacar enquanto ativa. Sofre -1 em Resistencia e -1 em testes de Tecnica durante a manutencao.",
  },
  {
    nome: "Foco",
    tipo: "Sensorial",
    custoPPPorGraduacao: 2,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 1,
    descricao:
      "Direciona o fluxo de Eter para os olhos, transformando percepcao passiva em leitura ativa de fluxo, densidade e intencao. Permite detectar presencas de Eter mesmo sem linha de visao direta.",
    limitacoes: "Sofre -2 em Defesa contra alvos fora de seu foco atual.",
  },
  {
    nome: "Campo",
    tipo: "Sensorial / Controle",
    custoPPPorGraduacao: 3,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 3,
    descricao:
      "Projeta o Eter ao redor do corpo formando uma zona sensorial continua. Dentro dessa area detecta automaticamente qualquer presenca de Eter, movimentacoes e alteracoes de fluxo, independentemente de linha de visao.",
    limitacoes:
      "Sofre -2 em Defesa enquanto a tecnica estiver ativa. Impossibilita qualquer beneficio de efeitos que ocultem a presenca de Eter.",
  },
  {
    nome: "Guarda",
    tipo: "Defesa",
    custoPPPorGraduacao: 4,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 2,
    descricao:
      "Distribui o fluxo de Eter por todo o corpo em camada continua de absorcao. Em vez de bloquear o impacto, dissipa sua forca antes que se converta em dano efetivo.",
    limitacoes:
      "Sofre -2 em Agilidade enquanto ativa. Limitado a no maximo 1 reacao por rodada.",
  },
  {
    nome: "Impulso",
    tipo: "Fortalecimento",
    custoPPPorGraduacao: 5,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 2,
    descricao:
      "Forca o fluxo de Eter a circular em sobrecarga, ampliando capacidade ofensiva. Ao ativar, escolha o modo: bônus em Ataque ou bônus em Dano. Aplica-se apenas ao primeiro ataque do turno.",
    limitacoes:
      "Sofre -2 em Defesa. Impede qualquer beneficio de efeitos de ocultacao de Eter. Cada turno consecutivo ativo aumenta o custo em +1 PE cumulativo.",
  },
  {
    nome: "Ruptura",
    tipo: "Defesa / Ataque",
    custoPPPorGraduacao: 3,
    acao: "Reacao ou Padrao",
    duracao: "Instantanea",
    basePE: 1,
    descricao:
      "Concentra todo o fluxo de Eter em um unico ponto no momento critico. Como reacao ao sofrer dano, testa Tecnica (1d20 + graduacao) contra CD 15 para reduzir o impacto. Como acao, amplifica o dano de um golpe.",
    limitacoes:
      "Apos usar, todos os efeitos defensivos baseados em Eter ficam suprimidos ate o inicio do proximo turno. Sofre -2 em testes de Tecnica ate o inicio do seu proximo turno.",
  },
];

const EQUIPAMENTOS_ACESSO_NIVEIS = [
  "Comum",
  "Avancado",
  "Raro",
  "Especial",
] as const;

const EQUIPAMENTOS_LIMITE_INICIAL = {
  armas: 2,
  protecoes: 2,
  utilitarios: 5,
};

const EQUIPAMENTOS_REGRAS_GERAIS = [
  "Bonus de dano total nao pode ultrapassar +2.",
  "Bonus de acerto total nao pode ultrapassar +2.",
  "Bonus de defesa total nao pode ultrapassar +2.",
  "Efeitos que ignoram resistencia nao acumulam.",
  "Reducoes de dano nao acumulam entre si.",
  "Equipamentos nao substituem tecnicas ou atributos.",
  "Itens utilitarios possuem uso limitado.",
  "O mestre possui decisao final.",
];

const EQUIPAMENTOS_DESGASTE = [
  {
    estado: "Integro",
    efeitos: "Funcionamento normal.",
  },
  {
    estado: "Danificado",
    efeitos:
      "Armas: -1 acerto ou perda do efeito principal. Protecoes: -1 resistencia ou perda do efeito.",
  },
  {
    estado: "Comprometido",
    efeitos:
      "Armas: sem bonus e risco de falha. Protecoes: sem resistencia. Novo desgaste: inutilizavel ate reparo.",
  },
];

const EQUIPMENT_WEAPONS_BY_ERA: Record<EquipmentEra, EquipmentWeaponEntry[]> = {
  Medieval: [
    {
      nome: "Adaga",
      subcategoria: "Armas Leves",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "+1 (surpresa)",
      efeito: "+2 dano contra alvo desprevenido",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Faca de Combate",
      subcategoria: "Armas Leves",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "0",
      efeito: "Pode ser arremessada",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Punhal",
      subcategoria: "Armas Leves",
      tipo: "CaC",
      alcance: "Curto",
      dano: "0",
      acerto: "+1",
      efeito: "+1 em ataques rapidos consecutivos",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Estilete",
      subcategoria: "Armas Leves",
      tipo: "CaC",
      alcance: "Curto",
      dano: "0",
      acerto: "+2 (precisao)",
      efeito: "Ignora 1 resistencia em alvo desprevenido",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Clava leve",
      subcategoria: "Armas Leves",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "0",
      efeito: "+1 dano contra alvo ja machucado",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Espada curta",
      subcategoria: "Espadas",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "+1 (apos mover)",
      efeito: "Ideal para mobilidade",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Espada longa",
      subcategoria: "Espadas",
      tipo: "CaC",
      alcance: "Medio",
      dano: "+1",
      acerto: "0",
      efeito: "+1 dano se nao se mover",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Espada bastarda",
      subcategoria: "Espadas",
      tipo: "CaC",
      alcance: "Medio",
      dano: "+2",
      acerto: "-1",
      efeito: "+2 dano se usar duas maos",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Montante",
      subcategoria: "Espadas",
      tipo: "CaC",
      alcance: "Medio",
      dano: "+2",
      acerto: "-1",
      efeito: "Ataca multiplos alvos adjacentes",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Sabre",
      subcategoria: "Espadas",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "+1",
      efeito: "+1 dano apos esquiva bem-sucedida",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Maca",
      subcategoria: "Armas de Impacto",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+2",
      acerto: "0",
      efeito: "Ignora 1 resistencia",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Martelo de guerra",
      subcategoria: "Armas de Impacto",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+2",
      acerto: "-1",
      efeito: "+2 dano contra armadura",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Mangual",
      subcategoria: "Armas de Impacto",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+2",
      acerto: "-1",
      efeito: "Ignora bonus de defesa de escudo",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Porrete pesado",
      subcategoria: "Armas de Impacto",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+2",
      acerto: "0",
      efeito: "+1 dano se alvo estiver caido",
      peso: "Pesado",
      acesso: "Comum",
    },
    {
      nome: "Lanca",
      subcategoria: "Armas de Haste",
      tipo: "CaC",
      alcance: "Medio",
      dano: "+1",
      acerto: "+1 (distancia)",
      efeito: "-1 se adjacente",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Alabarda",
      subcategoria: "Armas de Haste",
      tipo: "CaC",
      alcance: "Medio",
      dano: "+2",
      acerto: "0",
      efeito: "Pode empurrar alvo",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Glaive",
      subcategoria: "Armas de Haste",
      tipo: "CaC",
      alcance: "Medio",
      dano: "+1",
      acerto: "+1",
      efeito: "+1 dano em ataque preparado",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Pique",
      subcategoria: "Armas de Haste",
      tipo: "CaC",
      alcance: "Longo",
      dano: "+1",
      acerto: "+2 (carga)",
      efeito: "+2 dano contra avanco",
      peso: "Pesado",
      acesso: "Comum",
    },
    {
      nome: "Arco curto",
      subcategoria: "Armas a Distancia",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+1 (curto alcance)",
      efeito: "Penalidade em longo alcance",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Arco longo",
      subcategoria: "Armas a Distancia",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+1",
      acerto: "0",
      efeito: "+1 dano se nao se mover",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Besta leve",
      subcategoria: "Armas a Distancia",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+2",
      acerto: "0",
      efeito: "Recarga limita acao",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Besta pesada",
      subcategoria: "Armas a Distancia",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+2",
      acerto: "-1",
      efeito: "+2 dano no primeiro disparo",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Dardos",
      subcategoria: "Armas a Distancia",
      tipo: "Distancia",
      alcance: "Curto",
      dano: "0",
      acerto: "+2",
      efeito: "Ataque rapido",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Chicote",
      subcategoria: "Armas Especiais",
      tipo: "CaC",
      alcance: "Medio",
      dano: "0",
      acerto: "+1",
      efeito: "Pode desarmar",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Rede",
      subcategoria: "Armas Especiais",
      tipo: "Distancia",
      alcance: "Curto",
      dano: "0",
      acerto: "0",
      efeito: "Aplica estado de imobilizacao",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Tocha",
      subcategoria: "Armas Especiais",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "0",
      efeito: "Pode aplicar queimadura",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Granada primitiva",
      subcategoria: "Armas Especiais",
      tipo: "Distancia",
      alcance: "Curto",
      dano: "2 fixo",
      acerto: "0",
      efeito: "Area pequena",
      peso: "Medio",
      acesso: "Raro",
    },
  ],
  Moderno: [
    {
      nome: "Pistola leve",
      subcategoria: "Armas Leves",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+1",
      efeito: "Sem penalidade em movimento",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Pistola pesada",
      subcategoria: "Armas Leves",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+2",
      acerto: "-1",
      efeito: "+2 dano no primeiro ataque",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Revolver",
      subcategoria: "Armas Leves",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+2",
      acerto: "0",
      efeito: "Ignora 1 resistencia",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Pistola automatica",
      subcategoria: "Armas Leves",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+1 (rajada curta)",
      efeito: "Pode atacar 2 alvos proximos (-1 cada)",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Derringer",
      subcategoria: "Armas Leves",
      tipo: "Distancia",
      alcance: "Curto",
      dano: "+2",
      acerto: "0",
      efeito: "+2 dano em surpresa",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "SMG leve",
      subcategoria: "Submetralhadoras",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+2 (rajada)",
      efeito: "Pode dividir dano em 2 alvos",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "SMG tatica",
      subcategoria: "Submetralhadoras",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+1",
      efeito: "+1 dano apos movimento",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "SMG pesada",
      subcategoria: "Submetralhadoras",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+2",
      acerto: "0",
      efeito: "-1 se mover antes de atacar",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Fuzil padrao",
      subcategoria: "Fuzis de Assalto",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+1",
      acerto: "+1",
      efeito: "Sem penalidade em medio alcance",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Fuzil tatico",
      subcategoria: "Fuzis de Assalto",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+1",
      acerto: "+1",
      efeito: "+1 dano se nao se mover",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Fuzil pesado",
      subcategoria: "Fuzis de Assalto",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+2",
      acerto: "0",
      efeito: "-1 apos movimento",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Fuzil com rajada",
      subcategoria: "Fuzis de Assalto",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+2 (rajada)",
      efeito: "Pode atacar area pequena (-1 dano)",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Rifle de precisao leve",
      subcategoria: "Fuzis de Precisao",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+2",
      acerto: "+1",
      efeito: "+2 dano se nao se mover",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Rifle pesado",
      subcategoria: "Fuzis de Precisao",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+2",
      acerto: "0",
      efeito: "Ignora 1 resistencia",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Rifle anti-material",
      subcategoria: "Fuzis de Precisao",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+2",
      acerto: "-1",
      efeito: "Ignora 2 resistencia",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Cassetete",
      subcategoria: "Armas de Impacto Modernas",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "+1",
      efeito: "+1 dano contra alvo imobilizado",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Tonfa",
      subcategoria: "Armas de Impacto Modernas",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "+1",
      efeito: "+1 Defesa apos ataque",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Bastao eletrico",
      subcategoria: "Armas de Impacto Modernas",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "0",
      efeito: "Pode aplicar estado (atordoado leve)",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Martelo tatico",
      subcategoria: "Armas de Impacto Modernas",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+2",
      acerto: "0",
      efeito: "+1 dano contra protecao",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Escopeta leve",
      subcategoria: "Espingardas",
      tipo: "Distancia",
      alcance: "Curto",
      dano: "+2",
      acerto: "+1",
      efeito: "-1 em medio alcance",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Escopeta tatica",
      subcategoria: "Espingardas",
      tipo: "Distancia",
      alcance: "Curto",
      dano: "+2",
      acerto: "0",
      efeito: "+2 dano se alvo estiver proximo",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Escopeta pesada",
      subcategoria: "Espingardas",
      tipo: "Distancia",
      alcance: "Curto",
      dano: "+2",
      acerto: "-1",
      efeito: "Pode atingir multiplos alvos proximos",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Metralhadora leve",
      subcategoria: "Armas de Suporte",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+2 (supressao)",
      efeito: "Impoe -1 em acoes inimigas",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Metralhadora pesada",
      subcategoria: "Armas de Suporte",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+2",
      acerto: "0",
      efeito: "Area de supressao (-1 inimigos)",
      peso: "Muito pesado",
      acesso: "Raro",
    },
    {
      nome: "Granada",
      subcategoria: "Armas Especiais",
      tipo: "Area",
      alcance: "Curto",
      dano: "3 fixo",
      acerto: "0",
      efeito: "Dano em area",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Flashbang",
      subcategoria: "Armas Especiais",
      tipo: "Area",
      alcance: "Curto",
      dano: "0",
      acerto: "0",
      efeito: "Aplica estado (cego leve)",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Gas",
      subcategoria: "Armas Especiais",
      tipo: "Area",
      alcance: "Curto",
      dano: "1 fixo",
      acerto: "0",
      efeito: "Aplica estado continuo",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Lancador",
      subcategoria: "Armas Especiais",
      tipo: "Area",
      alcance: "Medio",
      dano: "3 fixo",
      acerto: "-1",
      efeito: "Area maior",
      peso: "Pesado",
      acesso: "Raro",
    },
  ],
  Futurista: [
    {
      nome: "Lamina de energia",
      subcategoria: "Armas de Energia (CaC)",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "+1",
      efeito: "Ignora 1 resistencia",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Sabre de Eter",
      subcategoria: "Armas de Energia (CaC)",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "0",
      efeito: "+1 dano ao consumir 1 Eter",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Espada de plasma",
      subcategoria: "Armas de Energia (CaC)",
      tipo: "CaC",
      alcance: "Medio",
      dano: "+2",
      acerto: "-1",
      efeito: "Ignora 1 resistencia",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Lamina vibratoria",
      subcategoria: "Armas de Energia (CaC)",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+1",
      acerto: "+2",
      efeito: "+1 dano contra alvo com protecao",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Foice energetica",
      subcategoria: "Armas de Energia (CaC)",
      tipo: "CaC",
      alcance: "Medio",
      dano: "+2",
      acerto: "0",
      efeito: "Pode atingir 2 alvos adjacentes",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Pistola de pulso",
      subcategoria: "Armas de Disparo Energetico",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+1",
      efeito: "Sem penalidade em movimento",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Pistola de plasma",
      subcategoria: "Armas de Disparo Energetico",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+2",
      acerto: "0",
      efeito: "+1 dano se consumir 1 Eter",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Rifle de pulso",
      subcategoria: "Armas de Disparo Energetico",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+1",
      acerto: "+1",
      efeito: "+1 dano se nao se mover",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Rifle de plasma",
      subcategoria: "Armas de Disparo Energetico",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+2",
      acerto: "0",
      efeito: "Ignora 1 resistencia",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Canhao de energia",
      subcategoria: "Armas de Disparo Energetico",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+2",
      acerto: "-1",
      efeito: "Area pequena",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Condutor de Eter",
      subcategoria: "Armas de Eter",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "+1",
      efeito: "Consome 1 Eter, +1 dano",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Disruptor",
      subcategoria: "Armas de Eter",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "+1",
      acerto: "0",
      efeito: "Ignora 1 resistencia e aplica instabilidade",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Lancador de Eter",
      subcategoria: "Armas de Eter",
      tipo: "Area",
      alcance: "Medio",
      dano: "+2",
      acerto: "-1",
      efeito: "Area media, consome 1 Eter",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Foco de canalizacao",
      subcategoria: "Armas de Eter",
      tipo: "CaC",
      alcance: "Curto",
      dano: "0",
      acerto: "+2",
      efeito: "+2 em testes de tecnica ofensiva",
      peso: "Leve",
      acesso: "Raro",
    },
    {
      nome: "Campo gravitacional",
      subcategoria: "Armas de Controle",
      tipo: "Area",
      alcance: "Curto",
      dano: "0",
      acerto: "0",
      efeito: "Reduz movimentacao inimiga",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Projetil de contencao",
      subcategoria: "Armas de Controle",
      tipo: "Distancia",
      alcance: "Medio",
      dano: "0",
      acerto: "+1",
      efeito: "Aplica imobilizacao leve",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Rede energetica",
      subcategoria: "Armas de Controle",
      tipo: "Distancia",
      alcance: "Curto",
      dano: "0",
      acerto: "0",
      efeito: "Imobiliza por 1 turno",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Pulso de choque",
      subcategoria: "Armas de Controle",
      tipo: "Area",
      alcance: "Curto",
      dano: "+1",
      acerto: "0",
      efeito: "Empurra alvos",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Canhao de plasma pesado",
      subcategoria: "Armas Pesadas / Experimentais",
      tipo: "Area",
      alcance: "Medio",
      dano: "+2",
      acerto: "-1",
      efeito: "Area grande, consome 2 Eter",
      peso: "Muito pesado",
      acesso: "Raro",
    },
    {
      nome: "Rifle de desintegracao",
      subcategoria: "Armas Pesadas / Experimentais",
      tipo: "Distancia",
      alcance: "Longo",
      dano: "+2",
      acerto: "-1",
      efeito: "Ignora 2 resistencia",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Lancador gravitacional",
      subcategoria: "Armas Pesadas / Experimentais",
      tipo: "Area",
      alcance: "Medio",
      dano: "+1",
      acerto: "0",
      efeito: "Derruba e empurra",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Implosor de campo",
      subcategoria: "Armas Pesadas / Experimentais",
      tipo: "Area",
      alcance: "Curto",
      dano: "+2",
      acerto: "-1",
      efeito: "Puxa inimigos para centro",
      peso: "Muito pesado",
      acesso: "Especial",
    },
    {
      nome: "Arma vinculada ao Eter",
      subcategoria: "Armas Especiais (Shounen/Eter)",
      tipo: "Variavel",
      alcance: "Variavel",
      dano: "+1",
      acerto: "+1",
      efeito: "Evolui com o personagem",
      peso: "Leve",
      acesso: "Especial",
    },
    {
      nome: "Lamina instavel",
      subcategoria: "Armas Especiais (Shounen/Eter)",
      tipo: "CaC",
      alcance: "Curto",
      dano: "+2",
      acerto: "-1",
      efeito: "+3 dano ao consumir 2 Eter",
      peso: "Leve",
      acesso: "Especial",
    },
    {
      nome: "Dispositivo de sobrecarga",
      subcategoria: "Armas Especiais (Shounen/Eter)",
      tipo: "Area",
      alcance: "Curto",
      dano: "+2",
      acerto: "0",
      efeito: "+2 dano, usuario sofre 1 dano",
      peso: "Medio",
      acesso: "Especial",
    },
    {
      nome: "Fragmentador dimensional",
      subcategoria: "Armas Especiais (Shounen/Eter)",
      tipo: "Area",
      alcance: "Medio",
      dano: "+2",
      acerto: "-1",
      efeito: "Ignora resistencia, uso unico",
      peso: "Pesado",
      acesso: "Especial",
    },
  ],
};

const EQUIPMENT_PROTECTIONS_BY_ERA: Record<
  EquipmentEra,
  EquipmentProtectionEntry[]
> = {
  Medieval: [
    {
      nome: "Roupas reforcadas",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "0",
      efeito: "Sem penalidades",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Couro simples",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "0",
      efeito: "+1 em testes de movimento",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Couro batido",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 Defesa contra ataques leves",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Gibao acolchoado",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "0",
      efeito: "Reduz 1 dano (1x por rodada)",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Couro flexivel",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "+1",
      efeito: "Mantem bonus apos movimento",
      penalidade: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Cota de malha",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "0",
      efeito: "Reduz 1 dano cortante (1x por rodada)",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Malha reforcada",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 contra multiplos ataques",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Brigandina",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 Defesa se nao se mover",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Couraca leve",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "0",
      efeito: "+1 contra impacto",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Armadura de placas",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "0",
      efeito: "Reduz 1 dano (1x por rodada)",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Placas completas",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "+1",
      efeito: "+1 contra ataques frontais",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Armadura de guerra",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "0",
      efeito: "Ignora empurroes leves",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Comum",
    },
    {
      nome: "Placas reforcadas",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+3",
      defesa: "+1",
      efeito: "Reduz 1 dano adicional",
      penalidade: "-2 movimento, -1 acao rapida",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Escudo pequeno",
      subcategoria: "Escudos",
      tipo: "Escudo",
      resistencia: "0",
      defesa: "+1",
      efeito: "+1 Defesa contra distancia",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Escudo medio",
      subcategoria: "Escudos",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 Defesa geral",
      penalidade: "-1 em ataques pesados",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Escudo grande",
      subcategoria: "Escudos",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+2",
      efeito: "+2 Defesa frontal",
      penalidade: "-1 movimento",
      peso: "Pesado",
      acesso: "Comum",
    },
    {
      nome: "Escudo torre",
      subcategoria: "Escudos",
      tipo: "Escudo",
      resistencia: "+2",
      defesa: "+2",
      efeito: "Pode proteger aliado adjacente",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Armadura cerimonial",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 em testes sociais de presenca",
      penalidade: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Armadura runica",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "0",
      efeito: "+1 contra efeitos de Eter",
      penalidade: "-",
      peso: "Medio",
      acesso: "Raro",
    },
    {
      nome: "Couro encantado",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 esquiva apos receber dano",
      penalidade: "-",
      peso: "Leve",
      acesso: "Raro",
    },
    {
      nome: "Placa consagrada",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+2",
      defesa: "+1",
      efeito: "Reduz dano de entidades especiais",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Raro",
    },
  ],
  Moderno: [
    {
      nome: "Roupas taticas",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "0",
      efeito: "Sem penalidades",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Colete leve",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "0",
      efeito: "+1 contra disparos leves",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Vestimenta furtiva",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 em testes de furtividade",
      penalidade: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Traje flexivel",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "+1",
      efeito: "Sem penalidade apos movimento",
      penalidade: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Jaqueta reforcada",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "0",
      efeito: "Reduz 1 dano (1x por rodada)",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Colete balistico",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "0",
      efeito: "Reduz 1 dano de projeteis (1x por rodada)",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Colete tatico",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 Defesa em cobertura",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Armadura policial",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "0",
      efeito: "+1 contra ataques nao letais",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Colete reforcado",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "+1",
      efeito: "Reduz 1 dano adicional em ataques sucessivos",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Armadura tatica pesada",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "0",
      efeito: "Reduz 1 dano (1x por rodada)",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Traje de combate pesado",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "+1",
      efeito: "+1 contra ataques frontais",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Exoesqueleto leve",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "0",
      efeito: "Ignora penalidade de carga",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Exoesqueleto pesado",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+3",
      defesa: "+1",
      efeito: "+1 contra impacto",
      penalidade: "-2 movimento, -1 acao rapida",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Escudo tatico",
      subcategoria: "Escudos e Protecoes Ativas",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 Defesa contra disparos",
      penalidade: "-1 em ataques pesados",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Escudo balistico",
      subcategoria: "Escudos e Protecoes Ativas",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+2",
      efeito: "+2 Defesa frontal",
      penalidade: "-1 movimento",
      peso: "Pesado",
      acesso: "Comum",
    },
    {
      nome: "Escudo movel",
      subcategoria: "Escudos e Protecoes Ativas",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+2",
      efeito: "Pode proteger aliado adjacente",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Escudo de supressao",
      subcategoria: "Escudos e Protecoes Ativas",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+1",
      efeito: "Reduz dano de area em 1",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Traje anti-impacto",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "0",
      efeito: "Reduz dano de queda ou impacto",
      penalidade: "-",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Traje anti-explosao",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "0",
      efeito: "Reduz dano de area em 1",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Armadura furtiva",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "+2",
      efeito: "+2 em furtividade",
      penalidade: "-",
      peso: "Leve",
      acesso: "Raro",
    },
    {
      nome: "Traje NBC (quimico)",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "0",
      efeito: "Imune a gases e toxinas",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
  ],
  Futurista: [
    {
      nome: "Traje sintetico",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "0",
      efeito: "Sem penalidades",
      penalidade: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Malha reativa",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 Defesa apos receber dano (1x por rodada)",
      penalidade: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Traje de mobilidade",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "+1",
      efeito: "Sem penalidade apos movimento",
      penalidade: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Tecido de Eter",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "0",
      efeito: "+1 contra efeitos de Eter",
      penalidade: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Camuflagem ativa",
      subcategoria: "Protecoes Leves",
      tipo: "Leve",
      resistencia: "+1",
      defesa: "+2",
      efeito: "+2 em furtividade",
      penalidade: "-",
      peso: "Leve",
      acesso: "Raro",
    },
    {
      nome: "Armadura modular",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "0",
      efeito: "Pode trocar efeito 1x por combate",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Traje de combate",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 Defesa em combate direto",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Armadura reativa",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "0",
      efeito: "Reduz 1 dano apos primeiro ataque (1x por rodada)",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Placas de energia",
      subcategoria: "Protecoes Medias",
      tipo: "Media",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 contra ataques a distancia",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Raro",
    },
    {
      nome: "Armadura de energia",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "0",
      efeito: "Reduz 1 dano (1x por rodada)",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Exoesqueleto de combate",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "+1",
      efeito: "Ignora penalidade de carga",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Armadura de campo",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+2",
      defesa: "0",
      efeito: "+1 contra multiplos ataques",
      penalidade: "-2 movimento",
      peso: "Pesado",
      acesso: "Avancado",
    },
    {
      nome: "Exoesqueleto pesado",
      subcategoria: "Protecoes Pesadas",
      tipo: "Pesada",
      resistencia: "+3",
      defesa: "+1",
      efeito: "+1 contra impacto",
      penalidade: "-2 movimento, -1 acao rapida",
      peso: "Pesado",
      acesso: "Raro",
    },
    {
      nome: "Escudo de energia",
      subcategoria: "Escudos e Campos de Energia",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+1",
      efeito: "+1 Defesa contra ataques a distancia",
      penalidade: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Campo de protecao",
      subcategoria: "Escudos e Campos de Energia",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+1",
      efeito: "Reduz 1 dano de todos ataques (1x por rodada)",
      penalidade: "Consome 1 Eter/turno",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Barreira direcional",
      subcategoria: "Escudos e Campos de Energia",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+2",
      efeito: "+2 Defesa frontal",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Campo adaptativo",
      subcategoria: "Escudos e Campos de Energia",
      tipo: "Escudo",
      resistencia: "+1",
      defesa: "+1",
      efeito: "Reduz 1 dano do mesmo tipo consecutivo",
      penalidade: "Consome 1 Eter/turno",
      peso: "Medio",
      acesso: "Raro",
    },
    {
      nome: "Traje de fase",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "+2",
      efeito: "Pode ignorar 1 ataque por combate",
      penalidade: "Consome 1 Eter",
      peso: "Leve",
      acesso: "Raro",
    },
    {
      nome: "Armadura dimensional",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "+1",
      efeito: "Reduz dano de area em 1",
      penalidade: "-1 movimento",
      peso: "Medio",
      acesso: "Raro",
    },
    {
      nome: "Nucleo de sobrecarga",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "0",
      efeito: "+2 Resistencia por 1 turno (1x por combate)",
      penalidade: "Sofre 1 dano apos",
      peso: "Medio",
      acesso: "Especial",
    },
    {
      nome: "Campo de distorcao",
      subcategoria: "Protecoes Especiais",
      tipo: "Especial",
      resistencia: "+1",
      defesa: "+2",
      efeito: "Inimigos sofrem -1 acerto contra voce",
      penalidade: "Consome 1 Eter/turno",
      peso: "Leve",
      acesso: "Especial",
    },
  ],
};

const EQUIPMENT_UTILITIES_BY_ERA: Record<
  EquipmentEra,
  EquipmentUtilityEntry[]
> = {
  Medieval: [
    {
      nome: "Kit medico simples",
      subcategoria: "Suporte e Sobrevivencia",
      tipo: "Suporte",
      efeito: "Remove 1 Machucado fora de combate",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Bandagens",
      subcategoria: "Suporte e Sobrevivencia",
      tipo: "Suporte",
      efeito: "+1 em testes de recuperacao",
      limite: "Consumo",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Ervas medicinais",
      subcategoria: "Suporte e Sobrevivencia",
      tipo: "Suporte",
      efeito: "Remove 1 penalidade leve",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Antidoto",
      subcategoria: "Suporte e Sobrevivencia",
      tipo: "Suporte",
      efeito: "Remove efeito de veneno",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Racao",
      subcategoria: "Suporte e Sobrevivencia",
      tipo: "Sobrevivencia",
      efeito: "Evita penalidades por desgaste",
      limite: "Consumo",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Corda",
      subcategoria: "Exploracao",
      tipo: "Exploracao",
      efeito: "Facilita escalada e descida",
      limite: "-",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Gancho",
      subcategoria: "Exploracao",
      tipo: "Exploracao",
      efeito: "Permite alcancar locais elevados",
      limite: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Tocha",
      subcategoria: "Exploracao",
      tipo: "Exploracao",
      efeito: "Ilumina area",
      limite: "Duracao",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Lanterna",
      subcategoria: "Exploracao",
      tipo: "Exploracao",
      efeito: "Iluminacao estavel",
      limite: "Duracao",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Kit de ferramentas",
      subcategoria: "Exploracao",
      tipo: "Exploracao",
      efeito: "+2 em testes tecnicos",
      limite: "-",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Oleo",
      subcategoria: "Utilidade Tatica",
      tipo: "Tatico",
      efeito: "Cria area escorregadia",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Bomba de fumaca",
      subcategoria: "Utilidade Tatica",
      tipo: "Tatico",
      efeito: "Bloqueia visao",
      limite: "1 uso",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Caltrap",
      subcategoria: "Utilidade Tatica",
      tipo: "Tatico",
      efeito: "Reduz movimentacao inimiga",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Rede",
      subcategoria: "Utilidade Tatica",
      tipo: "Tatico",
      efeito: "Imobiliza parcialmente",
      limite: "1 uso",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Apito",
      subcategoria: "Utilidade Tatica",
      tipo: "Tatico",
      efeito: "Comunicacao ou distracao",
      limite: "-",
      peso: "Leve",
      acesso: "Comum",
    },
  ],
  Moderno: [
    {
      nome: "Kit medico avancado",
      subcategoria: "Suporte",
      tipo: "Suporte",
      efeito: "Remove 1 Machucado ou 1 Ferimento leve",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Estimulante",
      subcategoria: "Suporte",
      tipo: "Suporte",
      efeito: "Ignora penalidade por 1 turno",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Antidoto quimico",
      subcategoria: "Suporte",
      tipo: "Suporte",
      efeito: "Remove efeitos de toxina",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Radio",
      subcategoria: "Tecnologia",
      tipo: "Comunicacao",
      efeito: "Comunicacao a distancia",
      limite: "-",
      peso: "Leve",
      acesso: "Comum",
    },
    {
      nome: "Drone simples",
      subcategoria: "Tecnologia",
      tipo: "Tecnologia",
      efeito: "+2 em percepcao remota",
      limite: "Duracao",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Tablet tatico",
      subcategoria: "Tecnologia",
      tipo: "Tecnologia",
      efeito: "+1 em testes de analise",
      limite: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Flashbang",
      subcategoria: "Taticos",
      tipo: "Tatico",
      efeito: "Aplica cegueira leve",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Granada",
      subcategoria: "Taticos",
      tipo: "Tatico",
      efeito: "Dano fixo em area",
      limite: "1 uso",
      peso: "Medio",
      acesso: "Comum",
    },
    {
      nome: "Gas lacrimogeneo",
      subcategoria: "Taticos",
      tipo: "Tatico",
      efeito: "Reduz acoes inimigas",
      limite: "1 uso",
      peso: "Medio",
      acesso: "Avancado",
    },
  ],
  Futurista: [
    {
      nome: "Injetor de Eter",
      subcategoria: "Suporte de Eter",
      tipo: "Eter",
      efeito: "Recupera 5 Eter",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Celula de energia",
      subcategoria: "Suporte de Eter",
      tipo: "Eter",
      efeito: "+1 uso de tecnica",
      limite: "1 uso",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Amplificador de Eter",
      subcategoria: "Suporte de Eter",
      tipo: "Eter",
      efeito: "+1 em testes de tecnica",
      limite: "Duracao",
      peso: "Medio",
      acesso: "Raro",
    },
    {
      nome: "Sensor de Eter",
      subcategoria: "Tecnologia Avancada",
      tipo: "Tecnologia",
      efeito: "+2 em deteccao de energia",
      limite: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Drone avancado",
      subcategoria: "Tecnologia Avancada",
      tipo: "Tecnologia",
      efeito: "Visao ampliada + suporte tatico",
      limite: "Duracao",
      peso: "Medio",
      acesso: "Avancado",
    },
    {
      nome: "Dispositivo de hack",
      subcategoria: "Tecnologia Avancada",
      tipo: "Tecnologia",
      efeito: "+2 em interacoes tecnologicas",
      limite: "-",
      peso: "Leve",
      acesso: "Avancado",
    },
    {
      nome: "Granada gravitacional",
      subcategoria: "Controle e Campo",
      tipo: "Controle",
      efeito: "Puxa inimigos",
      limite: "1 uso",
      peso: "Medio",
      acesso: "Raro",
    },
    {
      nome: "Campo de distorcao",
      subcategoria: "Controle e Campo",
      tipo: "Controle",
      efeito: "-1 acerto inimigo",
      limite: "Duracao",
      peso: "Medio",
      acesso: "Raro",
    },
    {
      nome: "Emissor de pulso",
      subcategoria: "Controle e Campo",
      tipo: "Controle",
      efeito: "Empurra inimigos",
      limite: "1 uso",
      peso: "Medio",
      acesso: "Avancado",
    },
  ],
};

const DICE_OPTIONS: Dice[] = ["D4", "D6", "D8", "D10", "D12"];
const COMBAT_DICE_OPTIONS: CombatDice[] = ["-", ...DICE_OPTIONS];

/** SVG polygon points for each die shape (null = uses <rect> for D6). */
const DICE_POLYGON_POINTS: Record<Dice, string | null> = {
  D4: "12,3 21,20 3,20",
  D6: null,
  D8: "12,2 22,12 12,22 2,12",
  D10: "12,2 20,10 17,21 7,21 4,10",
  D12: "12,2 19.8,7.6 19.8,16.4 12,22 4.2,16.4 4.2,7.6",
};
const NAIPE_IDENTITY_OPTIONS: Array<{
  value: Naipe;
  label: string;
  icon: string;
  tone: "none" | "espadas" | "ouros" | "copas" | "paus";
}> = [
  { value: "Espadas", label: "Espadas", icon: "♠", tone: "espadas" },
  { value: "Ouros", label: "Ouros", icon: "◆", tone: "ouros" },
  { value: "Copas", label: "Copas", icon: "♥", tone: "copas" },
  { value: "Paus", label: "Paus", icon: "♣", tone: "paus" },
];
const NAIPE_PODERES: NaipePoder[] = ["Espadas", "Ouros", "Paus", "Copas"];
const EDITOR_TABS: EditorTabDefinition[] = [
  {
    id: "identidade",
    label: "Identidade",
    descricao:
      "Defina nome, conceito, nivel e naipe. Esta base orienta custos, afinidades e estilo da ficha.",
  },
  {
    id: "base",
    label: "Atributos",
    descricao:
      "Configure atributos, recursos, carga, movimento e combate. Aqui fica o nucleo mecanico do personagem.",
  },
  {
    id: "pericias",
    label: "Pericias",
    descricao:
      "Distribua graduacoes tecnicas e de conhecimento respeitando os limites por nivel.",
  },
  {
    id: "tecnicas",
    label: "Fluxos",
    descricao:
      "Ajuste graduacoes dos Fluxos Naturais e acompanhe Valor Efetivo, custo de Eter e limitacoes.",
  },
  {
    id: "tecnicas-desenvolvimento",
    label: "Tecnicas",
    descricao:
      "Cadastre tecnicas Primarias, Avancadas e Especiais com poderes base, modificadores, reducoes e custo final em PE.",
  },
  {
    id: "vantagens",
    label: "Vantagens",
    descricao:
      "Adicione talentos e especializacoes para montar o perfil estrategico do personagem.",
  },
  {
    id: "desvantagens",
    label: "Desvantagens",
    descricao:
      "Defina limitacoes narrativas e mecanicas para ganhar PP adicional dentro das regras de limite.",
  },
  {
    id: "poderes",
    label: "Poderes",
    descricao:
      "Monte o arsenal por naipe, ajuste graduacoes, extras e falhas e acompanhe custo final.",
  },
  {
    id: "equipamentos",
    label: "Equipamentos",
    descricao:
      "Organize itens, armas, utilitarios e observacoes de carga para consulta rapida em jogo.",
  },
];
const ALL_POWERS: PowerDefinition[] = Object.values(PODERES_POR_NAIPE).flat();
const POWER_BY_ID = new Map(ALL_POWERS.map((power) => [power.id, power]));

const TECHNIQUE_PP_BY_TYPE: Record<DevelopedTechniqueType, number> = {
  Primaria: 4,
  Avancada: 8,
  Especial: 12,
};

const TECHNIQUE_ADDITIONAL_LIMIT_BY_TYPE: Record<
  DevelopedTechniqueType,
  number
> = {
  Primaria: 5,
  Avancada: 10,
  Especial: 16,
};

const ATTACK_MULTIPLE_COST: Record<"1" | "2" | "3", number> = {
  "1": 0,
  "2": 1,
  "3": 2,
};

const AREA_COST: Record<"" | "3m" | "5m" | "10m", number> = {
  "": 0,
  "3m": 2,
  "5m": 3,
  "10m": 5,
};

const CONTROLE_COST: Record<"" | "Leve" | "Moderado" | "Forte", number> = {
  "": 0,
  Leve: 1,
  Moderado: 2,
  Forte: 4,
};

const ALCANCE_ETAPAS_COST: Record<"0" | "1" | "2" | "3" | "4", number> = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 4,
  "4": 7,
};

const DURACAO_COST: Record<"" | "Sustentada" | "Continua", number> = {
  "": 0,
  Sustentada: 2,
  Continua: 4,
};

const QUICK_ACTIVATION_COST: Record<"" | "Livre" | "Reacao", number> = {
  "": 0,
  Livre: 3,
  Reacao: 3,
};

const PREPARATION_REDUCTION: Record<
  "" | "preparacao" | "turno-completo",
  number
> = {
  "": 0,
  preparacao: 1,
  "turno-completo": 2,
};

const getPrecisaoCost = (bonusPrecisao: number): number => {
  if (bonusPrecisao <= 0) return 0;
  if (bonusPrecisao === 1) return 1;
  if (bonusPrecisao === 2) return 3;
  return 5;
};

const createDevelopedTechniqueModifierDefaults =
  (): DevelopedTechniqueModifierSet => ({
    bonusDano: "0",
    bonusPrecisao: "0",
    penetracao: "0",
    danoAmpliado: "0",
    ataqueMultiplo: "1",
    area: "",
    controleNivel: "",
    controleEstado: "",
    controleAtributoResistencia: "Vontade",
    alcanceEtapas: "0",
    duracao: "",
    duracaoEstendida: false,
    ativacaoRapida: "",
    preparacao: "",
    bonusDefesa: "0",
    reducaoDanoRecebido: "0",
    absorcao: false,
    reflexo: false,
    limitacaoPerdeMovimento: false,
    limitacaoCondicaoEspecifica: false,
    limitacaoContatoDireto: false,
    limitacaoAlvoEspecifico: false,
    limitacaoUsoCena: false,
    modificadorPersonalizadoNome: "",
    modificadorPersonalizadoCusto: "0",
  });

const createEmptyDevelopedTechniqueBasePower =
  (): DevelopedTechniqueBasePower => ({
    id: crypto.randomUUID(),
    powerId: "",
    graduacao: "1",
  });

const createDevelopedTechniqueDraft = (): DevelopedTechniqueDraft => ({
  nome: "",
  tipo: "Primaria",
  conceito: "",
  efeito: "",
  acao: "Padrao",
  alcance: "Corpo a corpo",
  alvo: "1 criatura",
  duracao: "Instantanea",
  gatilho: "",
  poderesBase: [createEmptyDevelopedTechniqueBasePower()],
  modificadores: createDevelopedTechniqueModifierDefaults(),
});

const ATTRIBUTE_PP_BY_DICE: Record<Dice, number> = {
  D4: 0,
  D6: 3,
  D8: 7,
  D10: 12,
  D12: 18,
};

const COMBAT_PP_BY_DICE: Record<CombatDice, number> = {
  "-": 0,
  D4: 3,
  D6: 7,
  D8: 12,
  D10: 18,
  D12: 25,
};

const ATTRIBUTE_PROGRESS_TOOLTIP =
  "Custo de atributos por evolucao: D4->D6 = 3 PP, D6->D8 = 4 PP, D8->D10 = 5 PP, D10->D12 = 6 PP.";

const ATTRIBUTE_DETAIL_TOOLTIPS: Record<Atributo, string> = {
  Forca:
    "Representa poder fisico bruto e capacidade de causar dano. Usado para dano fisico, levantar peso, empurrar inimigos e feitos de forca. Tambem determina o Dano Base do personagem.",
  Constituicao:
    "Representa resistencia fisica, vitalidade e capacidade de suportar dano. Usado para resistir a ferimentos, venenos e fadiga. Tambem determina a base da Resistencia do personagem.",
  Agilidade:
    "Representa velocidade e reflexos. Usado para esquiva e acrobacias. Tambem determina a base de Movimento e Defesa Base do personagem.",
  Tecnica:
    "Representa controle do Eter. Usado para manipular energia e usar tecnicas. Tambem determina a base de Eter Inicial do personagem.",
  Intelecto:
    "Representa raciocinio e conhecimento. Usado para investigacao e estrategia.",
  Presenca:
    "Representa forca emocional e impacto social. Usado para lideranca e intimidacao.",
  Vontade:
    "Representa forca mental, disciplina emocional e resistencia psiquica. Usado para resistir a controle mental, manter concentracao sob pressao e evitar medo, panico ou colapso.",
};

const COMBAT_PROGRESS_TOOLTIP =
  "Custo de CaC/Disparo por evolucao: Sem dado->D4 = 3 PP, D4->D6 = 4 PP, D6->D8 = 5 PP, D8->D10 = 6 PP, D10->D12 = 7 PP.";

const COMBAT_DICE_DETAIL_TOOLTIPS = {
  ataqueCac:
    "Ataque Corpo a Corpo representa sua capacidade ofensiva em combate fisico direto.",
  disparo:
    "Disparo representa sua capacidade ofensiva com armas e ataques a distancia.",
} as const;

const DEFESA_TOTAL_TOOLTIP =
  "Defesa Total = 6 + bonus de Agilidade + Defesa Comprada. Limite: Defesa Total <= 18 + Nivel.";

const DEFESA_BASE_HUMANA_TOOLTIP =
  "é a base de reflexos natural de todos os humanos.";

const DEFESA_AGILIDADE_TOOLTIP =
  "Este número vem como bônus do atributo Agilidade, representando personagens naturalmente mais ágeis e rápidos.";

const DEFESA_COMPRADA_TOOLTIP =
  "Defesa comprada vem do Eter, como um reflexo adicional fortalecido pelo fluxo de energia no corpo.";

const RESISTENCIA_BASE_TOOLTIP =
  "Resistencia Base vem do bônus de Constituição (D4=+0, D6=+1, D8=+2, D10=+3, D12=+4).";

const RESISTENCIA_PODERES_TOOLTIP =
  "Resistencia de Poderes vem de metade da graduação do poder selecionado em Resistencia de Poder, arredondada para cima (ex.: Protecao, Campo de Forca, Blindagem, Conversao).";

const RESISTENCIA_TOTAL_TOOLTIP =
  "Resistencia Total = Resistencia Base + Resistencia de Poderes. Limite: Resistencia Total <= 6 + Nivel.";

const DANO_BASE_TOOLTIP =
  "Dano Base vem do bonus de Forca (D4=+0, D6=+1, D8=+2, D10=+3, D12=+4).";

const VIDA_MAX_TOOLTIP =
  "Vida Max e derivada da Constituicao: D4=38, D6=46, D8=54, D10=62, D12=70.";

const ETER_MAX_TOOLTIP =
  "Eter Max e derivado de Tecnica: D4=38, D6=46, D8=54, D10=62, D12=70.";

const CARGA_TOOLTIP =
  "Carga maxima e o peso total que o personagem carrega sem dificuldade. Inclui equipamentos, armas, armaduras e objetos. E derivada de Forca: D4=25 kg, D6=50 kg, D8=100 kg, D10=200 kg, D12=400 kg. Acima do limite pode haver penalidades em movimento e testes fisicos, a criterio do mestre.";

const MOVIMENTO_TOOLTIP =
  "Movimentacao e o deslocamento por turno em condicoes normais e usa acao de movimento. E derivada de Agilidade: D4=6 m, D6=9 m, D8=12 m, D10=15 m, D12=18 m. Terreno dificil, obstaculos e efeitos especiais podem reduzir ou aumentar esse valor temporariamente.";

const BONUS_BY_DICE: Record<Dice, number> = {
  D4: 0,
  D6: 1,
  D8: 2,
  D10: 3,
  D12: 4,
};

const VIDA_BASE_POR_CONSTITUICAO: Record<Dice, number> = {
  D4: 38,
  D6: 46,
  D8: 54,
  D10: 62,
  D12: 70,
};

const ETER_BASE_POR_TECNICA: Record<Dice, number> = {
  D4: 38,
  D6: 46,
  D8: 54,
  D10: 62,
  D12: 70,
};

const MOVIMENTO_BASE_POR_AGILIDADE: Record<Dice, number> = {
  D4: 6,
  D6: 9,
  D8: 12,
  D10: 15,
  D12: 18,
};

const CARGA_BASE_POR_FORCA: Record<Dice, number> = {
  D4: 25,
  D6: 50,
  D8: 100,
  D10: 200,
  D12: 400,
};

const DEFESA_BASE = 6;
const DEFESA_PP_POR_PONTO = 3;
const RESISTENCIA_PODERES_POSSIVEIS: Exclude<ResistancePowerSource, "">[] = [
  "Protecao",
  "Campo de Forca",
  "Blindagem",
  "Conversao",
];

const parseNatural = (value: string): number => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
};

const createEmptyConhecimento = (): ConhecimentoEntry => ({
  area: "",
  graduacoes: "0",
});

const isConhecimentoBlank = (conhecimento: ConhecimentoEntry): boolean =>
  conhecimento.area.trim() === "" &&
  parseNatural(conhecimento.graduacoes) === 0;

const isLegacyConhecimentoLayout = (
  conhecimentos: ConhecimentoEntry[],
): boolean =>
  conhecimentos.length === 3 && conhecimentos.every(isConhecimentoBlank);

const getEditableConhecimentos = (
  conhecimentos: ConhecimentoEntry[],
): ConhecimentoEntry[] => {
  if (conhecimentos.length === 0 || isLegacyConhecimentoLayout(conhecimentos)) {
    return [createEmptyConhecimento()];
  }

  return conhecimentos.map((conhecimento) => ({ ...conhecimento }));
};

const normalizeConhecimentos = (
  conhecimentos: ConhecimentoEntry[],
): ConhecimentoEntry[] => {
  const next = conhecimentos.map((conhecimento) => ({ ...conhecimento }));

  while (next.length > 1 && isConhecimentoBlank(next[next.length - 1])) {
    next.pop();
  }

  return next.length > 0 ? next : [createEmptyConhecimento()];
};

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const parsePowerModifierCost = (
  costText: string,
  graduacao: number,
): number => {
  const normalized = costText.toLowerCase();
  if (normalized.includes("eter")) {
    return 0;
  }

  const match = costText.match(/([+-]\d+)/);
  if (!match) {
    return 0;
  }

  const base = Number.parseInt(match[1], 10);
  if (!Number.isFinite(base)) {
    return 0;
  }

  if (normalized.includes("por graduacao")) {
    return base * graduacao;
  }

  if (
    !normalized.includes("fixo") &&
    !normalized.includes("ponto") &&
    !normalized.includes("pontos")
  ) {
    return 0;
  }

  return base;
};

const normalizePowerName = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getPowerGraduacaoForResistenciaFonte = (
  character: CharacterSheet,
  source: Exclude<ResistancePowerSource, "">,
  maxGraduacaoLimit: number,
): number => {
  const normalizedSource = normalizePowerName(source);

  return character.poderes.reduce((maxGraduacao, powerEntry) => {
    const power = POWER_BY_ID.get(powerEntry.powerId);
    if (!power) {
      return maxGraduacao;
    }

    if (normalizePowerName(power.nome) !== normalizedSource) {
      return maxGraduacao;
    }

    const graduacao = clamp(
      parseNatural(powerEntry.graduacao),
      1,
      maxGraduacaoLimit,
    );
    const resistenciaEfetiva = Math.ceil(graduacao / 2);

    return Math.max(maxGraduacao, resistenciaEfetiva);
  }, 0);
};

const NAIPE_LOSANGO: Record<
  NaipePoder,
  { adjacentes: [NaipePoder, NaipePoder]; oposto: NaipePoder }
> = {
  Espadas: { adjacentes: ["Copas", "Paus"], oposto: "Ouros" },
  Ouros: { adjacentes: ["Copas", "Paus"], oposto: "Espadas" },
  Copas: { adjacentes: ["Espadas", "Ouros"], oposto: "Paus" },
  Paus: { adjacentes: ["Espadas", "Ouros"], oposto: "Copas" },
};

const getPowerNaipeMultiplier = (
  personagemNaipe: Naipe,
  poderNaipe: NaipePoder,
): number => {
  if (personagemNaipe === "" || personagemNaipe === poderNaipe) {
    return 1;
  }

  const afinidade = NAIPE_LOSANGO[personagemNaipe as NaipePoder];
  if (afinidade.adjacentes.includes(poderNaipe)) {
    return 2;
  }

  if (afinidade.oposto === poderNaipe) {
    return 3;
  }

  return 1;
};

const getPowerTotalCost = (
  power: PowerDefinition,
  graduacao: number,
  extrasSelecionados: string[],
  falhasSelecionadas: string[],
): number => {
  const graduacaoValida = Math.max(1, graduacao);
  const baseCost =
    power.custoPontosPorGraduacao !== null
      ? power.custoPontosPorGraduacao * graduacaoValida
      : 0;

  const extrasCost = power.extras
    .filter((extra) => extrasSelecionados.includes(extra.nome))
    .reduce(
      (total, extra) =>
        total + parsePowerModifierCost(extra.custo, graduacaoValida),
      0,
    );

  const falhasCost = power.falhas
    .filter((falha) => falhasSelecionadas.includes(falha.nome))
    .reduce(
      (total, falha) =>
        total + parsePowerModifierCost(falha.custo, graduacaoValida),
      0,
    );

  return Math.max(graduacaoValida, baseCost + extrasCost + falhasCost);
};

const formatVantagemCusto = (
  custoPorGraduacao: number,
  temGraduacao: boolean,
): string => `[${custoPorGraduacao} PP${temGraduacao ? "/grad" : ""}]`;

const formatDesvantagemBonus = (
  ppPorGraduacao: number,
  temGraduacao: boolean,
): string => `[+${ppPorGraduacao} PP${temGraduacao ? "/grad" : ""}]`;

const getTecnicaBasicaVE = (graduacao: number): number => {
  if (graduacao <= 0) {
    return 0;
  }

  if (graduacao <= 5) {
    return graduacao;
  }

  return 5 + Math.floor((graduacao - 5) / 2);
};

const getCampoRaio = (graduacao: number): string => {
  if (graduacao <= 0) {
    return "0 m";
  }
  if (graduacao <= 2) {
    return "3 m";
  }
  if (graduacao <= 4) {
    return "7 m";
  }
  if (graduacao <= 6) {
    return "15 m";
  }
  if (graduacao <= 8) {
    return "25 m";
  }
  if (graduacao <= 10) {
    return "50 m";
  }

  return "50 m";
};

const getTecnicaBasicaDerived = (
  tecnica: BasicTechniqueDefinition,
  graduacaoRaw: string,
  limite: number,
) => {
  const graduacao = clamp(parseNatural(graduacaoRaw), 0, limite);
  const ve = getTecnicaBasicaVE(graduacao);
  const custoPE = tecnica.basePE + Math.ceil(ve / 2);

  switch (tecnica.nome) {
    case "Supressao":
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `+${graduacao} em Furtividade; tentativas de detectar por leitura de Eter sofrem -${graduacao}. Criaturas que dependem exclusivamente dessa percepcao sao incapazes de identifica-lo (exceto tecnicas de graduacao superior ou contato direto).`,
      };
    case "Foco":
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `+${graduacao} em Percepcao. Detecta presenca de Eter no ambiente mesmo sem linha de visao direta, identifica ativacoes de tecnicas e movimentacoes de fluxo energetico.`,
      };
    case "Campo": {
      const custoPECampo = 3 + graduacao;
      return {
        graduacao,
        ve,
        custoPE: custoPECampo,
        efeito: `Detecta automaticamente qualquer presenca de Eter na zona sensorial. Efeitos de ocultacao de Eter com graduacao inferior sao anulados. Alcance atual: ${getCampoRaio(graduacao)}.`,
      };
    }
    case "Guarda": {
      const reducao = Math.ceil(graduacao / 2);
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `Reduz em ${reducao} o dano do primeiro ataque sofrido por turno (aplicado apos a Resistencia).`,
      };
    }
    case "Impulso": {
      const bonus = Math.ceil(graduacao / 2);
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `Modo ofensivo: +${bonus} em testes de Ataque; ou modo amplificacao: +${bonus} no Dano causado. Aplica-se apenas ao primeiro ataque do turno.`,
      };
    }
    case "Ruptura": {
      const reducaoReacao = graduacao + Math.floor(graduacao / 2);
      const bonusAtaque = Math.ceil(graduacao / 2);
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `Como Reacao: teste Tecnica (1d20+${graduacao}) vs CD 15 — sucesso reduz ${reducaoReacao} do dano final; falha sem reducao. Como Acao: +${bonusAtaque} no dano do golpe.`,
      };
    }
    default:
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `VE ${ve}`,
      };
  }
};

type PretipoDef = {
  id: string;
  label: string;
  naipe: Exclude<Naipe, "">;
  descricao: string;
  nome: string;
  conceito: string;
  atributos: Record<Atributo, Dice>;
  ataqueCac: CombatDice;
  disparo: CombatDice;
  defesa: string;
  resistenciaPoderFonte: ResistancePowerSource;
  pericias: Partial<Record<(typeof PERICIAS)[number], string>>;
  conhecimentos: ConhecimentoEntry[];
  tecnicasBasicas: Partial<Record<string, string>>;
  vantagens: Array<{ catalogId: string; graduacao: number }>;
  desvantagens: Array<{ catalogId: string; graduacao: number }>;
  poderes: Array<{ powerId: string; graduacao: string }>;
};

const PRETIPOS: PretipoDef[] = [
  // ---- ESPADAS ----
  {
    id: "espadas-batedor",
    label: "Batedor Linha de Frente",
    naipe: "Espadas",
    descricao:
      "Lutador agressivo e veloz. Forca e Agilidade elevadas, CaC poderoso e Canalizar maxima para devastar a linha inimiga.",
    nome: "Kael Veras",
    conceito:
      "Espadachim veloz que canaliza Eter em cada golpe para devastar a linha inimiga.",
    atributos: {
      Forca: "D10",
      Agilidade: "D8",
      Constituicao: "D8",
      Tecnica: "D4",
      Intelecto: "D4",
      Presenca: "D4",
      Vontade: "D6",
    },
    ataqueCac: "D10",
    disparo: "-",
    defesa: "10",
    resistenciaPoderFonte: "",
    pericias: {
      Atletismo: "10",
      Acrobacia: "10",
      Furtividade: "10",
      Percepcao: "10",
      Intimidacao: "8",
      Concentracao: "8",
      Investigacao: "8",
      Sobrevivencia: "8",
      Intuicao: "8",
    },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Impulso: "6", Ruptura: "4" },
    vantagens: [
      { catalogId: "acao-em-movimento", graduacao: 1 },
      { catalogId: "critico-aprimorado", graduacao: 1 },
      { catalogId: "ataque-poderoso", graduacao: 1 },
    ],
    desvantagens: [{ catalogId: "reacao-lenta", graduacao: 1 }],
    poderes: [
      { powerId: "espadas-canalizar", graduacao: "9" },
      { powerId: "espadas-rapidez", graduacao: "7" },
      { powerId: "espadas-surto-adrenalina", graduacao: "5" },
    ],
  },
  {
    id: "espadas-tank",
    label: "Tank Indomavel",
    naipe: "Espadas",
    descricao:
      "Linha de frente defensiva. Alta Constituicao e Vontade, Protecao e Regeneracao maximas para sobreviver a qualquer dano.",
    nome: "Seila Guarda",
    conceito:
      "Guerreiro colossal que absorve todo dano inimigo enquanto sua Eter o reconstroi continuamente.",
    atributos: {
      Forca: "D6",
      Agilidade: "D4",
      Constituicao: "D10",
      Tecnica: "D8",
      Intelecto: "D4",
      Presenca: "D4",
      Vontade: "D10",
    },
    ataqueCac: "D8",
    disparo: "-",
    defesa: "10",
    resistenciaPoderFonte: "Protecao",
    pericias: {
      Atletismo: "10",
      Concentracao: "10",
      Intimidacao: "10",
      Percepcao: "6",
      Medicina: "10",
      Sobrevivencia: "10",
    },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Guarda: "8", Ruptura: "5" },
    vantagens: [
      { catalogId: "duro-de-matar", graduacao: 1 },
      { catalogId: "defesa-aprimorada", graduacao: 1 },
      { catalogId: "recuperacao-rapida", graduacao: 1 },
    ],
    desvantagens: [
      { catalogId: "reacao-lenta", graduacao: 1 },
      { catalogId: "presenca-intimidadora", graduacao: 1 },
    ],
    poderes: [
      { powerId: "espadas-protecao", graduacao: "10" },
      { powerId: "espadas-regeneracao", graduacao: "8" },
    ],
  },
  {
    id: "espadas-atacante-interno",
    label: "Atacante Interno",
    naipe: "Espadas",
    descricao:
      "Combatente que corroi o inimigo com poderes indiretos. Usa Desgaste, Enfraquecer e Aura para drenar antes do golpe.",
    nome: "Morrigan Vex",
    conceito:
      "Guerreiro que corroi o inimigo por dentro com Eter, enfraquecendo cada fibra antes do golpe final.",
    atributos: {
      Forca: "D8",
      Agilidade: "D8",
      Constituicao: "D6",
      Tecnica: "D10",
      Intelecto: "D6",
      Presenca: "D4",
      Vontade: "D8",
    },
    ataqueCac: "D8",
    disparo: "D4",
    defesa: "9",
    resistenciaPoderFonte: "",
    pericias: {
      "Analise de Eter": "10",
      Concentracao: "10",
      Percepcao: "10",
    },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Foco: "5", Impulso: "5", Ruptura: "4" },
    vantagens: [
      { catalogId: "pressao-de-eter", graduacao: 1 },
      { catalogId: "controle-eter", graduacao: 1 },
      { catalogId: "tecnica-eficiente", graduacao: 1 },
    ],
    desvantagens: [
      { catalogId: "impaciente", graduacao: 1 },
      { catalogId: "codigo-de-honra", graduacao: 1 },
    ],
    poderes: [
      { powerId: "espadas-desgaste", graduacao: "10" },
      { powerId: "espadas-enfraquecer", graduacao: "7" },
      { powerId: "espadas-aura", graduacao: "5" },
    ],
  },
  // ---- OUROS ----
  {
    id: "ouros-invocador",
    label: "Invocador",
    naipe: "Ouros",
    descricao:
      "Conjurador especializado. Invoca entidades, constroi construtos e cria estruturas para dominar o campo de batalha.",
    nome: "Dalton Rune",
    conceito:
      "Mago que molda o Eter em criaturas e construtos obedientes para lutar em seu lugar.",
    atributos: {
      Forca: "D4",
      Agilidade: "D4",
      Constituicao: "D6",
      Tecnica: "D10",
      Intelecto: "D10",
      Presenca: "D6",
      Vontade: "D8",
    },
    ataqueCac: "-",
    disparo: "D6",
    defesa: "7",
    resistenciaPoderFonte: "",
    pericias: {
      "Analise de Eter": "10",
      Concentracao: "10",
      Investigacao: "10",
      Percepcao: "10",
      Intuicao: "8",
      Medicina: "8",
      Sobrevivencia: "8",
    },
    conhecimentos: [
      { area: "Arcano", graduacoes: "10" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Foco: "6", Campo: "6" },
    vantagens: [
      { catalogId: "reserva-de-eter", graduacao: 2 },
      { catalogId: "deteccao-de-eter", graduacao: 1 },
      { catalogId: "controle-eter", graduacao: 1 },
    ],
    desvantagens: [
      { catalogId: "timido", graduacao: 1 },
      { catalogId: "fobia", graduacao: 1 },
    ],
    poderes: [
      { powerId: "ouros-invocar", graduacao: "8" },
      { powerId: "ouros-construto", graduacao: "7" },
      { powerId: "ouros-criar", graduacao: "5" },
    ],
  },
  {
    id: "ouros-suporte-cura",
    label: "Suporte Cura",
    naipe: "Ouros",
    descricao:
      "Curandeiro de campo. Alta Presenca e Tecnica, focado em Cura instantanea, Potencializar aliados e Deflexao.",
    nome: "Laura Mares",
    conceito:
      "Medica que canaliza Eter em curas instantaneas e potencializa os aliados no campo de batalha.",
    atributos: {
      Forca: "D4",
      Agilidade: "D4",
      Constituicao: "D8",
      Tecnica: "D10",
      Intelecto: "D8",
      Presenca: "D10",
      Vontade: "D8",
    },
    ataqueCac: "D4",
    disparo: "-",
    defesa: "8",
    resistenciaPoderFonte: "",
    pericias: {
      Medicina: "10",
      Intuicao: "10",
      Persuasao: "10",
      Concentracao: "10",
      "Analise de Eter": "10",
      Percepcao: "10",
      Investigacao: "10",
    },
    conhecimentos: [
      { area: "Ciencias biologicas", graduacoes: "10" },
      { area: "Teologia e filosofia", graduacoes: "10" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Foco: "5", Guarda: "4" },
    vantagens: [
      { catalogId: "recuperacao-rapida", graduacao: 1 },
      { catalogId: "tecnica-eficiente", graduacao: 1 },
      { catalogId: "lideranca", graduacao: 1 },
      { catalogId: "trabalho-em-equipe", graduacao: 1 },
    ],
    desvantagens: [
      { catalogId: "dependente-de-aprovacao", graduacao: 1 },
      { catalogId: "timido", graduacao: 1 },
    ],
    poderes: [
      { powerId: "ouros-cura", graduacao: "10" },
      { powerId: "ouros-potencializar", graduacao: "7" },
      { powerId: "ouros-deflexao", graduacao: "6" },
    ],
  },
  {
    id: "ouros-criador-atacante",
    label: "Criador/Atacante",
    naipe: "Ouros",
    descricao:
      "Combatente tecnico. Cria armas de Eter, barreiras e dispara projeteis calibrados com precisao cirurgica.",
    nome: "Orion Fabre",
    conceito:
      "Engenheiro do Eter que forja armas e campos de forca no meio da batalha para atacar com precisao.",
    atributos: {
      Forca: "D6",
      Agilidade: "D6",
      Constituicao: "D6",
      Tecnica: "D10",
      Intelecto: "D10",
      Presenca: "D4",
      Vontade: "D8",
    },
    ataqueCac: "D6",
    disparo: "D8",
    defesa: "9",
    resistenciaPoderFonte: "Campo de Forca",
    pericias: {
      "Analise de Eter": "4",
      Investigacao: "4",
    },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Foco: "4", Impulso: "5", Ruptura: "4" },
    vantagens: [
      { catalogId: "pressao-de-eter", graduacao: 1 },
      { catalogId: "controle-eter", graduacao: 1 },
      { catalogId: "mira-aprimorada", graduacao: 1 },
    ],
    desvantagens: [{ catalogId: "excesso-de-confianca", graduacao: 1 }],
    poderes: [
      { powerId: "ouros-arsenal", graduacao: "8" },
      { powerId: "ouros-campo-de-forca", graduacao: "8" },
      { powerId: "ouros-calibrar", graduacao: "7" },
      { powerId: "ouros-criar", graduacao: "5" },
    ],
  },
  // ---- PAUS ----
  {
    id: "paus-camaleao",
    label: "Camaleao",
    naipe: "Paus",
    descricao:
      "Infiltrador e transformista. Camuflagem, Invisibilidade e Imitacao para se adaptar a qualquer situacao.",
    nome: "Sable Rexx",
    conceito:
      "Espiao que altera a propria forma e presenca para se tornar invisivel e irreconhecivel.",
    atributos: {
      Forca: "D4",
      Agilidade: "D10",
      Constituicao: "D6",
      Tecnica: "D8",
      Intelecto: "D8",
      Presenca: "D6",
      Vontade: "D6",
    },
    ataqueCac: "D8",
    disparo: "D4",
    defesa: "12",
    resistenciaPoderFonte: "",
    pericias: {
      Furtividade: "10",
      Acrobacia: "10",
      Enganar: "10",
      Ladinagem: "10",
      Percepcao: "10",
      Persuasao: "10",
      Investigacao: "10",
      Intuicao: "8",
      "Analise de Eter": "8",
      Atletismo: "10",
      Concentracao: "8",
    },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Supressao: "8", Foco: "5" },
    vantagens: [
      { catalogId: "faz-tudo", graduacao: 1 },
      { catalogId: "maestria-em-pericia", graduacao: 1 },
      { catalogId: "rastreador", graduacao: 1 },
    ],
    desvantagens: [{ catalogId: "obsessivo", graduacao: 1 }],
    poderes: [
      { powerId: "paus-camuflagem", graduacao: "10" },
      { powerId: "paus-invisibilidade", graduacao: "7" },
      { powerId: "paus-imitacao", graduacao: "5" },
    ],
  },
  {
    id: "paus-atacante-multiplo",
    label: "Atacante Multiplo",
    naipe: "Paus",
    descricao:
      "Combatente de multiplos ataques. Membros extras, elasticidade e crescimento corporal para atingir de todas as direcoes.",
    nome: "Brix Tempa",
    conceito:
      "Lutador que expande seu corpo com Eter para desferir golpes simultaneos de todas as direcoes.",
    atributos: {
      Forca: "D10",
      Agilidade: "D10",
      Constituicao: "D6",
      Tecnica: "D6",
      Intelecto: "D4",
      Presenca: "D4",
      Vontade: "D8",
    },
    ataqueCac: "D10",
    disparo: "D4",
    defesa: "11",
    resistenciaPoderFonte: "",
    pericias: {
      Atletismo: "10",
      Acrobacia: "10",
      Concentracao: "10",
      Intimidacao: "10",
      Percepcao: "10",
      Furtividade: "8",
      Sobrevivencia: "8",
      Intuicao: "8",
      Investigacao: "8",
      Medicina: "4",
    },
    conhecimentos: [
      { area: "Tatica", graduacoes: "10" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Impulso: "7", Ruptura: "5" },
    vantagens: [
      { catalogId: "acao-em-movimento", graduacao: 1 },
      { catalogId: "ataque-domino", graduacao: 1 },
      { catalogId: "critico-aprimorado", graduacao: 1 },
    ],
    desvantagens: [{ catalogId: "impaciente", graduacao: 1 }],
    poderes: [
      { powerId: "paus-membros-extras", graduacao: "10" },
      { powerId: "paus-elasticidade", graduacao: "10" },
      { powerId: "paus-crescimento", graduacao: "7" },
    ],
  },
  {
    id: "paus-brutamontes",
    label: "Brutamontes",
    naipe: "Paus",
    descricao:
      "Forca bruta e durabilidade extrema. Cresce, adensar o corpo e se regenera continuamente para dominar pelo puro volume.",
    nome: "Gordo Ferro",
    conceito:
      "Colosso que cresce ate o tamanho de uma construcao e absorve golpes como se fossem farpas.",
    atributos: {
      Forca: "D10",
      Agilidade: "D4",
      Constituicao: "D10",
      Tecnica: "D6",
      Intelecto: "D4",
      Presenca: "D4",
      Vontade: "D8",
    },
    ataqueCac: "D10",
    disparo: "-",
    defesa: "10",
    resistenciaPoderFonte: "",
    pericias: { Atletismo: "10", Intimidacao: "10", Concentracao: "4" },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Guarda: "7", Impulso: "5" },
    vantagens: [
      { catalogId: "duro-de-matar", graduacao: 1 },
      { catalogId: "ataque-poderoso", graduacao: 1 },
      { catalogId: "interpor-se", graduacao: 1 },
    ],
    desvantagens: [{ catalogId: "sobrecarga-corporal", graduacao: 1 }],
    poderes: [
      { powerId: "paus-crescimento", graduacao: "10" },
      { powerId: "paus-alterar-densidade", graduacao: "10" },
      { powerId: "paus-adaptacao-extrema", graduacao: "5" },
      { powerId: "paus-regeneracao-mutante", graduacao: "5" },
    ],
  },
  // ---- COPAS ----
  {
    id: "copas-poderes-mentais",
    label: "Poderes Mentais",
    naipe: "Copas",
    descricao:
      "Psiquico de alto impacto. Controla mentes, le pensamentos, causa confusao em massa e manipula por telecinese.",
    nome: "Ember Liras",
    conceito:
      "Psiquico que penetra mentes alheias, le intencoes e reescreve comportamentos com seu Eter.",
    atributos: {
      Forca: "D4",
      Agilidade: "D4",
      Constituicao: "D6",
      Tecnica: "D8",
      Intelecto: "D8",
      Presenca: "D8",
      Vontade: "D10",
    },
    ataqueCac: "-",
    disparo: "D6",
    defesa: "7",
    resistenciaPoderFonte: "",
    pericias: {
      Concentracao: "10",
      "Analise de Eter": "10",
      Intuicao: "10",
      Percepcao: "8",
      Investigacao: "8",
      Persuasao: "6",
    },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Foco: "6", Campo: "5" },
    vantagens: [
      { catalogId: "pressao-de-eter", graduacao: 1 },
      { catalogId: "controle-eter", graduacao: 1 },
      { catalogId: "deteccao-de-eter", graduacao: 1 },
    ],
    desvantagens: [
      { catalogId: "timido", graduacao: 1 },
      { catalogId: "instabilidade-emocional", graduacao: 1 },
    ],
    poderes: [
      { powerId: "copas-telecinese", graduacao: "8" },
      { powerId: "copas-leitura-mental", graduacao: "7" },
      { powerId: "copas-controle-mental", graduacao: "6" },
      { powerId: "copas-confusao", graduacao: "5" },
    ],
  },
  {
    id: "copas-poderes-elementais",
    label: "Poderes Elementais",
    naipe: "Copas",
    descricao:
      "Elementalista ofensivo. Domina fogo e eletricidade com Projecao de suporte e Onda Psiquica para controle de area.",
    nome: "Solara Vex",
    conceito:
      "Lancadora de elementos que domina chamas e raios para queimar e paralisar toda a linha inimiga.",
    atributos: {
      Forca: "D4",
      Agilidade: "D6",
      Constituicao: "D6",
      Tecnica: "D10",
      Intelecto: "D8",
      Presenca: "D6",
      Vontade: "D8",
    },
    ataqueCac: "-",
    disparo: "D8",
    defesa: "8",
    resistenciaPoderFonte: "",
    pericias: {
      "Analise de Eter": "10",
      Concentracao: "10",
      Percepcao: "10",
    },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Foco: "7", Impulso: "5", Ruptura: "4" },
    vantagens: [
      { catalogId: "pressao-de-eter", graduacao: 1 },
      { catalogId: "reserva-de-eter", graduacao: 2 },
      { catalogId: "mira-aprimorada", graduacao: 1 },
    ],
    desvantagens: [
      { catalogId: "excesso-de-confianca", graduacao: 1 },
      { catalogId: "arrogante", graduacao: 1 },
    ],
    poderes: [
      { powerId: "copas-manipulacao-de-fogo", graduacao: "8" },
      { powerId: "copas-manipulacao-de-eletricidade", graduacao: "6" },
      { powerId: "copas-projecao", graduacao: "7" },
      { powerId: "copas-onda-psiquica", graduacao: "3" },
    ],
  },
  {
    id: "copas-atacante-generico",
    label: "Atacante Generico com Boa Base",
    naipe: "Copas",
    descricao:
      "Lutador versatil e equilibrado. Atributos solidos em tudo, Projecao e Conversao como base para qualquer situacao.",
    nome: "Marco Celeste",
    conceito:
      "Soldado completo que usa Eter tanto para atacar quanto para converter dano em energia vital.",
    atributos: {
      Forca: "D8",
      Agilidade: "D8",
      Constituicao: "D8",
      Tecnica: "D8",
      Intelecto: "D6",
      Presenca: "D6",
      Vontade: "D8",
    },
    ataqueCac: "D8",
    disparo: "D8",
    defesa: "10",
    resistenciaPoderFonte: "Conversao",
    pericias: {
      Atletismo: "10",
      Acrobacia: "10",
      Percepcao: "10",
      Concentracao: "10",
      Intuicao: "10",
      "Analise de Eter": "8",
    },
    conhecimentos: [
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
      { area: "", graduacoes: "0" },
    ],
    tecnicasBasicas: { Impulso: "5", Ruptura: "4", Guarda: "3" },
    vantagens: [
      { catalogId: "acao-em-movimento", graduacao: 1 },
      { catalogId: "mira-aprimorada", graduacao: 1 },
      { catalogId: "iniciativa-aprimorada", graduacao: 1 },
    ],
    desvantagens: [{ catalogId: "ansiedade", graduacao: 1 }],
    poderes: [
      { powerId: "copas-projecao", graduacao: "9" },
      { powerId: "copas-conversao", graduacao: "7" },
    ],
  },
];

const PRETIPOS_POR_NAIPE: Record<
  Exclude<Naipe, "">,
  PretipoDef[]
> = PRETIPOS.reduce(
  (acc, p) => {
    (acc[p.naipe] ??= []).push(p);
    return acc;
  },
  {} as Record<Exclude<Naipe, "">, PretipoDef[]>,
);

const createEmptyCharacter = (): CharacterSheet => ({
  id: crypto.randomUUID(),
  nome: "",
  imagemUrl: "",
  nivel: "0",
  jogador: "",
  xp: "0",
  conceito: "",
  naipe: "",
  carga: "",
  mov: "",
  periciasExtra: "0",
  atributos: Object.fromEntries(
    ATRIBUTOS.map((item) => [item, "D4"]),
  ) as Record<Atributo, Dice>,
  combate: {
    ataqueCac: "-",
    disparo: "-",
    resistenciaPoderFonte: "",
    defesa: "6",
  },
  pericias: Object.fromEntries(PERICIAS.map((item) => [item, "0"])) as Record<
    string,
    string
  >,
  conhecimentos: [createEmptyConhecimento()],
  tecnicasBasicas: Object.fromEntries(
    TECNICAS_BASICAS.map((item) => [item.nome, { graduacao: "" }]),
  ) as Record<string, { graduacao: string }>,
  vantagens: [],
  desvantagens: [],
  poderes: [],
  tecnicasDesenvolvidas: [],
  equipamentos: "",
});

const normalizeCharacterSheet = (character: CharacterSheet): CharacterSheet => {
  const fallback = createEmptyCharacter();

  // Filter out endpoint URLs from imagemUrl (preserve only base64 for editing)
  let imagemUrl = character.imagemUrl || fallback.imagemUrl;
  if (imagemUrl && isApiImageUrl(imagemUrl)) {
    // This is an endpoint URL, clear it (will use imagemViewUrl for display instead)
    imagemUrl = fallback.imagemUrl;
  }

  return {
    ...fallback,
    ...character,
    atributos: {
      ...fallback.atributos,
      ...(character.atributos ?? {}),
    },
    combate: {
      ...fallback.combate,
      ...(character.combate ?? {}),
    },
    pericias: {
      ...fallback.pericias,
      ...(character.pericias ?? {}),
    },
    conhecimentos: normalizeConhecimentos(character.conhecimentos),
    tecnicasBasicas: {
      ...fallback.tecnicasBasicas,
      ...(character.tecnicasBasicas ?? {}),
    },
    tecnicasDesenvolvidas: Array.isArray(character.tecnicasDesenvolvidas)
      ? character.tecnicasDesenvolvidas
      : [],
    imagemUrl,
    imagemViewUrl: character.imagemViewUrl,
  };
};

function useAnimatedCounter(
  target: number,
  duration = 500,
  precision = 0,
): number {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const displayRef = useRef<number>(target);
  const factor = 10 ** precision;

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const from = displayRef.current;
    const diff = target - from;
    if (diff === 0) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round((from + diff * eased) * factor) / factor;
      displayRef.current = current;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        displayRef.current = target;
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, duration, factor]);

  return display;
}

const formatAnimatedNumber = (value: number, precision: number): string => {
  if (precision <= 0) {
    return String(Math.round(value));
  }

  return value
    .toFixed(precision)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1");
};

function AnimatedNumber({
  value,
  className,
  precision = 0,
}: {
  value: number;
  className?: string;
  precision?: number;
}) {
  const display = useAnimatedCounter(value, 500, precision);
  const [pulseKey, setPulseKey] = useState(0);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setPulseKey((k) => k + 1);
  }, [value]);

  return (
    <span
      key={pulseKey}
      className={`anim-number${className ? ` ${className}` : ""}`}
    >
      {formatAnimatedNumber(display, precision)}
    </span>
  );
}

function NumericStepperInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  className,
  disabled = false,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const maxBound = max ?? Number.MAX_SAFE_INTEGER;
  const parsedValue = parseNatural(value);
  const isAtMin = parsedValue <= min;
  const isAtMax = max !== undefined && parsedValue >= max;

  const handleStep = (direction: -1 | 1) => {
    if (disabled) {
      return;
    }

    const nextValue = clamp(parsedValue + direction * step, min, maxBound);

    onChange(String(nextValue));
  };

  const handleInputChange = (rawValue: string) => {
    const nextValue = clamp(parseNatural(rawValue), min, maxBound);
    onChange(String(nextValue));
  };

  return (
    <div className={`number-stepper${className ? ` ${className}` : ""}`}>
      <button
        type="button"
        className="number-stepper-button"
        onClick={() => handleStep(-1)}
        disabled={disabled || isAtMin}
        aria-label={ariaLabel ? `Diminuir ${ariaLabel}` : "Diminuir valor"}
      >
        -
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => handleInputChange(event.target.value)}
      />
      <button
        type="button"
        className="number-stepper-button"
        onClick={() => handleStep(1)}
        disabled={disabled || isAtMax}
        aria-label={ariaLabel ? `Aumentar ${ariaLabel}` : "Aumentar valor"}
      >
        +
      </button>
    </div>
  );
}

function App() {
  const restoredDraft = useMemo(() => {
    const loaded = readDraftFromLocalStorage();
    if (!loaded) {
      return null;
    }

    const normalizedCharacters = loaded.characters
      .filter((character): character is CharacterSheet => !!character)
      .map((character) => normalizeCharacterSheet(character));

    if (normalizedCharacters.length === 0) {
      return null;
    }

    const draftActiveGroupId = loaded.activeSheetId
      ? loaded.activeSheetId
      : normalizedCharacters.some(
            (character) => character.id === loaded.selectedId,
          )
        ? getCharacterPrincipalId(
            normalizedCharacters.find(
              (character) => character.id === loaded.selectedId,
            ) ?? normalizedCharacters[0],
          )
        : getCharacterPrincipalId(normalizedCharacters[0]);

    const scopedCharacters = normalizedCharacters.filter(
      (character) => getCharacterPrincipalId(character) === draftActiveGroupId,
    );

    if (scopedCharacters.length === 0) {
      return null;
    }

    const selectedId = scopedCharacters.some(
      (character) => character.id === loaded.selectedId,
    )
      ? loaded.selectedId
      : scopedCharacters[0].id;

    return {
      ...loaded,
      characters: scopedCharacters,
      selectedId,
      activeSheetId: draftActiveGroupId,
    };
  }, []);

  const freshCharacter = useMemo(() => createEmptyCharacter(), []);

  const [characters, setCharacters] = useState<CharacterSheet[]>(
    () => restoredDraft?.characters ?? [freshCharacter],
  );
  const [selectedId, setSelectedId] = useState<string>(
    () => restoredDraft?.selectedId ?? freshCharacter.id,
  );
  const [screen, setScreen] = useState<AppScreen>(() =>
    getScreenFromPathname(window.location.pathname),
  );
  const [savedSheets, setSavedSheets] = useState<SheetSummary[]>([]);
  const [groupRecords, setGroupRecords] = useState<GroupRecord[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groupSelectModalOpen, setGroupSelectModalOpen] = useState(false);
  const [groupSelectInput, setGroupSelectInput] = useState("");
  const [groupSelectError, setGroupSelectError] = useState("");
  const [groupEditorModalOpen, setGroupEditorModalOpen] = useState(false);
  const [groupEditorKey, setGroupEditorKey] = useState<string | null>(null);
  const [groupEditorName, setGroupEditorName] = useState("");
  const [groupEditorDescription, setGroupEditorDescription] = useState("");
  const [groupEditorPassword, setGroupEditorPassword] = useState("");
  const [groupEditorHasPassword, setGroupEditorHasPassword] = useState(false);
  const [groupEditorRemovePassword, setGroupEditorRemovePassword] =
    useState(false);
  const [groupEditorImageUrl, setGroupEditorImageUrl] = useState("");
  const [groupEditorImageFile, setGroupEditorImageFile] = useState<File | null>(
    null,
  );
  const [groupEditorInitialImageUrl, setGroupEditorInitialImageUrl] =
    useState("");
  const [groupEditorAttachments, setGroupEditorAttachments] = useState<
    GroupAttachment[]
  >([]);
  const [groupEditorInitialAttachmentIds, setGroupEditorInitialAttachmentIds] =
    useState<string[]>([]);
  const [groupEditorError, setGroupEditorError] = useState("");
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [isSavingSheet, setIsSavingSheet] = useState(false);
  const [isUnlockingSheet, setIsUnlockingSheet] = useState(false);
  const [isDeletingSheet, setIsDeletingSheet] = useState(false);
  const [activeSheetId, setActiveSheetId] = useState<string | null>(
    () => restoredDraft?.activeSheetId ?? null,
  );
  const [activeSheetPassword, setActiveSheetPassword] = useState("");
  const [confirmSavePasswordModalOpen, setConfirmSavePasswordModalOpen] =
    useState(false);
  const [confirmSavePasswordInput, setConfirmSavePasswordInput] = useState("");
  const [confirmSavePasswordError, setConfirmSavePasswordError] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [unlockSheetModalOpen, setUnlockSheetModalOpen] = useState(false);
  const [unlockSheetTarget, setUnlockSheetTarget] =
    useState<SheetSummary | null>(null);
  const [unlockSheetPasswordInput, setUnlockSheetPasswordInput] = useState("");
  const [unlockSheetError, setUnlockSheetError] = useState("");
  const [deleteSheetModalOpen, setDeleteSheetModalOpen] = useState(false);
  const [deleteSheetTarget, setDeleteSheetTarget] =
    useState<SheetSummary | null>(null);
  const [deleteSheetPasswordInput, setDeleteSheetPasswordInput] = useState("");
  const [deleteSheetError, setDeleteSheetError] = useState("");
  const [moveSheetModalOpen, setMoveSheetModalOpen] = useState(false);
  const [moveSheetTarget, setMoveSheetTarget] = useState<SheetSummary | null>(
    null,
  );
  const [moveSheetPasswordInput, setMoveSheetPasswordInput] = useState("");
  const [moveSheetDestinationInput, setMoveSheetDestinationInput] =
    useState("");
  const [moveSheetError, setMoveSheetError] = useState("");
  const [isMovingSheet, setIsMovingSheet] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [deleteGroupTarget, setDeleteGroupTarget] =
    useState<GroupRecord | null>(null);
  const [deleteGroupDestinationInput, setDeleteGroupDestinationInput] =
    useState("");
  const [deleteGroupError, setDeleteGroupError] = useState("");
  const [isDeletingGroup, setIsDeletingGroup] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] =
    useState<PendingConfirmation | null>(null);
  const [savePasswordModalOpen, setSavePasswordModalOpen] = useState(false);
  const [savePasswordInput, setSavePasswordInput] = useState("");
  const [savePasswordConfirmInput, setSavePasswordConfirmInput] = useState("");
  const [savePasswordError, setSavePasswordError] = useState("");
  const [vantagemCategoriaSelecionada, setVantagemCategoriaSelecionada] =
    useState<VantagemCategoria | "">(
      () => restoredDraft?.vantagemCategoriaSelecionada ?? "",
    );
  const [vantagemSelecionadaId, setVantagemSelecionadaId] = useState(
    () => restoredDraft?.vantagemSelecionadaId ?? "",
  );
  const [vantagemGraduacao, setVantagemGraduacao] = useState(
    () => restoredDraft?.vantagemGraduacao ?? "1",
  );
  const [desvantagemCategoriaSelecionada, setDesvantagemCategoriaSelecionada] =
    useState<DesvantagemCategoria | "">(
      () => restoredDraft?.desvantagemCategoriaSelecionada ?? "",
    );
  const [desvantagemSelecionadaId, setDesvantagemSelecionadaId] = useState(
    () => restoredDraft?.desvantagemSelecionadaId ?? "",
  );
  const [desvantagemGraduacao, setDesvantagemGraduacao] = useState(
    () => restoredDraft?.desvantagemGraduacao ?? "1",
  );
  const [poderesPanelAtivo, setPoderesPanelAtivo] = useState<
    "catalogo" | "arsenal"
  >(() => restoredDraft?.poderesPanelAtivo ?? "arsenal");
  const [activeEditorTab, setActiveEditorTab] = useState<EditorTabId>(
    () => restoredDraft?.activeEditorTab ?? "identidade",
  );
  const [naipePoderSelecionado, setNaipePoderSelecionado] =
    useState<NaipePoder>(
      () => restoredDraft?.naipePoderSelecionado ?? "Espadas",
    );
  const [detalhesPoderId, setDetalhesPoderId] = useState<string | null>(null);
  const [pretipoSelecionado, setPretipoSelecionado] = useState(
    () => restoredDraft?.pretipoSelecionado ?? "",
  );
  const [catalogoSearch, setCatalogoSearch] = useState(
    () => restoredDraft?.catalogoSearch ?? "",
  );
  const [catalogoFiltroAcao, setCatalogoFiltroAcao] = useState(
    () => restoredDraft?.catalogoFiltroAcao ?? "",
  );
  const [catalogoFiltroDuracao, setCatalogoFiltroDuracao] = useState(
    () => restoredDraft?.catalogoFiltroDuracao ?? "",
  );
  const [catalogoFiltroTipo, setCatalogoFiltroTipo] = useState(
    () => restoredDraft?.catalogoFiltroTipo ?? "",
  );
  const [equipamentosEra, setEquipamentosEra] = useState<EquipmentEra>(
    () => restoredDraft?.equipamentosEra ?? "Medieval",
  );
  const [equipamentosTipo, setEquipamentosTipo] = useState<EquipmentKind>(
    () => restoredDraft?.equipamentosTipo ?? "Armas",
  );
  const [equipamentosSubcategoria, setEquipamentosSubcategoria] = useState(
    () => restoredDraft?.equipamentosSubcategoria ?? "",
  );
  const [fichaGeradaPagina, setFichaGeradaPagina] = useState<1 | 2>(
    () => restoredDraft?.fichaGeradaPagina ?? 1,
  );
  const [tecnicaDraft, setTecnicaDraft] = useState<DevelopedTechniqueDraft>(
    () => restoredDraft?.tecnicaDraft ?? createDevelopedTechniqueDraft(),
  );

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === selectedId),
    [characters, selectedId],
  );

  const equipamentosAtivos = useMemo(() => {
    if (equipamentosTipo === "Armas") {
      return EQUIPMENT_WEAPONS_BY_ERA[equipamentosEra];
    }

    if (equipamentosTipo === "Protecoes") {
      return EQUIPMENT_PROTECTIONS_BY_ERA[equipamentosEra];
    }

    return EQUIPMENT_UTILITIES_BY_ERA[equipamentosEra];
  }, [equipamentosEra, equipamentosTipo]);

  const equipamentosSubcategorias = useMemo(
    () =>
      Array.from(new Set(equipamentosAtivos.map((item) => item.subcategoria))),
    [equipamentosAtivos],
  );

  const equipamentosFiltrados = useMemo(() => {
    if (!equipamentosSubcategoria) {
      return equipamentosAtivos;
    }

    return equipamentosAtivos.filter(
      (item) => item.subcategoria === equipamentosSubcategoria,
    );
  }, [equipamentosAtivos, equipamentosSubcategoria]);

  const adicionarNotaEquipamento = (linha: string) => {
    updateCharacter((current) => {
      const notasAtuais = current.equipamentos.trim();
      const proximaLinha = notasAtuais ? `${notasAtuais}\n${linha}` : linha;

      return {
        ...current,
        equipamentos: proximaLinha,
      };
    });
  };

  const destaqueArmaNoLimite = (item: EquipmentWeaponEntry): boolean =>
    reachesEquipmentCap(item.dano) ||
    reachesEquipmentCap(item.acerto) ||
    reachesEquipmentCap(item.efeito) ||
    /ignora\s+2\s+resistencia/i.test(item.efeito);

  const destaqueProtecaoNoLimite = (item: EquipmentProtectionEntry): boolean =>
    reachesEquipmentCap(item.resistencia) ||
    reachesEquipmentCap(item.defesa) ||
    reachesEquipmentCap(item.efeito);

  const destaqueUtilitarioNoLimite = (item: EquipmentUtilityEntry): boolean =>
    reachesEquipmentCap(item.efeito);

  const navigateToScreen = (nextScreen: AppScreen) => {
    const nextPath =
      nextScreen === "editor"
        ? CREATE_SHEET_ROUTE
        : nextScreen === "quick-sheet"
          ? QUICK_SHEET_ROUTE
          : HOME_ROUTE;

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }

    setScreen(nextScreen);
  };

  const fetchSheetList = async () => {
    setIsLoadingSheets(true);
    setApiError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/sheets`);
      const payload = (await response.json()) as {
        sheets?: SheetSummary[];
        message?: string;
      };

      if (!response.ok) {
        setApiError(payload.message ?? "Falha ao carregar fichas do banco.");
        return;
      }

      const normalizedSheets = (payload.sheets ?? []).map((sheet) => {
        const imagemUrl = getSheetPreviewImageUrl(sheet);
        const grupo = (sheet.grupo ?? "").trim() || "Grupo 1";

        return {
          ...sheet,
          grupo,
          imagemUrl: sheet.imagemUrl,
          imagemViewUrl: sheet.imagemViewUrl || imagemUrl,
          imageUrl: imagemUrl,
          fotoUrl: imagemUrl,
        };
      });

      setSavedSheets(normalizedSheets);
    } catch {
      setApiError(
        "Nao foi possivel conectar ao backend. Verifique se o server esta rodando.",
      );
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const mapGroupApiSummaryToRecord = (
    group: GroupApiSummary,
  ): GroupRecord | null => {
    const key = normalizeGroupKey(
      String(group.nome ?? group.name ?? "").trim(),
    );

    if (!key) {
      return null;
    }

    const imageUrl =
      (typeof group.imagemViewUrl === "string" && group.imagemViewUrl) ||
      (typeof group.imageUrl === "string" && group.imageUrl) ||
      (typeof group.fotoUrl === "string" && group.fotoUrl) ||
      "";

    return {
      id: String(group.id ?? ""),
      key,
      name: String(group.nome ?? group.name ?? key).trim() || key,
      description: String(group.descricao ?? group.description ?? "").trim(),
      hasPassword: Boolean(group.hasPassword),
      imageUrl,
      sheetCount: Number(group.sheetCount ?? 0),
      attachmentCount: Number(group.attachmentCount ?? 0),
      attachments: [],
    };
  };

  const fetchGroupFiles = async (
    groupId: string,
  ): Promise<GroupAttachment[]> => {
    if (!groupId) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/files`);
    const payload = (await response.json()) as {
      files?: GroupFileApiSummary[];
      message?: string;
    };

    if (!response.ok) {
      throw new Error(
        payload.message ?? "Falha ao carregar arquivos do grupo.",
      );
    }

    return (payload.files ?? []).map((file) => ({
      id: String(file.id ?? crypto.randomUUID()),
      name: String(file.nome ?? "Arquivo"),
      size: Number(file.tamanhoBytes ?? 0),
      mimeType: String(file.mimeType ?? "application/octet-stream"),
      url: String(file.url ?? ""),
      createdAt:
        typeof file.createdAt === "string" ? file.createdAt : undefined,
    }));
  };

  const fetchGroupList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`);
      const payload = (await response.json()) as {
        groups?: GroupApiSummary[];
        message?: string;
      };

      if (!response.ok) {
        setApiError(
          (current) =>
            current ?? payload.message ?? "Falha ao carregar grupos do banco.",
        );
        return;
      }

      const backendGroups = (payload.groups ?? [])
        .map((group) => mapGroupApiSummaryToRecord(group))
        .filter((group): group is GroupRecord => group !== null);

      setGroupRecords((current) => {
        const currentById = new Map(current.map((group) => [group.id, group]));

        return backendGroups.map((group) => {
          const cached = currentById.get(group.id);
          return {
            ...group,
            attachments: cached?.attachments ?? [],
          };
        });
      });
    } catch {
      setApiError(
        (current) =>
          current ??
          "Nao foi possivel conectar ao backend. Verifique se o server esta rodando.",
      );
    }
  };

  useEffect(() => {
    void fetchSheetList();
    void fetchGroupList();
  }, []);

  useEffect(() => {
    if (screen !== "group" || !selectedGroup) {
      return;
    }

    const currentGroup = groupRecords.find(
      (group) => group.key === normalizeGroupKey(selectedGroup),
    );

    if (!currentGroup?.id) {
      return;
    }

    void (async () => {
      try {
        const files = await fetchGroupFiles(currentGroup.id);
        setGroupRecords((current) =>
          current.map((group) =>
            group.id === currentGroup.id
              ? {
                  ...group,
                  attachments: files,
                }
              : group,
          ),
        );
      } catch {
        toast.error("Nao foi possivel carregar os arquivos do grupo.");
      }
    })();
  }, [screen, selectedGroup]);

  useEffect(() => {
    const onPopState = () => {
      setScreen(getScreenFromPathname(window.location.pathname));
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || characters.length === 0) {
      return;
    }

    const currentPrincipalId =
      characters.find((character) => !character.parentId)?.id ??
      getCharacterPrincipalId(characters[0]);

    const existingDraft = readDraftFromLocalStorage();
    const existingCharacters = (existingDraft?.characters ?? []).filter(
      (character): character is CharacterSheet => !!character,
    );
    const mergedCharacters = [
      ...existingCharacters.filter(
        (character) =>
          getCharacterPrincipalId(character) !== currentPrincipalId,
      ),
      ...characters,
    ];

    const payload: LocalDraftPayload = {
      characters: mergedCharacters,
      selectedId,
      activeSheetId,
      activeEditorTab,
      poderesPanelAtivo,
      naipePoderSelecionado,
      catalogoSearch,
      catalogoFiltroAcao,
      catalogoFiltroDuracao,
      catalogoFiltroTipo,
      equipamentosEra,
      equipamentosTipo,
      equipamentosSubcategoria,
      fichaGeradaPagina,
      tecnicaDraft,
      vantagemCategoriaSelecionada,
      vantagemSelecionadaId,
      vantagemGraduacao,
      desvantagemCategoriaSelecionada,
      desvantagemSelecionadaId,
      desvantagemGraduacao,
      pretipoSelecionado,
    };

    try {
      window.localStorage.setItem(
        CHARACTER_DRAFT_STORAGE_KEY,
        JSON.stringify(payload),
      );
    } catch {
      // Ignore quota/private mode failures and keep app flow alive.
    }
  }, [
    characters,
    selectedId,
    activeSheetId,
    activeEditorTab,
    poderesPanelAtivo,
    naipePoderSelecionado,
    catalogoSearch,
    catalogoFiltroAcao,
    catalogoFiltroDuracao,
    catalogoFiltroTipo,
    equipamentosEra,
    equipamentosTipo,
    equipamentosSubcategoria,
    fichaGeradaPagina,
    tecnicaDraft,
    vantagemCategoriaSelecionada,
    vantagemSelecionadaId,
    vantagemGraduacao,
    desvantagemCategoriaSelecionada,
    desvantagemSelecionadaId,
    desvantagemGraduacao,
    pretipoSelecionado,
  ]);

  useEffect(() => {
    if (characters.length === 0) {
      return;
    }

    const exists = characters.some((character) => character.id === selectedId);
    if (!exists) {
      setSelectedId(characters[0].id);
    }
  }, [characters, selectedId]);

  useEffect(() => {
    setCharacters((current) =>
      current.map((character) =>
        character.id !== selectedId ||
        !isLegacyConhecimentoLayout(character.conhecimentos)
          ? character
          : {
              ...character,
              conhecimentos: [createEmptyConhecimento()],
            },
      ),
    );
  }, [selectedId]);

  useEffect(() => {
    if (screen !== "quick-sheet") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigateToScreen("editor");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [screen]);

  // Sincronizar automaticamente as graduações dos poderes base com o arsenal do personagem
  useEffect(() => {
    if (!selectedCharacter || tecnicaDraft.poderesBase.length === 0) {
      return;
    }

    const nivel = parseNatural(selectedCharacter.nivel);
    const limitePoder = nivel + 10;
    const poderesArsenal = new Map(
      selectedCharacter.poderes.map((p) => [
        p.powerId,
        clamp(parseNatural(p.graduacao), 1, limitePoder),
      ]),
    );

    const hasChanges = tecnicaDraft.poderesBase.some((base) => {
      const graduacaoArsenal = poderesArsenal.get(base.powerId);
      if (!graduacaoArsenal) return false;
      return String(graduacaoArsenal) !== base.graduacao;
    });

    if (hasChanges) {
      setTecnicaDraft((current) => ({
        ...current,
        poderesBase: current.poderesBase.map((base) => {
          const graduacaoArsenal = poderesArsenal.get(base.powerId);
          return {
            ...base,
            graduacao: graduacaoArsenal
              ? String(graduacaoArsenal)
              : base.graduacao,
          };
        }),
      }));
    }
  }, [selectedCharacter?.poderes]);

  // Helpers para gerenciar grupos
  const getGroupByKey = (groupKey: string): GroupRecord | null => {
    return (
      groupRecords.find((group) => group.key === normalizeGroupKey(groupKey)) ??
      null
    );
  };

  const getAllGroups = (): GroupRecord[] => {
    return [...groupRecords].sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR"),
    );
  };

  const getSheetsInGroup = (groupKey: string): SheetSummary[] => {
    const targetKey = normalizeGroupKey(groupKey);
    return savedSheets.filter(
      (sheet) =>
        normalizeGroupKey((sheet.grupo ?? "").trim() || "Grupo 1") ===
        targetKey,
    );
  };

  const navigateToGroup = (groupKey: string) => {
    setSelectedGroup(normalizeGroupKey(groupKey));
    setScreen("group");
  };

  const navigateToHome = () => {
    setSelectedGroup(null);
    setScreen("home");
  };

  const openGroupSelectModal = () => {
    setGroupSelectInput("");
    setGroupSelectError("");
    setGroupSelectModalOpen(true);
  };

  const closeGroupSelectModal = () => {
    setGroupSelectModalOpen(false);
    setGroupSelectInput("");
    setGroupSelectError("");
  };

  const closeGroupEditorModal = () => {
    setGroupEditorModalOpen(false);
    setGroupEditorKey(null);
    setGroupEditorName("");
    setGroupEditorDescription("");
    setGroupEditorPassword("");
    setGroupEditorHasPassword(false);
    setGroupEditorRemovePassword(false);
    setGroupEditorImageUrl("");
    setGroupEditorImageFile(null);
    setGroupEditorInitialImageUrl("");
    setGroupEditorAttachments([]);
    setGroupEditorInitialAttachmentIds([]);
    setGroupEditorError("");
  };

  const openCreateGroupModal = () => {
    setGroupEditorKey(null);
    setGroupEditorName("");
    setGroupEditorDescription("");
    setGroupEditorPassword("");
    setGroupEditorHasPassword(false);
    setGroupEditorRemovePassword(false);
    setGroupEditorImageUrl("");
    setGroupEditorImageFile(null);
    setGroupEditorInitialImageUrl("");
    setGroupEditorAttachments([]);
    setGroupEditorInitialAttachmentIds([]);
    setGroupEditorError("");
    setGroupEditorModalOpen(true);
  };

  const openEditGroupModal = async (groupKey: string) => {
    const group = getGroupByKey(groupKey);
    if (!group || !group.id) {
      toast.error("Grupo nao encontrado.");
      return;
    }

    try {
      const files = await fetchGroupFiles(group.id);

      setGroupRecords((current) =>
        current.map((item) =>
          item.id === group.id
            ? {
                ...item,
                attachments: files,
              }
            : item,
        ),
      );

      setGroupEditorKey(group.key);
      setGroupEditorName(group.name);
      setGroupEditorDescription(group.description || "");
      setGroupEditorPassword("");
      setGroupEditorHasPassword(Boolean(group.hasPassword));
      setGroupEditorRemovePassword(false);
      setGroupEditorImageUrl(group.imageUrl);
      setGroupEditorImageFile(null);
      setGroupEditorInitialImageUrl(group.imageUrl);
      setGroupEditorAttachments(files);
      setGroupEditorInitialAttachmentIds(
        files.map((attachment) => attachment.id),
      );
      setGroupEditorError("");
      setGroupEditorModalOpen(true);
    } catch {
      toast.error("Nao foi possivel carregar os arquivos do grupo.");
    }
  };

  const addAttachmentsToEditor = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const attachments = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      url: URL.createObjectURL(file),
      file,
    }));

    setGroupEditorAttachments((current) => [...current, ...attachments]);
  };

  const onGroupEditorImageFileSelected = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem valido.");
      return;
    }

    setGroupEditorImageFile(file);
    setGroupEditorImageUrl(URL.createObjectURL(file));
  };

  const removeEditorAttachment = (attachmentId: string) => {
    setGroupEditorAttachments((current) =>
      current.filter((attachment) => attachment.id !== attachmentId),
    );
  };

  const setGroupAttachmentsById = (
    groupId: string,
    attachments: GroupAttachment[],
  ) => {
    setGroupRecords((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              attachments,
            }
          : group,
      ),
    );
  };

  const saveGroupEditor = async () => {
    const nextName = groupEditorName.trim();
    const nextDescription = groupEditorDescription.trim();
    const nextPassword = groupEditorPassword.trim();

    if (!nextName) {
      setGroupEditorError("Nome do grupo e obrigatorio.");
      return;
    }

    setIsSavingGroup(true);
    setGroupEditorError("");

    try {
      const editingGroup = groupEditorKey
        ? getGroupByKey(groupEditorKey)
        : null;
      let targetGroupId = editingGroup?.id ?? "";
      let targetGroupKey = normalizeGroupKey(nextName);

      if (editingGroup) {
        const shouldRemovePassword =
          groupEditorHasPassword && groupEditorRemovePassword && !nextPassword;
        const renameResponse = await fetch(
          `${API_BASE_URL}/groups/${editingGroup.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome: nextName,
              descricao: nextDescription,
              ...(nextPassword ? { senha: nextPassword } : {}),
              ...(shouldRemovePassword ? { removerSenha: true } : {}),
            }),
          },
        );

        const renamePayload = (await renameResponse.json()) as {
          group?: GroupApiSummary;
          message?: string;
        };

        if (!renameResponse.ok) {
          setGroupEditorError(
            renamePayload.message ?? "Falha ao atualizar grupo.",
          );
          return;
        }

        const updatedGroup = renamePayload.group
          ? mapGroupApiSummaryToRecord(renamePayload.group)
          : null;
        if (updatedGroup?.id) {
          targetGroupId = updatedGroup.id;
          targetGroupKey = updatedGroup.key;
        }
      } else {
        const createResponse = await fetch(`${API_BASE_URL}/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nextName,
            descricao: nextDescription,
            ...(nextPassword ? { senha: nextPassword } : {}),
          }),
        });

        const createPayload = (await createResponse.json()) as {
          group?: GroupApiSummary;
          message?: string;
        };

        if (!createResponse.ok) {
          setGroupEditorError(createPayload.message ?? "Falha ao criar grupo.");
          return;
        }

        const createdGroup = createPayload.group
          ? mapGroupApiSummaryToRecord(createPayload.group)
          : null;

        if (!createdGroup?.id) {
          setGroupEditorError("Falha ao identificar o grupo criado.");
          return;
        }

        targetGroupId = createdGroup.id;
        targetGroupKey = createdGroup.key;
      }

      if (!targetGroupId) {
        setGroupEditorError("Grupo invalido para sincronizacao.");
        return;
      }

      if (groupEditorImageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", groupEditorImageFile);

        const imageResponse = await fetch(
          `${API_BASE_URL}/groups/${targetGroupId}/image`,
          {
            method: "POST",
            body: imageFormData,
          },
        );

        const imagePayload = (await imageResponse.json()) as {
          message?: string;
        };
        if (!imageResponse.ok) {
          setGroupEditorError(
            imagePayload.message ?? "Falha ao salvar imagem do grupo.",
          );
          return;
        }
      } else if (!groupEditorImageUrl && groupEditorInitialImageUrl) {
        const deleteImageResponse = await fetch(
          `${API_BASE_URL}/groups/${targetGroupId}/image`,
          {
            method: "DELETE",
          },
        );

        const deleteImagePayload = (await deleteImageResponse.json()) as {
          message?: string;
        };

        if (!deleteImageResponse.ok) {
          setGroupEditorError(
            deleteImagePayload.message ?? "Falha ao remover imagem do grupo.",
          );
          return;
        }
      }

      const currentAttachmentIds = new Set(
        groupEditorAttachments
          .filter((attachment) => !attachment.file)
          .map((attachment) => attachment.id),
      );

      const removedAttachmentIds = groupEditorInitialAttachmentIds.filter(
        (attachmentId) => !currentAttachmentIds.has(attachmentId),
      );

      for (const attachmentId of removedAttachmentIds) {
        const removeResponse = await fetch(
          `${API_BASE_URL}/groups/${targetGroupId}/files/${attachmentId}`,
          {
            method: "DELETE",
          },
        );

        const removePayload = (await removeResponse.json()) as {
          message?: string;
        };
        if (!removeResponse.ok) {
          setGroupEditorError(
            removePayload.message ?? "Falha ao remover arquivo do grupo.",
          );
          return;
        }
      }

      const newAttachments = groupEditorAttachments.filter(
        (attachment) => attachment.file,
      );

      for (const attachment of newAttachments) {
        const file = attachment.file;
        if (!file) {
          continue;
        }

        const fileFormData = new FormData();
        fileFormData.append("file", file);

        const uploadResponse = await fetch(
          `${API_BASE_URL}/groups/${targetGroupId}/files`,
          {
            method: "POST",
            body: fileFormData,
          },
        );

        const uploadPayload = (await uploadResponse.json()) as {
          message?: string;
        };
        if (!uploadResponse.ok) {
          setGroupEditorError(
            uploadPayload.message ?? "Falha ao enviar arquivo para o grupo.",
          );
          return;
        }
      }

      await fetchGroupList();
      await fetchSheetList();

      const syncedFiles = await fetchGroupFiles(targetGroupId);
      setGroupAttachmentsById(targetGroupId, syncedFiles);
      setGroupEditorPassword("");
      setGroupEditorRemovePassword(false);

      closeGroupEditorModal();
      if (
        selectedGroup &&
        groupEditorKey &&
        groupEditorKey !== targetGroupKey
      ) {
        setSelectedGroup(targetGroupKey);
      }
      navigateToGroup(targetGroupKey);
      toast.success(
        editingGroup
          ? "Grupo atualizado com sucesso."
          : "Grupo criado com sucesso.",
      );
    } catch {
      setGroupEditorError(
        "Nao foi possivel conectar ao backend para sincronizar o grupo.",
      );
    } finally {
      setIsSavingGroup(false);
    }
  };

  const addAttachmentsToGroup = async (
    groupKey: string,
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) {
      return;
    }

    const group = getGroupByKey(groupKey);
    if (!group?.id) {
      toast.error("Grupo nao encontrado.");
      return;
    }

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${API_BASE_URL}/groups/${group.id}/files`,
          {
            method: "POST",
            body: formData,
          },
        );

        const payload = (await response.json()) as { message?: string };
        if (!response.ok) {
          toast.error(payload.message ?? "Falha ao anexar arquivo ao grupo.");
          return;
        }
      }

      const syncedFiles = await fetchGroupFiles(group.id);
      setGroupAttachmentsById(group.id, syncedFiles);
      toast.success("Arquivos anexados ao grupo.");
    } catch {
      toast.error("Erro de conexao ao anexar arquivos ao grupo.");
    }
  };

  const removeGroupAttachment = async (
    groupKey: string,
    attachmentId: string,
  ) => {
    const group = getGroupByKey(groupKey);
    if (!group?.id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/groups/${group.id}/files/${attachmentId}`,
        {
          method: "DELETE",
        },
      );

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        toast.error(payload.message ?? "Falha ao remover arquivo do grupo.");
        return;
      }

      const syncedFiles = await fetchGroupFiles(group.id);
      setGroupAttachmentsById(group.id, syncedFiles);
      toast.success("Arquivo removido do grupo.");
    } catch {
      toast.error("Erro de conexao ao remover arquivo do grupo.");
    }
  };

  const handleGroupSelectSubmit = async (groupName: string) => {
    const normalizedName = groupName.trim();
    if (!normalizedName) {
      setGroupSelectError("Nome do grupo nao pode ser vazio.");
      return;
    }

    const existing = getAllGroups().find(
      (group) =>
        group.name.toLowerCase() === normalizedName.toLowerCase() ||
        group.key.toLowerCase() === normalizedName.toLowerCase(),
    );

    let targetKey = existing?.key;

    if (!targetKey) {
      try {
        const response = await fetch(`${API_BASE_URL}/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nome: normalizedName }),
        });

        const payload = (await response.json()) as {
          group?: GroupApiSummary;
          message?: string;
        };

        if (!response.ok) {
          setGroupSelectError(payload.message ?? "Falha ao criar grupo.");
          return;
        }

        const createdGroup = payload.group
          ? mapGroupApiSummaryToRecord(payload.group)
          : null;
        targetKey = createdGroup?.key ?? normalizeGroupKey(normalizedName);
        await fetchGroupList();
      } catch {
        setGroupSelectError("Nao foi possivel conectar ao backend.");
        return;
      }
    }

    createNewSheet(targetKey);
    closeGroupSelectModal();
    toast.success(`Ficha criada no grupo: ${targetKey}`);
  };

  const createNewSheet = (groupKey?: string) => {
    const next = {
      ...createEmptyCharacter(),
      grupo: groupKey ?? "",
    };
    setCharacters([next]);
    setSelectedId(next.id);
    setActiveSheetId(null);
    setActiveSheetPassword("");
    setUnlockSheetModalOpen(false);
    setUnlockSheetTarget(null);
    setUnlockSheetPasswordInput("");
    setUnlockSheetError("");
    setDeleteSheetModalOpen(false);
    setDeleteSheetTarget(null);
    setDeleteSheetPasswordInput("");
    setDeleteSheetError("");
    setMoveSheetModalOpen(false);
    setMoveSheetTarget(null);
    setMoveSheetPasswordInput("");
    setMoveSheetDestinationInput("");
    setMoveSheetError("");
    setPendingConfirmation(null);
    setSavePasswordModalOpen(false);
    setSavePasswordInput("");
    setSavePasswordConfirmInput("");
    setSavePasswordError("");
    setConfirmSavePasswordModalOpen(false);
    setConfirmSavePasswordInput("");
    setConfirmSavePasswordError("");
    setApiError(null);
    navigateToScreen("editor");
  };

  const resetUnlockSheetForm = () => {
    setUnlockSheetPasswordInput("");
    setUnlockSheetError("");
  };

  const resetDeleteSheetForm = () => {
    setDeleteSheetPasswordInput("");
    setDeleteSheetError("");
  };

  const resetMoveSheetForm = () => {
    setMoveSheetPasswordInput("");
    setMoveSheetDestinationInput("");
    setMoveSheetError("");
  };

  const closeUnlockSheetModal = () => {
    if (isUnlockingSheet) {
      return;
    }

    setUnlockSheetModalOpen(false);
    setUnlockSheetTarget(null);
    resetUnlockSheetForm();
  };

  const openSheetForEditing = (summary: SheetSummary) => {
    setUnlockSheetTarget(summary);
    setUnlockSheetModalOpen(true);
    resetUnlockSheetForm();
  };

  const closeDeleteSheetModal = () => {
    if (isDeletingSheet) {
      return;
    }

    setDeleteSheetModalOpen(false);
    setDeleteSheetTarget(null);
    resetDeleteSheetForm();
  };

  const openDeleteSheetModal = (summary: SheetSummary) => {
    setDeleteSheetTarget(summary);
    setDeleteSheetModalOpen(true);
    resetDeleteSheetForm();
  };

  const closeMoveSheetModal = () => {
    if (isMovingSheet) {
      return;
    }

    setMoveSheetModalOpen(false);
    setMoveSheetTarget(null);
    resetMoveSheetForm();
  };

  const openMoveSheetModal = (summary: SheetSummary) => {
    setMoveSheetTarget(summary);
    setMoveSheetModalOpen(true);
    resetMoveSheetForm();
  };

  const unlockSheetForEditing = async () => {
    if (!unlockSheetTarget) {
      return;
    }

    const password = unlockSheetPasswordInput.trim();
    if (!password) {
      setUnlockSheetError("Digite a senha da ficha.");
      return;
    }

    setApiError(null);
    setIsUnlockingSheet(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/sheets/${unlockSheetTarget.id}/unlock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        },
      );

      const payload = (await response.json()) as {
        character?: CharacterSheet;
        message?: string;
      };

      if (!response.ok || !payload.character) {
        const message = payload.message ?? "Nao foi possivel abrir a ficha.";
        setUnlockSheetError(message);
        toast.error(message);
        return;
      }

      const normalizedCharacter = normalizeCharacterSheet(payload.character);
      const principalId = unlockSheetTarget.id;

      const existingDraft = readDraftFromLocalStorage();
      const scopedCharacters = (existingDraft?.characters ?? [])
        .filter((character): character is CharacterSheet => !!character)
        .map((character) => normalizeCharacterSheet(character))
        .filter(
          (character) => getCharacterPrincipalId(character) === principalId,
        );

      setCharacters([
        normalizedCharacter,
        ...scopedCharacters.filter((character) => character.id !== principalId),
      ]);
      setSelectedId(principalId);
      setActiveSheetId(principalId);
      setActiveSheetPassword(password);
      setUnlockSheetModalOpen(false);
      setUnlockSheetTarget(null);
      resetUnlockSheetForm();
      navigateToScreen("editor");
    } catch {
      toast.error("Erro de conexao ao abrir a ficha.");
    } finally {
      setIsUnlockingSheet(false);
    }
  };

  const goBackToHome = async () => {
    navigateToScreen("home");
    setApiError(null);
    await fetchSheetList();
  };

  const deleteSheetFromDatabase = async () => {
    if (!deleteSheetTarget) {
      return;
    }

    const password = deleteSheetPasswordInput.trim();
    if (!password) {
      setDeleteSheetError("Digite a senha da ficha para excluir.");
      return;
    }

    setApiError(null);
    setIsDeletingSheet(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/sheets/${deleteSheetTarget.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        },
      );

      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok) {
        const message = payload.message ?? "Nao foi possivel excluir a ficha.";
        setDeleteSheetError(message);
        toast.error(message);
        return;
      }

      removeDraftGroupFromLocalStorage(deleteSheetTarget.id);

      if (activeSheetId === deleteSheetTarget.id) {
        const next = createEmptyCharacter();
        setCharacters([next]);
        setSelectedId(next.id);
        setActiveSheetId(null);
        setActiveSheetPassword("");
      }

      setSavedSheets((current) =>
        current.filter((sheet) => sheet.id !== deleteSheetTarget.id),
      );
      setDeleteSheetModalOpen(false);
      setDeleteSheetTarget(null);
      resetDeleteSheetForm();
      toast.success("Ficha excluida com sucesso.");
      await fetchSheetList();
    } catch {
      toast.error("Erro de conexao ao excluir a ficha.");
    } finally {
      setIsDeletingSheet(false);
    }
  };

  const moveSheetToGroup = async () => {
    if (!moveSheetTarget) {
      return;
    }

    const password = moveSheetPasswordInput.trim();
    if (!password) {
      setMoveSheetError("Digite a senha da ficha para mover.");
      return;
    }

    const destinationGroup = moveSheetDestinationInput.trim();
    if (!destinationGroup) {
      setMoveSheetError("Informe o grupo de destino.");
      return;
    }

    const currentGroupName = (moveSheetTarget.grupo ?? "").trim() || "Grupo 1";
    if (
      normalizeGroupKey(destinationGroup) ===
      normalizeGroupKey(currentGroupName)
    ) {
      setMoveSheetError("A ficha ja esta neste grupo.");
      return;
    }

    setApiError(null);
    setIsMovingSheet(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/sheets/${moveSheetTarget.id}/group`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            grupo: destinationGroup,
          }),
        },
      );

      const payload = (await response.json()) as {
        message?: string;
        moved?: boolean;
      };

      if (!response.ok) {
        const message =
          payload.message ?? "Nao foi possivel mover a ficha de grupo.";
        setMoveSheetError(message);
        toast.error(message);
        return;
      }

      await fetchSheetList();
      await fetchGroupList();
      setMoveSheetModalOpen(false);
      setMoveSheetTarget(null);
      resetMoveSheetForm();
      toast.success("Ficha movida de grupo com sucesso.");
    } catch {
      toast.error("Erro de conexao ao mover a ficha.");
    } finally {
      setIsMovingSheet(false);
    }
  };

  const openDeleteGroupModal = (groupKey: string) => {
    const group = groupRecords.find((g) => g.key === groupKey);
    if (!group) {
      return;
    }
    setDeleteGroupTarget(group);
    setDeleteGroupDestinationInput("");
    setDeleteGroupError("");
    setDeleteGroupModalOpen(true);
  };

  const closeDeleteGroupModal = () => {
    if (isDeletingGroup) {
      return;
    }
    setDeleteGroupModalOpen(false);
    setDeleteGroupTarget(null);
    setDeleteGroupDestinationInput("");
    setDeleteGroupError("");
  };

  const deleteGroup = async () => {
    if (!deleteGroupTarget) {
      return;
    }

    setApiError(null);
    setIsDeletingGroup(true);

    try {
      const body: Record<string, string> = {};
      if (deleteGroupDestinationInput.trim()) {
        body.moveToGroupName = deleteGroupDestinationInput.trim();
      }

      const response = await fetch(
        `${API_BASE_URL}/groups/${deleteGroupTarget.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const payload = (await response.json()) as {
        message?: string;
        sheetCount?: number;
      };

      if (response.status === 409) {
        setDeleteGroupError(
          `Este grupo possui ${payload.sheetCount ?? "algumas"} ficha(s). Informe o grupo de destino para as fichas.`,
        );
        return;
      }

      if (!response.ok) {
        const message = payload.message ?? "Não foi possível excluir o grupo.";
        setDeleteGroupError(message);
        toast.error(message);
        return;
      }

      await fetchGroupList();
      await fetchSheetList();
      setDeleteGroupModalOpen(false);
      setDeleteGroupTarget(null);
      setSelectedGroup("");
      toast.success("Grupo excluído com sucesso.");
    } catch {
      toast.error("Erro de conexão ao excluir o grupo.");
    } finally {
      setIsDeletingGroup(false);
    }
  };

  const resetSavePasswordForm = () => {
    setSavePasswordInput("");
    setSavePasswordConfirmInput("");
    setSavePasswordError("");
  };

  const closeSavePasswordModal = () => {
    if (isSavingSheet) {
      return;
    }

    setSavePasswordModalOpen(false);
    resetSavePasswordForm();
  };

  const resetConfirmSavePasswordForm = () => {
    setConfirmSavePasswordInput("");
    setConfirmSavePasswordError("");
  };

  const closeConfirmSavePasswordModal = () => {
    if (isSavingSheet) {
      return;
    }

    setConfirmSavePasswordModalOpen(false);
    resetConfirmSavePasswordForm();
  };

  const handleConfirmSavePasswordSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!confirmSavePasswordInput.trim()) {
      setConfirmSavePasswordError("Digite a senha atual da ficha.");
      return;
    }

    setConfirmSavePasswordError("");
    void persistSelectedCharacter(confirmSavePasswordInput);
  };

  const closeConfirmationModal = () => {
    setPendingConfirmation(null);
  };

  const resetPrincipalConfirmed = (characterId: string) => {
    const targetCharacter = characters.find(
      (character) => character.id === characterId,
    );

    if (!targetCharacter || targetCharacter.parentId) {
      return;
    }

    const blankPrincipal = createEmptyCharacter();

    setCharacters((current) =>
      current.map((character) =>
        character.id === characterId
          ? {
              ...blankPrincipal,
              id: character.id,
              parentId: undefined,
              localSaved: character.localSaved,
            }
          : character,
      ),
    );

    toast.success("Perfil principal resetado.");
  };

  const openResetPrincipalConfirmation = (characterId: string) => {
    setPendingConfirmation({
      title: "Resetar perfil principal",
      message:
        "Isso vai limpar todos os campos da ficha principal. Prototipos locais nao serao alterados.",
      confirmLabel: "Resetar principal",
      variant: "danger",
      action: { type: "reset-principal", characterId },
    });
  };

  const renderGlobalOverlays = () => (
    <>
      {savePasswordModalOpen ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeSavePasswordModal}
        >
          <div
            className="save-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-sheet-password-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="save-sheet-password-title">Cadastrar nova ficha</h3>
            <p>
              Crie uma senha para sua conta. Esta sera usada para acessar todas
              as suas fichas salvas no banco.
            </p>
            <form
              className="save-password-form"
              onSubmit={handleSavePasswordSubmit}
            >
              <label>
                Senha
                <input
                  type="password"
                  value={savePasswordInput}
                  minLength={SHEET_PASSWORD_MIN_LENGTH}
                  onChange={(event) => {
                    setSavePasswordInput(event.target.value);
                    if (savePasswordError) {
                      setSavePasswordError("");
                    }
                  }}
                  disabled={isSavingSheet}
                  autoComplete="new-password"
                  required
                />
              </label>

              <label>
                Confirmar senha
                <input
                  type="password"
                  value={savePasswordConfirmInput}
                  minLength={SHEET_PASSWORD_MIN_LENGTH}
                  onChange={(event) => {
                    setSavePasswordConfirmInput(event.target.value);
                    if (savePasswordError) {
                      setSavePasswordError("");
                    }
                  }}
                  disabled={isSavingSheet}
                  autoComplete="new-password"
                  required
                />
              </label>

              {savePasswordError ? (
                <p className="save-password-error">{savePasswordError}</p>
              ) : null}

              <div className="save-password-actions">
                <button
                  type="button"
                  onClick={closeSavePasswordModal}
                  disabled={isSavingSheet}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isSavingSheet}>
                  {isSavingSheet ? "Cadastrando..." : "Cadastrar ficha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {confirmSavePasswordModalOpen ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeConfirmSavePasswordModal}
        >
          <div
            className="save-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-save-password-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="confirm-save-password-title">Salvar alteracoes</h3>
            <p>
              Confirme a senha da sua conta para salvar as edicoes desta ficha
              no banco.
            </p>
            <form
              className="save-password-form"
              onSubmit={handleConfirmSavePasswordSubmit}
            >
              <label>
                Senha atual
                <input
                  type="password"
                  value={confirmSavePasswordInput}
                  onChange={(event) => {
                    setConfirmSavePasswordInput(event.target.value);
                    if (confirmSavePasswordError) {
                      setConfirmSavePasswordError("");
                    }
                  }}
                  disabled={isSavingSheet}
                  autoComplete="current-password"
                  autoFocus
                  required
                />
              </label>

              {confirmSavePasswordError ? (
                <p className="save-password-error">
                  {confirmSavePasswordError}
                </p>
              ) : null}

              <div className="save-password-actions">
                <button
                  type="button"
                  onClick={closeConfirmSavePasswordModal}
                  disabled={isSavingSheet}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isSavingSheet}>
                  {isSavingSheet ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {unlockSheetModalOpen && unlockSheetTarget ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeUnlockSheetModal}
        >
          <div
            className="save-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unlock-sheet-password-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="unlock-sheet-password-title">Abrir ficha</h3>
            <p>
              Digite a senha para editar a ficha de{" "}
              <strong>{unlockSheetTarget.nome || "Sem nome"}</strong>.
            </p>
            <form
              className="save-password-form"
              onSubmit={(event) => {
                event.preventDefault();
                void unlockSheetForEditing();
              }}
            >
              <label>
                Senha
                <input
                  type="password"
                  value={unlockSheetPasswordInput}
                  onChange={(event) => {
                    setUnlockSheetPasswordInput(event.target.value);
                    if (unlockSheetError) {
                      setUnlockSheetError("");
                    }
                  }}
                  disabled={isUnlockingSheet}
                  autoComplete="current-password"
                  autoFocus
                  required
                />
              </label>

              {unlockSheetError ? (
                <p className="save-password-error">{unlockSheetError}</p>
              ) : null}

              <div className="save-password-actions">
                <button
                  type="button"
                  onClick={closeUnlockSheetModal}
                  disabled={isUnlockingSheet}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isUnlockingSheet}>
                  {isUnlockingSheet ? "Abrindo..." : "Abrir ficha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteSheetModalOpen && deleteSheetTarget ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeDeleteSheetModal}
        >
          <div
            className="save-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-sheet-password-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-sheet-password-title">Excluir ficha</h3>
            <p>
              Esta acao remove a ficha de forma permanente. Digite a senha da
              ficha de <strong>{deleteSheetTarget.nome || "Sem nome"}</strong>{" "}
              para confirmar.
            </p>
            <form
              className="save-password-form"
              onSubmit={(event) => {
                event.preventDefault();
                void deleteSheetFromDatabase();
              }}
            >
              <label>
                Senha
                <input
                  type="password"
                  value={deleteSheetPasswordInput}
                  onChange={(event) => {
                    setDeleteSheetPasswordInput(event.target.value);
                    if (deleteSheetError) {
                      setDeleteSheetError("");
                    }
                  }}
                  disabled={isDeletingSheet}
                  autoComplete="current-password"
                  autoFocus
                  required
                />
              </label>

              {deleteSheetError ? (
                <p className="save-password-error">{deleteSheetError}</p>
              ) : null}

              <div className="save-password-actions">
                <button
                  type="button"
                  onClick={closeDeleteSheetModal}
                  disabled={isDeletingSheet}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="danger"
                  disabled={isDeletingSheet}
                >
                  {isDeletingSheet ? "Excluindo..." : "Excluir ficha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {moveSheetModalOpen && moveSheetTarget ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeMoveSheetModal}
        >
          <div
            className="save-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="move-sheet-group-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="move-sheet-group-title">Mover ficha</h3>
            <p>
              Escolha o grupo de destino para a ficha de{" "}
              <strong>{moveSheetTarget.nome || "Sem nome"}</strong> e confirme
              com a senha.
            </p>
            <form
              className="save-password-form"
              onSubmit={(event) => {
                event.preventDefault();
                void moveSheetToGroup();
              }}
            >
              <fieldset>
                <legend>Grupos disponíveis:</legend>
                <div className="group-select-list">
                  {getAllGroups()
                    .filter(
                      (group) =>
                        normalizeGroupKey(group.key) !==
                        normalizeGroupKey(
                          (moveSheetTarget.grupo ?? "").trim() || "Grupo 1",
                        ),
                    )
                    .map((group) => (
                      <button
                        key={group.key}
                        type="button"
                        className="group-select-button"
                        onClick={() => {
                          setMoveSheetDestinationInput(group.name);
                          if (moveSheetError) {
                            setMoveSheetError("");
                          }
                        }}
                      >
                        {group.name}
                      </button>
                    ))}
                </div>
              </fieldset>

              <label>
                Grupo de destino
                <input
                  type="text"
                  placeholder="Nome do grupo..."
                  value={moveSheetDestinationInput}
                  onChange={(event) => {
                    setMoveSheetDestinationInput(event.target.value);
                    if (moveSheetError) {
                      setMoveSheetError("");
                    }
                  }}
                  autoFocus
                  required
                />
              </label>

              <label>
                Senha
                <input
                  type="password"
                  value={moveSheetPasswordInput}
                  onChange={(event) => {
                    setMoveSheetPasswordInput(event.target.value);
                    if (moveSheetError) {
                      setMoveSheetError("");
                    }
                  }}
                  disabled={isMovingSheet}
                  autoComplete="current-password"
                  required
                />
              </label>

              {moveSheetError ? (
                <p className="save-password-error">{moveSheetError}</p>
              ) : null}

              <div className="save-password-actions">
                <button
                  type="button"
                  onClick={closeMoveSheetModal}
                  disabled={isMovingSheet}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isMovingSheet}>
                  {isMovingSheet ? "Movendo..." : "Mover ficha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteGroupModalOpen && deleteGroupTarget ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeDeleteGroupModal}
        >
          <div
            className="save-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-group-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-group-title">Excluir grupo</h3>
            <p>
              Você está prestes a excluir o grupo{" "}
              <strong>{deleteGroupTarget.name}</strong>.
              {deleteGroupTarget.sheetCount > 0 ? (
                <>
                  {" "}
                  Este grupo possui{" "}
                  <strong>{deleteGroupTarget.sheetCount}</strong> ficha(s).
                  Informe o grupo de destino para mover as fichas antes de
                  excluir.
                </>
              ) : (
                " O grupo está vazio e será excluído permanentemente."
              )}
            </p>
            <form
              className="save-password-form"
              onSubmit={(event) => {
                event.preventDefault();
                void deleteGroup();
              }}
            >
              {deleteGroupTarget.sheetCount > 0 ? (
                <>
                  <fieldset>
                    <legend>Grupos disponíveis:</legend>
                    <div className="group-select-list">
                      {getAllGroups()
                        .filter(
                          (g) =>
                            normalizeGroupKey(g.key) !==
                            normalizeGroupKey(deleteGroupTarget.key),
                        )
                        .map((g) => (
                          <button
                            key={g.key}
                            type="button"
                            className="group-select-button"
                            onClick={() => {
                              setDeleteGroupDestinationInput(g.name);
                              if (deleteGroupError) {
                                setDeleteGroupError("");
                              }
                            }}
                          >
                            {g.name}
                          </button>
                        ))}
                    </div>
                  </fieldset>
                  <label>
                    Grupo de destino
                    <input
                      type="text"
                      placeholder="Nome do grupo de destino..."
                      value={deleteGroupDestinationInput}
                      onChange={(event) => {
                        setDeleteGroupDestinationInput(event.target.value);
                        if (deleteGroupError) {
                          setDeleteGroupError("");
                        }
                      }}
                      disabled={isDeletingGroup}
                      required
                    />
                  </label>
                </>
              ) : null}

              {deleteGroupError ? (
                <p className="save-password-error">{deleteGroupError}</p>
              ) : null}

              <div className="save-password-actions">
                <button
                  type="button"
                  onClick={closeDeleteGroupModal}
                  disabled={isDeletingGroup}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="danger-button"
                  disabled={isDeletingGroup}
                >
                  {isDeletingGroup ? "Excluindo..." : "Excluir grupo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {pendingConfirmation ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeConfirmationModal}
        >
          <div
            className="save-password-modal confirm-action-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-action-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="confirm-action-title">{pendingConfirmation.title}</h3>
            <p className="confirm-action-message">
              {pendingConfirmation.message}
            </p>
            <div className="save-password-actions">
              <button type="button" onClick={closeConfirmationModal}>
                Cancelar
              </button>
              <button
                type="button"
                className={
                  pendingConfirmation.variant === "danger" ? "danger" : ""
                }
                onClick={() => {
                  if (pendingConfirmation.action.type === "apply-pretipo") {
                    applyPretipoConfirmed(pendingConfirmation.action.pretipoId);
                  }

                  if (pendingConfirmation.action.type === "delete-character") {
                    deleteCharacterConfirmed(
                      pendingConfirmation.action.characterId,
                    );
                  }

                  if (pendingConfirmation.action.type === "reset-principal") {
                    resetPrincipalConfirmed(
                      pendingConfirmation.action.characterId,
                    );
                  }

                  closeConfirmationModal();
                }}
              >
                {pendingConfirmation.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {groupSelectModalOpen ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeGroupSelectModal}
        >
          <div
            className="save-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="group-select-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="group-select-title">Escolher grupo</h3>
            <p>Selecione um grupo existente ou crie um novo.</p>
            <form
              className="save-password-form"
              onSubmit={(event) => {
                event.preventDefault();
                void handleGroupSelectSubmit(groupSelectInput);
              }}
            >
              {getAllGroups().length > 0 ? (
                <fieldset>
                  <legend>Grupos disponíveis:</legend>
                  <div className="group-select-list">
                    {getAllGroups().map((group) => (
                      <button
                        key={group.key}
                        type="button"
                        className="group-select-button"
                        onClick={() => {
                          void handleGroupSelectSubmit(group.key);
                        }}
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              <div className="group-select-divider">ou</div>

              <label>
                Criar novo grupo
                <input
                  type="text"
                  placeholder="Nome do grupo..."
                  value={groupSelectInput}
                  onChange={(event) => {
                    setGroupSelectInput(event.target.value);
                    if (groupSelectError) {
                      setGroupSelectError("");
                    }
                  }}
                  autoFocus
                />
              </label>

              {groupSelectError ? (
                <p className="save-password-error">{groupSelectError}</p>
              ) : null}

              <div className="save-password-actions">
                <button type="button" onClick={closeGroupSelectModal}>
                  Cancelar
                </button>
                <button type="submit" disabled={!groupSelectInput.trim()}>
                  Criar/Escolher grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {groupEditorModalOpen ? (
        <div
          className="save-password-modal-backdrop"
          role="presentation"
          onClick={closeGroupEditorModal}
        >
          <div
            className="save-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="group-editor-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="group-editor-title">
              {groupEditorKey ? "Editar grupo" : "Criar grupo"}
            </h3>
            <form
              className="save-password-form"
              onSubmit={(event) => {
                event.preventDefault();
                void saveGroupEditor();
              }}
            >
              <label>
                Nome do grupo (obrigatorio)
                <input
                  type="text"
                  value={groupEditorName}
                  onChange={(event) => {
                    setGroupEditorName(event.target.value);
                    if (groupEditorError) {
                      setGroupEditorError("");
                    }
                  }}
                  autoFocus
                  required
                />
              </label>

              <label>
                Descricao do grupo
                <textarea
                  value={groupEditorDescription}
                  onChange={(event) => {
                    setGroupEditorDescription(event.target.value);
                    if (groupEditorError) {
                      setGroupEditorError("");
                    }
                  }}
                  rows={3}
                  placeholder="Descricao opcional do grupo..."
                />
              </label>

              <label>
                Senha do grupo (opcional)
                <input
                  type="password"
                  value={groupEditorPassword}
                  onChange={(event) => {
                    setGroupEditorPassword(event.target.value);
                    if (groupEditorError) {
                      setGroupEditorError("");
                    }
                  }}
                  placeholder={
                    groupEditorHasPassword
                      ? "Digite para alterar a senha"
                      : "Digite para definir uma senha"
                  }
                />
              </label>

              {groupEditorKey && groupEditorHasPassword ? (
                <label>
                  <input
                    type="checkbox"
                    checked={groupEditorRemovePassword}
                    onChange={(event) => {
                      setGroupEditorRemovePassword(event.target.checked);
                    }}
                  />
                  Remover senha atual do grupo
                </label>
              ) : null}

              <label>
                Imagem do grupo (somente upload)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    onGroupEditorImageFileSelected(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>

              {groupEditorImageUrl ? (
                <div className="group-image-preview">
                  <img src={groupEditorImageUrl} alt="Preview do grupo" />
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      setGroupEditorImageUrl("");
                      setGroupEditorImageFile(null);
                    }}
                  >
                    Remover imagem
                  </button>
                </div>
              ) : null}

              <label>
                Anexar arquivos
                <input
                  type="file"
                  multiple
                  onChange={(event) => {
                    addAttachmentsToEditor(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>

              {groupEditorAttachments.length > 0 ? (
                <ul className="group-attachments-list group-attachments-list-editor">
                  {groupEditorAttachments.map((attachment) => (
                    <li key={attachment.id}>
                      <span>
                        {attachment.name} ({formatFileSize(attachment.size)})
                      </span>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeEditorAttachment(attachment.id)}
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {groupEditorError ? (
                <p className="save-password-error">{groupEditorError}</p>
              ) : null}

              <div className="save-password-actions">
                <button
                  type="button"
                  onClick={closeGroupEditorModal}
                  disabled={isSavingGroup}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isSavingGroup}>
                  {isSavingGroup
                    ? "Sincronizando..."
                    : groupEditorKey
                      ? "Salvar grupo"
                      : "Criar grupo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        className="app-toast-container"
      />
    </>
  );

  const persistSelectedCharacter = async (password: string) => {
    if (!selectedCharacter) {
      return;
    }

    const isVariation = !!selectedCharacter.parentId;

    const isCreating =
      isVariation ||
      activeSheetId === null ||
      selectedCharacter.id !== activeSheetId;
    const targetSheetId = isCreating ? null : selectedCharacter.id;

    setIsSavingSheet(true);
    setApiError(null);

    try {
      const endpoint = isCreating
        ? `${API_BASE_URL}/sheets`
        : `${API_BASE_URL}/sheets/${targetSheetId}`;
      const method = isCreating ? "POST" : "PUT";

      const characterToSave = isVariation
        ? { ...selectedCharacter, parentId: undefined }
        : selectedCharacter;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          character: characterToSave,
        }),
      });

      const payload = (await response.json()) as {
        id?: string;
        message?: string;
      };

      if (!response.ok) {
        toast.error(
          payload.message ??
            (isCreating
              ? "Falha ao cadastrar a ficha."
              : "Falha ao salvar a ficha."),
        );
        return;
      }

      const persistedId = isCreating
        ? (payload.id ?? selectedCharacter.id)
        : targetSheetId;

      if (persistedId) {
        setCharacters((current) =>
          current.map((character) =>
            character.id === selectedId
              ? { ...character, id: persistedId }
              : character,
          ),
        );
        setSelectedId(persistedId);
        setActiveSheetId(persistedId);
      }

      setActiveSheetPassword(password);
      await fetchSheetList();
      if (isCreating) {
        setSavePasswordModalOpen(false);
        resetSavePasswordForm();
      } else {
        setConfirmSavePasswordModalOpen(false);
        resetConfirmSavePasswordForm();
      }
      toast.success(
        isCreating
          ? "Ficha cadastrada com sucesso no banco."
          : "Ficha salva com sucesso no banco.",
      );
    } catch {
      toast.error(
        isCreating
          ? "Erro de conexao ao cadastrar a ficha."
          : "Erro de conexao ao salvar a ficha.",
      );
    } finally {
      setIsSavingSheet(false);
    }
  };

  const handleSavePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (savePasswordInput.trim().length < SHEET_PASSWORD_MIN_LENGTH) {
      setSavePasswordError(
        `Use no minimo ${SHEET_PASSWORD_MIN_LENGTH} caracteres.`,
      );
      return;
    }

    if (savePasswordInput !== savePasswordConfirmInput) {
      setSavePasswordError("As senhas nao conferem.");
      return;
    }

    setSavePasswordError("");
    void persistSelectedCharacter(savePasswordInput);
  };

  const poderesCatalogo = PODERES_POR_NAIPE[naipePoderSelecionado];

  const tiposNoCatalogo = useMemo(
    () => [...new Set(poderesCatalogo.map((p) => p.tipo))].sort(),
    [poderesCatalogo],
  );

  const poderesCatalogoFiltrado = useMemo(
    () =>
      poderesCatalogo.filter((p) => {
        if (
          catalogoSearch &&
          !p.nome.toLowerCase().includes(catalogoSearch.toLowerCase())
        )
          return false;
        if (catalogoFiltroAcao && p.acao !== catalogoFiltroAcao) return false;
        if (catalogoFiltroDuracao && p.duracao !== catalogoFiltroDuracao)
          return false;
        if (catalogoFiltroTipo && p.tipo !== catalogoFiltroTipo) return false;
        return true;
      }),
    [
      poderesCatalogo,
      catalogoSearch,
      catalogoFiltroAcao,
      catalogoFiltroDuracao,
      catalogoFiltroTipo,
    ],
  );

  if (!selectedCharacter) {
    return (
      <>
        <div className="home-page">
          <section className="home-list block">
            <h2>Carregando ficha...</h2>
            <p>Aguarde um instante enquanto o editor sincroniza os dados.</p>
            <button
              type="button"
              onClick={() => {
                const fallback = createEmptyCharacter();
                setCharacters([fallback]);
                setSelectedId(fallback.id);
                navigateToScreen("editor");
              }}
            >
              Recriar ficha em branco
            </button>
          </section>
        </div>
        {renderGlobalOverlays()}
      </>
    );
  }

  const isSelectedCharacterPersisted =
    activeSheetId !== null && selectedCharacter.id === activeSheetId;
  const isSelectedVariation = !!selectedCharacter.parentId;

  const saveSelectedCharacter = async () => {
    if (!selectedCharacter) {
      return;
    }

    if (isSelectedVariation) {
      return;
    }

    if (!isSelectedCharacterPersisted) {
      setSavePasswordModalOpen(true);
      return;
    }

    await persistSelectedCharacter(activeSheetPassword);
  };

  const principalCharacter =
    characters.find((character) => !character.parentId) ??
    characters[0] ??
    null;
  const prototypeCharacters = principalCharacter
    ? characters.filter((character) => character.id !== principalCharacter.id)
    : [];

  const renderCharacterListItem = (character: CharacterSheet) => (
    <li
      key={character.id}
      className={`character-local-item${!character.parentId ? " character-local-item--principal" : ""}`}
    >
      <button
        type="button"
        className={`character-local-select ${character.id === selectedId ? "active" : ""}`}
        onClick={() => {
          setSelectedId(character.id);

          const principalId = character.parentId ?? character.id;
          const isSavedPrincipal = savedSheets.some(
            (sheet) => sheet.id === principalId,
          );

          if (isSavedPrincipal) {
            setActiveSheetId(principalId);
          } else {
            setActiveSheetId(null);
            setActiveSheetPassword("");
          }
        }}
      >
        <strong>
          {!character.parentId ? (
            <span className="character-principal-label">Principal</span>
          ) : null}
          <span className="character-name-text">
            {character.nome || "Sem nome"}
          </span>
          {character.parentId ? (
            <span
              className="character-variation-badge"
              title="Versao local (teste)"
            >
              Local
            </span>
          ) : null}
        </strong>
      </button>
      <div className="character-local-tools">
        {!character.parentId ? (
          <>
            <button
              type="button"
              className="character-icon-button"
              aria-label={`Duplicar ${character.nome || "personagem"}`}
              title={`Duplicar ${character.nome || "personagem"}`}
              onClick={() => duplicateCharacterById(character.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 8h10v10H8zM5 5h10v2H7v8H5z" />
              </svg>
            </button>
            <button
              type="button"
              className="character-icon-button"
              aria-label={`Resetar ${character.nome || "perfil principal"}`}
              title="Resetar principal"
              onClick={() => openResetPrincipalConfirmation(character.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 5V2L8 6l4 4V7a5 5 0 1 1-4.9 6H5.08A7 7 0 1 0 12 5Z" />
              </svg>
            </button>
          </>
        ) : character.localSaved ? (
          <>
            <button
              type="button"
              className="character-icon-button"
              aria-label={`Duplicar ${character.nome || "personagem"}`}
              title={`Duplicar ${character.nome || "personagem"}`}
              onClick={() => duplicateCharacterById(character.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 8h10v10H8zM5 5h10v2H7v8H5z" />
              </svg>
            </button>
            <button
              type="button"
              className="character-icon-button danger"
              aria-label={`Excluir ${character.nome || "personagem"}`}
              title={`Excluir ${character.nome || "personagem"}`}
              onClick={() => deleteCharacterById(character.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 7h10l-1 13H8zm3-3h4l1 2h4v2H5V6h4z" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="character-icon-button"
              aria-label={`Salvar ${character.nome || "versao"}`}
              title="Confirmar versao local"
              onClick={() => saveVariationLocally(character.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 3h11l3 3v15H5zm2 2v5h8V5zm0 14h10v-7H7z" />
              </svg>
            </button>
            <button
              type="button"
              className="character-icon-button danger"
              aria-label={`Excluir ${character.nome || "personagem"}`}
              title={`Excluir ${character.nome || "personagem"}`}
              onClick={() => deleteCharacterById(character.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 7h10l-1 13H8zm3-3h4l1 2h4v2H5V6h4z" />
              </svg>
            </button>
          </>
        )}
      </div>
    </li>
  );

  if (screen === "home") {
    return (
      <>
        <div className="home-page">
          <header className="home-header">
            <div className="home-header-content">
              <img
                className="home-brand-logo"
                src={logoImage}
                alt="Logo Éter & Naipes"
              />
            </div>
            <nav className="home-header-nav" aria-label="Navegacao principal">
              <ul>
                <li>
                  <button type="button">Manual</button>
                </li>
                <li>
                  <button type="button">Copas</button>
                </li>
                <li>
                  <button type="button">Espadas</button>
                </li>
                <li>
                  <button type="button">Ouros</button>
                </li>
                <li>
                  <button type="button">Paus</button>
                </li>
              </ul>
            </nav>
            <div className="home-header-actions">
              <button
                type="button"
                className="home-create-button"
                onClick={openCreateGroupModal}
              >
                Criar grupo
              </button>
              <button
                type="button"
                className="home-create-button"
                onClick={() => {
                  openGroupSelectModal();
                }}
              >
                <GiScrollQuill size={16} aria-hidden="true" />
                Criar ficha
              </button>
            </div>
          </header>

          <section className="home-list block home-list-panel">
            {isLoadingSheets ? <p>Carregando grupos...</p> : null}
            {apiError ? <p className="danger-value">{apiError}</p> : null}
            {getAllGroups().length === 0 ? (
              <div>
                <h2>Nenhum grupo criado ainda</h2>
                <p className="home-empty-state">
                  Crie uma ficha para começar um grupo!
                </p>
              </div>
            ) : (
              <div>
                <h2>Grupos ({getAllGroups().length})</h2>
                <div className="home-card-grid home-group-grid">
                  {getAllGroups().map((group) => {
                    const sheetsInGroup = getSheetsInGroup(group.key);
                    const groupSheetCount = Math.max(
                      sheetsInGroup.length,
                      group.sheetCount,
                    );
                    const latestSheet = sheetsInGroup.sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime(),
                    )[0];
                    const previewImageUrl =
                      group.imageUrl ||
                      (latestSheet ? getSheetPreviewImageUrl(latestSheet) : "");

                    return (
                      <article key={group.key} className="home-card">
                        <button
                          type="button"
                          className="home-card-open"
                          onClick={() => navigateToGroup(group.key)}
                        >
                          {previewImageUrl ? (
                            <img
                              className="home-card-avatar"
                              src={
                                group.imageUrl ||
                                latestSheet?.imagemViewUrl ||
                                previewImageUrl
                              }
                              alt={`Grupo ${group.name}`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="home-card-avatar placeholder">
                              {group.name}
                            </div>
                          )}
                          <div className="home-card-meta">
                            <strong>{group.name}</strong>
                            <span className="home-card-player">
                              Fichas: {groupSheetCount}
                            </span>
                          </div>
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
        {renderGlobalOverlays()}
      </>
    );
  }

  if (screen === "group" && selectedGroup) {
    const groupSheets = getSheetsInGroup(selectedGroup);
    const group = getGroupByKey(selectedGroup);

    return (
      <>
        <div className="home-page">
          <header className="home-header">
            <div className="home-header-content">
              <button
                type="button"
                className="home-back-button"
                onClick={navigateToHome}
                title="Voltar para grupos"
              >
                ← Voltar
              </button>
              <h1 className="home-group-title">
                {group?.name || selectedGroup}
              </h1>
            </div>
            <div className="home-header-actions">
              <button
                type="button"
                className="home-create-button"
                onClick={() => {
                  void openEditGroupModal(selectedGroup);
                }}
              >
                Editar grupo
              </button>
              {group &&
              normalizeGroupKey(group.name) !==
                normalizeGroupKey("Sem grupo") ? (
                <button
                  type="button"
                  className="home-delete-group-button"
                  onClick={() => {
                    openDeleteGroupModal(selectedGroup);
                  }}
                >
                  Excluir grupo
                </button>
              ) : null}
              <button
                type="button"
                className="home-create-button"
                onClick={() => {
                  createNewSheet(selectedGroup);
                }}
              >
                <GiScrollQuill size={16} aria-hidden="true" />
                Criar ficha
              </button>
            </div>
          </header>

          <section className="home-list block home-list-panel">
            <div className="group-manage-panel">
              <h3>Arquivos do grupo</h3>
              <label className="group-attachments-input">
                <span>Anexar arquivos</span>
                <input
                  type="file"
                  multiple
                  onChange={(event) => {
                    void addAttachmentsToGroup(
                      selectedGroup,
                      event.target.files,
                    );
                    event.target.value = "";
                  }}
                />
              </label>
              {group?.attachments?.length ? (
                <ul className="group-attachments-list">
                  {group.attachments.map((attachment) => (
                    <li key={attachment.id}>
                      <a
                        href={attachment.url}
                        download={attachment.name}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {attachment.name}
                      </a>
                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          removeGroupAttachment(selectedGroup, attachment.id)
                        }
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="home-empty-state">Sem anexos neste grupo.</p>
              )}
            </div>

            <h2>Fichas do grupo ({groupSheets.length})</h2>
            {groupSheets.length === 0 ? (
              <p className="home-empty-state">
                Nenhuma ficha neste grupo ainda.
              </p>
            ) : null}

            <div className="home-card-grid">
              {groupSheets.map((sheet) => {
                const previewImageUrl = getSheetPreviewImageUrl(sheet);

                return (
                  <article key={sheet.id} className="home-card">
                    <button
                      type="button"
                      className="home-card-open"
                      onClick={() => openSheetForEditing(sheet)}
                    >
                      {previewImageUrl ? (
                        <img
                          className="home-card-avatar"
                          src={sheet.imagemViewUrl || previewImageUrl}
                          alt={`Retrato de ${sheet.nome || "personagem"}`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="home-card-avatar placeholder">
                          Sem imagem
                        </div>
                      )}
                      <div className="home-card-meta">
                        <strong>{sheet.nome || "Sem nome"}</strong>
                        <span className="home-card-player">
                          Jogador: {sheet.jogador || "-"}
                        </span>
                      </div>
                    </button>

                    <div className="home-card-footer">
                      <small className="home-card-updated-at">
                        Ultima atualizacao:{" "}
                        {new Date(sheet.updatedAt).toLocaleString("pt-BR")}
                      </small>
                      <div className="home-card-actions">
                        <button
                          type="button"
                          className="home-card-move"
                          aria-label={`Mover ficha ${sheet.nome || "sem nome"}`}
                          title="Mover ficha"
                          onClick={() => openMoveSheetModal(sheet)}
                        >
                          Mover
                        </button>
                        <button
                          type="button"
                          className="home-card-delete"
                          aria-label={`Excluir ficha ${sheet.nome || "sem nome"}`}
                          title="Excluir ficha"
                          onClick={() => openDeleteSheetModal(sheet)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h2v9H7V9Zm4 0h2v9h-2V9Zm4 0h2v9h-2V9Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
        {renderGlobalOverlays()}
      </>
    );
  }

  const poderDetalhesSelecionado =
    detalhesPoderId !== null
      ? (POWER_BY_ID.get(detalhesPoderId) ?? null)
      : null;
  const updateCharacter = (
    updater: (current: CharacterSheet) => CharacterSheet,
  ) => {
    setCharacters((current) =>
      current.map((character) =>
        character.id === selectedId ? updater(character) : character,
      ),
    );
  };

  const applyPretipoConfirmed = (pretipoId: string) => {
    const def = PRETIPOS.find((p) => p.id === pretipoId);
    if (!def) return;

    const builtVantagens = def.vantagens.flatMap(({ catalogId, graduacao }) => {
      const cat = VANTAGEM_BY_ID.get(catalogId);
      if (!cat) return [];
      const entry: CharacterAdvantage = {
        id: crypto.randomUUID(),
        catalogId,
        nome: cat.nome,
        categoria: cat.categoria,
        graduacao,
        temGraduacao: cat.temGraduacao,
        custoPorGraduacao: cat.custoPorGraduacao,
        resumo: cat.resumo,
        efeito: cat.efeito,
      };
      return [entry];
    });

    const builtDesvantagens = def.desvantagens.flatMap(
      ({ catalogId, graduacao }) => {
        const cat = DESVANTAGEM_BY_ID.get(catalogId);
        if (!cat) return [];
        const entry: CharacterDisadvantage = {
          id: crypto.randomUUID(),
          catalogId,
          nome: cat.nome,
          categoria: cat.categoria,
          nivel: cat.nivel,
          graduacao,
          temGraduacao: cat.temGraduacao,
          ppPorGraduacao: cat.ppPorGraduacao,
          resumo: cat.resumo,
          efeito: cat.efeito,
        };
        return [entry];
      },
    );

    const builtPoderes: CharacterPower[] = def.poderes.map(
      ({ powerId, graduacao }) => ({
        id: crypto.randomUUID(),
        powerId,
        graduacao,
        extrasSelecionados: [],
        falhasSelecionadas: [],
      }),
    );

    const builtPericias = Object.fromEntries(
      PERICIAS.map((nome) => [nome, def.pericias[nome] ?? "0"]),
    ) as Record<string, string>;

    const builtTecnicas = Object.fromEntries(
      TECNICAS_BASICAS.map((t) => [
        t.nome,
        { graduacao: def.tecnicasBasicas[t.nome] ?? "" },
      ]),
    ) as Record<string, { graduacao: string }>;

    updateCharacter((current) => ({
      id: current.id,
      nome: def.nome,
      imagemUrl: "",
      nivel: "0",
      jogador: current.jogador,
      xp: "0",
      conceito: def.conceito,
      naipe: def.naipe,
      carga: "",
      mov: "",
      periciasExtra: "0",
      atributos: def.atributos,
      combate: {
        ataqueCac: def.ataqueCac,
        disparo: def.disparo,
        resistenciaPoderFonte: def.resistenciaPoderFonte,
        defesa: def.defesa,
      },
      pericias: builtPericias,
      conhecimentos: normalizeConhecimentos(def.conhecimentos),
      tecnicasBasicas: builtTecnicas,
      vantagens: builtVantagens,
      desvantagens: builtDesvantagens,
      poderes: builtPoderes,
      tecnicasDesenvolvidas: [],
      equipamentos: "",
    }));
    setPretipoSelecionado("");
  };

  const applyPretipo = (pretipoId: string) => {
    const def = PRETIPOS.find((p) => p.id === pretipoId);
    if (!def) return;

    setPendingConfirmation({
      title: "Aplicar pre-tipo",
      message: `Aplicar o pre-tipo "${def.label}"? Todos os dados atuais da ficha serao substituidos.`,
      confirmLabel: "Aplicar",
      action: {
        type: "apply-pretipo",
        pretipoId,
      },
    });
  };

  const addCharacter = () => {
    const principalId = selectedCharacter
      ? (selectedCharacter.parentId ?? selectedCharacter.id)
      : null;
    const isPrincipalPersisted =
      principalId !== null &&
      savedSheets.some((sheet) => sheet.id === principalId);

    const newCharacter: CharacterSheet = {
      ...createEmptyCharacter(),
      parentId: principalId ?? undefined,
    };

    setCharacters((current) => [...current, newCharacter]);
    setSelectedId(newCharacter.id);
    setActiveSheetId(isPrincipalPersisted ? principalId : null);
    if (!isPrincipalPersisted) {
      setActiveSheetPassword("");
    }
  };

  const saveVariationLocally = (characterId: string) => {
    setCharacters((current) =>
      current.map((character) =>
        character.id === characterId
          ? { ...character, localSaved: true }
          : character,
      ),
    );
  };

  const deleteCharacterConfirmed = (characterId: string) => {
    const remaining = characters.filter(
      (character) => character.id !== characterId,
    );

    if (remaining.length === 0) {
      return;
    }

    setCharacters(remaining);
    setSelectedId((currentId) =>
      currentId === characterId ? remaining[0].id : currentId,
    );
  };

  const deleteCharacterById = (characterId: string) => {
    const targetCharacter = characters.find(
      (character) => character.id === characterId,
    );
    if (!targetCharacter) {
      return;
    }

    if (!targetCharacter.parentId) {
      toast.warn("O perfil principal nao pode ser excluido, apenas duplicado.");
      return;
    }

    setPendingConfirmation({
      title: "Excluir versao local",
      message: `Excluir "${targetCharacter.nome || "versao sem nome"}"? Essa acao remove apenas esta copia local.`,
      confirmLabel: "Excluir",
      variant: "danger",
      action: {
        type: "delete-character",
        characterId,
      },
    });
  };

  const duplicateCharacterById = (characterId: string) => {
    const sourceCharacter = characters.find(
      (character) => character.id === characterId,
    );

    if (!sourceCharacter) {
      return;
    }

    const cloned: CharacterSheet = {
      ...sourceCharacter,
      id: crypto.randomUUID(),
      nome: sourceCharacter.nome ? `${sourceCharacter.nome} (Copia)` : "",
      parentId: sourceCharacter.parentId ?? sourceCharacter.id,
      localSaved: sourceCharacter.localSaved ?? true,
    };

    const principalId = sourceCharacter.parentId ?? sourceCharacter.id;
    const isPrincipalPersisted = savedSheets.some(
      (sheet) => sheet.id === principalId,
    );

    setCharacters((current) => {
      const sourceIndex = current.findIndex(
        (character) => character.id === characterId,
      );

      if (sourceIndex < 0) {
        return [...current, cloned];
      }

      const next = [...current];
      next.splice(sourceIndex + 1, 0, cloned);
      return next;
    });
    setSelectedId(cloned.id);
    setActiveSheetId(isPrincipalPersisted ? principalId : null);
    if (!isPrincipalPersisted) {
      setActiveSheetPassword("");
    }

    toast.success("Prototipo duplicado com sucesso.");
  };

  const onImageFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem valido.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updateCharacter((current) => ({ ...current, imagemUrl: result }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const vantagensDisponiveis = vantagemCategoriaSelecionada
    ? VANTAGENS_CATALOGO.filter(
        (vantagem) => vantagem.categoria === vantagemCategoriaSelecionada,
      )
    : [];

  const vantagemSelecionada = vantagensDisponiveis.find(
    (vantagem) => vantagem.id === vantagemSelecionadaId,
  );

  const addVantagem = () => {
    if (!vantagemSelecionada) {
      return;
    }

    const graduacao = vantagemSelecionada.temGraduacao
      ? clamp(parseNatural(vantagemGraduacao), 1, 99)
      : 1;

    updateCharacter((current) => ({
      ...current,
      vantagens: [
        ...current.vantagens,
        {
          id: crypto.randomUUID(),
          catalogId: vantagemSelecionada.id,
          nome: vantagemSelecionada.nome,
          categoria: vantagemSelecionada.categoria,
          graduacao,
          temGraduacao: vantagemSelecionada.temGraduacao,
          custoPorGraduacao: vantagemSelecionada.custoPorGraduacao,
          resumo: vantagemSelecionada.resumo,
          efeito: vantagemSelecionada.efeito,
        },
      ],
    }));

    setVantagemSelecionadaId("");
    setVantagemGraduacao("1");
  };

  const removeVantagem = (vantagemId: string) => {
    updateCharacter((current) => ({
      ...current,
      vantagens: current.vantagens.filter(
        (vantagem) => vantagem.id !== vantagemId,
      ),
    }));
  };

  const desvantagensDisponiveis = desvantagemCategoriaSelecionada
    ? DESVANTAGENS_CATALOGO.filter(
        (desvantagem) =>
          desvantagem.categoria === desvantagemCategoriaSelecionada,
      )
    : [];

  const desvantagemSelecionada = desvantagensDisponiveis.find(
    (desvantagem) => desvantagem.id === desvantagemSelecionadaId,
  );

  const addDesvantagem = () => {
    if (!desvantagemSelecionada) {
      return;
    }

    const graduacao = desvantagemSelecionada.temGraduacao
      ? clamp(parseNatural(desvantagemGraduacao), 1, 99)
      : 1;

    updateCharacter((current) => {
      const ppAtual = current.desvantagens.reduce(
        (total, item) => total + item.graduacao * item.ppPorGraduacao,
        0,
      );
      const ppNova = graduacao * desvantagemSelecionada.ppPorGraduacao;

      if (ppAtual + ppNova > DESVANTAGENS_MAX_PP) {
        toast.error(
          `Limite de desvantagens excedido: maximo +${DESVANTAGENS_MAX_PP} PP.`,
        );
        return current;
      }

      const severasAtuais = current.desvantagens.filter(
        (item) => item.nivel === "Severa",
      ).length;
      if (
        desvantagemSelecionada.nivel === "Severa" &&
        severasAtuais >= DESVANTAGENS_MAX_SEVERAS
      ) {
        toast.error(
          `Limite atingido: maximo ${DESVANTAGENS_MAX_SEVERAS} desvantagens Severas.`,
        );
        return current;
      }

      const levesAtuais = current.desvantagens.filter(
        (item) => item.nivel === "Leve",
      ).length;
      if (
        desvantagemSelecionada.nivel === "Leve" &&
        levesAtuais >= DESVANTAGENS_MAX_LEVES
      ) {
        toast.error(
          `Limite atingido: maximo ${DESVANTAGENS_MAX_LEVES} desvantagens Leves.`,
        );
        return current;
      }

      return {
        ...current,
        desvantagens: [
          ...current.desvantagens,
          {
            id: crypto.randomUUID(),
            catalogId: desvantagemSelecionada.id,
            nome: desvantagemSelecionada.nome,
            categoria: desvantagemSelecionada.categoria,
            nivel: desvantagemSelecionada.nivel,
            graduacao,
            temGraduacao: desvantagemSelecionada.temGraduacao,
            ppPorGraduacao: desvantagemSelecionada.ppPorGraduacao,
            resumo: desvantagemSelecionada.resumo,
            efeito: desvantagemSelecionada.efeito,
          },
        ],
      };
    });

    setDesvantagemSelecionadaId("");
    setDesvantagemGraduacao("1");
  };

  const removeDesvantagem = (desvantagemId: string) => {
    updateCharacter((current) => ({
      ...current,
      desvantagens: current.desvantagens.filter(
        (desvantagem) => desvantagem.id !== desvantagemId,
      ),
    }));
  };

  const adicionarPoder = (power: PowerDefinition) => {
    updateCharacter((current) => ({
      ...current,
      poderes: current.poderes.some((item) => item.powerId === power.id)
        ? current.poderes
        : [
            ...current.poderes,
            {
              id: crypto.randomUUID(),
              powerId: power.id,
              graduacao: "1",
              extrasSelecionados: [],
              falhasSelecionadas: [],
            },
          ],
    }));
    setPoderesPanelAtivo("arsenal");
  };

  const removerPoder = (powerEntryId: string) => {
    updateCharacter((current) => ({
      ...current,
      poderes: current.poderes.filter((power) => power.id !== powerEntryId),
    }));
  };

  const nivel = parseNatural(selectedCharacter.nivel);
  const limitePericia = nivel + 5;
  const limitePoder = nivel + 10;
  const limiteTecnica = nivel + 5;
  const limiteDefesaTotal = nivel + 18;
  const limiteResistenciaTotal = nivel + 6;

  const poderesDisponiveisParaTecnica = selectedCharacter.poderes
    .map((entry) => {
      const power = POWER_BY_ID.get(entry.powerId);
      if (!power) {
        return null;
      }

      return {
        power,
        graduacaoAtual: clamp(parseNatural(entry.graduacao), 1, limitePoder),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const tecnicaBaseResolvida = tecnicaDraft.poderesBase
    .map((base) => {
      const power = POWER_BY_ID.get(base.powerId);
      if (!power) {
        return null;
      }

      const graduacao = clamp(parseNatural(base.graduacao), 1, limitePoder);

      return {
        ...base,
        power,
        graduacao,
        custoBasePE: getEterCostByGraduacao(graduacao),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const tecnicaCustoBasePE = tecnicaBaseResolvida.reduce(
    (total, base) => total + base.custoBasePE,
    0,
  );

  const tecnicaBonusDano = clamp(
    parseNatural(tecnicaDraft.modificadores.bonusDano),
    0,
    5,
  );
  const tecnicaBonusPrecisao = clamp(
    parseNatural(tecnicaDraft.modificadores.bonusPrecisao),
    0,
    3,
  );
  const tecnicaPenetracao = Math.max(
    0,
    parseNatural(tecnicaDraft.modificadores.penetracao),
  );
  const tecnicaDanoAmpliado = Math.max(
    0,
    parseNatural(tecnicaDraft.modificadores.danoAmpliado),
  );
  const tecnicaBonusDefesa = clamp(
    parseNatural(tecnicaDraft.modificadores.bonusDefesa),
    0,
    2,
  );
  const tecnicaReducaoDano = clamp(
    parseNatural(tecnicaDraft.modificadores.reducaoDanoRecebido),
    0,
    2,
  );
  const tecnicaCustomCusto = Number.parseInt(
    tecnicaDraft.modificadores.modificadorPersonalizadoCusto,
    10,
  );
  const tecnicaCustomCustoNormalizado = Number.isFinite(tecnicaCustomCusto)
    ? tecnicaCustomCusto
    : 0;

  const tecnicaCustoModificadoresPE =
    tecnicaBonusDano * 2 +
    getPrecisaoCost(tecnicaBonusPrecisao) +
    tecnicaPenetracao * 2 +
    tecnicaDanoAmpliado +
    ATTACK_MULTIPLE_COST[tecnicaDraft.modificadores.ataqueMultiplo] +
    AREA_COST[tecnicaDraft.modificadores.area] +
    CONTROLE_COST[tecnicaDraft.modificadores.controleNivel] +
    ALCANCE_ETAPAS_COST[tecnicaDraft.modificadores.alcanceEtapas] +
    DURACAO_COST[tecnicaDraft.modificadores.duracao] +
    (tecnicaDraft.modificadores.duracaoEstendida ? 2 : 0) +
    QUICK_ACTIVATION_COST[tecnicaDraft.modificadores.ativacaoRapida] +
    tecnicaBonusDefesa * 2 +
    tecnicaReducaoDano * 2 +
    (tecnicaDraft.modificadores.absorcao ? 3 : 0) +
    (tecnicaDraft.modificadores.reflexo ? 2 : 0) +
    tecnicaCustomCustoNormalizado;

  const tecnicaReducoesPE =
    PREPARATION_REDUCTION[tecnicaDraft.modificadores.preparacao] +
    (tecnicaDraft.modificadores.limitacaoPerdeMovimento ? 1 : 0) +
    (tecnicaDraft.modificadores.limitacaoCondicaoEspecifica ? 1 : 0) +
    (tecnicaDraft.modificadores.limitacaoContatoDireto ? 1 : 0) +
    (tecnicaDraft.modificadores.limitacaoAlvoEspecifico ? 1 : 0) +
    (tecnicaDraft.modificadores.limitacaoUsoCena ? 1 : 0);

  const tecnicaAdicionalAplicadoPE = Math.max(
    0,
    tecnicaCustoModificadoresPE - tecnicaReducoesPE,
  );
  const tecnicaLimiteAdicional =
    TECHNIQUE_ADDITIONAL_LIMIT_BY_TYPE[tecnicaDraft.tipo];
  const tecnicaExcedeLimite =
    tecnicaAdicionalAplicadoPE > tecnicaLimiteAdicional;
  const tecnicaCustoFinalPE = Math.max(
    1,
    tecnicaCustoBasePE + tecnicaCustoModificadoresPE - tecnicaReducoesPE,
  );

  const tecnicaMaiorGraduacaoBase = tecnicaBaseResolvida.reduce(
    (max, base) => Math.max(max, base.graduacao),
    0,
  );
  const tecnicaBonusDiretoBruto =
    tecnicaBonusDano + tecnicaDanoAmpliado + tecnicaPenetracao;
  const tecnicaBonusDiretoAplicado = Math.min(
    tecnicaBonusDiretoBruto,
    tecnicaMaiorGraduacaoBase,
  );

  const adicionarPoderBaseTecnica = () => {
    setTecnicaDraft((current) => ({
      ...current,
      poderesBase: [
        ...current.poderesBase,
        createEmptyDevelopedTechniqueBasePower(),
      ],
    }));
  };

  const removerPoderBaseTecnica = (baseId: string) => {
    setTecnicaDraft((current) => ({
      ...current,
      poderesBase:
        current.poderesBase.length <= 1
          ? current.poderesBase
          : current.poderesBase.filter((base) => base.id !== baseId),
    }));
  };

  const salvarTecnicaDesenvolvida = () => {
    const nomeNormalizado = tecnicaDraft.nome.trim();
    if (!nomeNormalizado) {
      toast.error("Defina um nome para a tecnica.");
      return;
    }

    if (tecnicaBaseResolvida.length === 0) {
      toast.error("Selecione ao menos um poder base valido.");
      return;
    }

    if (tecnicaExcedeLimite) {
      toast.error(
        `A tecnica excede o limite de +${tecnicaLimiteAdicional} PE adicional para tipo ${tecnicaDraft.tipo}.`,
      );
      return;
    }

    const tecnica: DevelopedTechnique = {
      id: crypto.randomUUID(),
      nome: nomeNormalizado,
      tipo: tecnicaDraft.tipo,
      conceito: tecnicaDraft.conceito.trim(),
      efeito: tecnicaDraft.efeito.trim(),
      acao: tecnicaDraft.acao.trim(),
      alcance: tecnicaDraft.alcance.trim(),
      alvo: tecnicaDraft.alvo.trim(),
      duracao: tecnicaDraft.duracao.trim(),
      gatilho: tecnicaDraft.gatilho.trim(),
      poderesBase: tecnicaBaseResolvida.map((base) => ({
        id: base.id,
        powerId: base.powerId,
        graduacao: String(base.graduacao),
      })),
      modificadores: {
        ...tecnicaDraft.modificadores,
        bonusDano: String(tecnicaBonusDano),
        bonusPrecisao: String(tecnicaBonusPrecisao),
        penetracao: String(tecnicaPenetracao),
        danoAmpliado: String(tecnicaDanoAmpliado),
        bonusDefesa: String(tecnicaBonusDefesa),
        reducaoDanoRecebido: String(tecnicaReducaoDano),
        modificadorPersonalizadoCusto: String(tecnicaCustomCustoNormalizado),
      },
      custoBasePE: tecnicaCustoBasePE,
      custoModificadoresPE: tecnicaCustoModificadoresPE,
      reducoesPE: tecnicaReducoesPE,
      custoFinalPE: tecnicaCustoFinalPE,
      limiteAdicionalPE: tecnicaLimiteAdicional,
      adicionalAplicadoPE: tecnicaAdicionalAplicadoPE,
      maiorGraduacaoBase: tecnicaMaiorGraduacaoBase,
      bonusDiretoAplicado: tecnicaBonusDiretoAplicado,
      createdAt: new Date().toISOString(),
    };

    updateCharacter((current) => ({
      ...current,
      tecnicasDesenvolvidas: [...current.tecnicasDesenvolvidas, tecnica],
    }));

    setTecnicaDraft(createDevelopedTechniqueDraft());
    toast.success("Tecnica cadastrada na ficha.");
  };

  const removerTecnicaDesenvolvida = (tecnicaId: string) => {
    updateCharacter((current) => ({
      ...current,
      tecnicasDesenvolvidas: current.tecnicasDesenvolvidas.filter(
        (tecnica) => tecnica.id !== tecnicaId,
      ),
    }));
  };

  const conhecimentosEditaveis = getEditableConhecimentos(
    selectedCharacter.conhecimentos,
  );

  const atualizarConhecimento = (
    index: number,
    changes: Partial<ConhecimentoEntry>,
  ) => {
    updateCharacter((current) => {
      const novosConhecimentos = getEditableConhecimentos(
        current.conhecimentos,
      );
      novosConhecimentos[index] = {
        ...novosConhecimentos[index],
        ...changes,
      };

      return {
        ...current,
        conhecimentos: novosConhecimentos,
      };
    });
  };

  const adicionarConhecimento = () => {
    updateCharacter((current) => ({
      ...current,
      conhecimentos: [
        ...getEditableConhecimentos(current.conhecimentos),
        createEmptyConhecimento(),
      ],
    }));
  };

  const removerConhecimento = (index: number) => {
    updateCharacter((current) => {
      const novosConhecimentos = getEditableConhecimentos(
        current.conhecimentos,
      ).filter((_, currentIndex) => currentIndex !== index);

      return {
        ...current,
        conhecimentos:
          novosConhecimentos.length > 0
            ? novosConhecimentos
            : [createEmptyConhecimento()],
      };
    });
  };

  const atributosSpent = ATRIBUTOS.reduce(
    (total, atributo) =>
      total + ATTRIBUTE_PP_BY_DICE[selectedCharacter.atributos[atributo]],
    0,
  );

  const combateSpent =
    COMBAT_PP_BY_DICE[selectedCharacter.combate.ataqueCac] +
    COMBAT_PP_BY_DICE[selectedCharacter.combate.disparo];

  const periciasPontos = PERICIAS.reduce(
    (total, pericia) =>
      total +
      parseNatural(getPericiaSheetValue(selectedCharacter.pericias, pericia)),
    0,
  );

  const conhecimentosPontos = selectedCharacter.conhecimentos.reduce(
    (total, conhecimento) => total + parseNatural(conhecimento.graduacoes),
    0,
  );

  const periciasPontosTotal = periciasPontos + conhecimentosPontos;

  const periciasSpent = periciasPontosTotal / 2;

  const vantagensSpent = selectedCharacter.vantagens.reduce(
    (total, vantagem) => {
      const catalogo = VANTAGEM_BY_ID.get(vantagem.catalogId);
      const custoPorGraduacao =
        catalogo?.custoPorGraduacao ?? vantagem.custoPorGraduacao ?? 3;

      return total + vantagem.graduacao * custoPorGraduacao;
    },
    0,
  );

  const desvantagensBonus = selectedCharacter.desvantagens.reduce(
    (total, desvantagem) => {
      const catalogo = DESVANTAGEM_BY_ID.get(desvantagem.catalogId);
      const ppPorGraduacao =
        catalogo?.ppPorGraduacao ?? desvantagem.ppPorGraduacao ?? 0;

      return total + desvantagem.graduacao * ppPorGraduacao;
    },
    0,
  );

  const bonusConstituicao =
    BONUS_BY_DICE[selectedCharacter.atributos.Constituicao];

  const resistenciasDePoderDisponiveis = RESISTENCIA_PODERES_POSSIVEIS.map(
    (fonte) => ({
      fonte,
      graduacao: getPowerGraduacaoForResistenciaFonte(
        selectedCharacter,
        fonte,
        limitePoder,
      ),
    }),
  );

  const resistenciaPoderFonteSelecionada =
    selectedCharacter.combate.resistenciaPoderFonte;
  const resistenciaPoderAtiva =
    resistenciaPoderFonteSelecionada !== ""
      ? resistenciasDePoderDisponiveis.find(
          (item) => item.fonte === resistenciaPoderFonteSelecionada,
        )
      : undefined;

  const resistenciaPoderes = resistenciaPoderAtiva?.graduacao ?? 0;
  const resistenciaTotal = bonusConstituicao + resistenciaPoderes;
  const resistenciaTotalEfetiva = clamp(
    resistenciaTotal,
    0,
    limiteResistenciaTotal,
  );
  const bonusAgilidadeDefesa =
    BONUS_BY_DICE[selectedCharacter.atributos.Agilidade];

  const maxDefesaComprada = Math.max(
    0,
    limiteDefesaTotal - DEFESA_BASE - bonusAgilidadeDefesa,
  );
  const defesaComprada = clamp(
    parseNatural(selectedCharacter.combate.defesa) - DEFESA_BASE,
    0,
    maxDefesaComprada,
  );

  const defesaCompradaEfetiva = defesaComprada;

  const defesaAdicional = bonusAgilidadeDefesa + defesaCompradaEfetiva;
  const defesaAtual = clamp(
    DEFESA_BASE + defesaAdicional,
    0,
    limiteDefesaTotal,
  );
  const defesaSpent = defesaCompradaEfetiva * DEFESA_PP_POR_PONTO;

  const tecnicasBasicasSpent = TECNICAS_BASICAS.reduce((total, tecnica) => {
    const graduacao = clamp(
      parseNatural(selectedCharacter.tecnicasBasicas[tecnica.nome].graduacao),
      0,
      limiteTecnica,
    );

    return total + graduacao * tecnica.custoPPPorGraduacao;
  }, 0);

  const poderesSpent = selectedCharacter.poderes.reduce((total, powerEntry) => {
    const power = POWER_BY_ID.get(powerEntry.powerId);
    if (!power) {
      return total;
    }

    const graduacao = clamp(parseNatural(powerEntry.graduacao), 1, limitePoder);
    const multiplicadorNaipe = getPowerNaipeMultiplier(
      selectedCharacter.naipe,
      power.naipe,
    );

    const custoBasePoder = getPowerTotalCost(
      power,
      graduacao,
      powerEntry.extrasSelecionados,
      powerEntry.falhasSelecionadas,
    );

    return total + custoBasePoder * multiplicadorNaipe;
  }, 0);

  const totalSpent =
    atributosSpent +
    combateSpent +
    periciasSpent +
    vantagensSpent +
    defesaSpent +
    tecnicasBasicasSpent +
    poderesSpent;

  const nivelAtual = parseNatural(selectedCharacter.nivel);
  const totalPPDisponivel = TOTAL_PP + nivelAtual * 10;
  const ppRestante = totalPPDisponivel + desvantagensBonus - totalSpent;
  const catalogoPoderesLiberado = selectedCharacter.naipe !== "";
  const poderesPanelVisivel = catalogoPoderesLiberado
    ? poderesPanelAtivo
    : "arsenal";

  const vidaMaxima =
    VIDA_BASE_POR_CONSTITUICAO[selectedCharacter.atributos.Constituicao];
  const eterMaximo = ETER_BASE_POR_TECNICA[selectedCharacter.atributos.Tecnica];
  const danoBase = BONUS_BY_DICE[selectedCharacter.atributos.Forca];
  const movimentoBase =
    MOVIMENTO_BASE_POR_AGILIDADE[selectedCharacter.atributos.Agilidade];
  const cargaBase = CARGA_BASE_POR_FORCA[selectedCharacter.atributos.Forca];
  const movimentoAtual = String(movimentoBase);
  const cargaAtual = String(cargaBase);

  const periciasSelecionadas = PERICIAS.filter(
    (pericia) => parseNatural(selectedCharacter.pericias[pericia]) > 0,
  ).map((pericia) => ({
    nome: pericia,
    graduacao: parseNatural(selectedCharacter.pericias[pericia]),
  }));

  const conhecimentosSelecionados = selectedCharacter.conhecimentos.filter(
    (conhecimento) =>
      conhecimento.area.trim() !== "" ||
      parseNatural(conhecimento.graduacoes) > 0,
  );

  const toQuickNarrative = (text?: string, maxLength = 140): string => {
    if (!text) {
      return "";
    }

    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= maxLength) {
      return normalized;
    }

    return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
  };

  const getFluxoAplicacaoValorEfetivo = (
    nomeFluxo: string,
    graduacao: number,
  ): string => {
    switch (nomeFluxo) {
      case "Supressao":
        return "Furtividade";
      case "Foco":
        return "Percepcao";
      case "Campo":
        return `Metros de distancia (raio atual: ${getCampoRaio(graduacao)})`;
      case "Guarda":
        return "Resistencia";
      case "Impulso":
        return "Ataque ou Dano";
      case "Ruptura":
        return "Dano ou Resistencia";
      default:
        return "Efeito da tecnica";
    }
  };

  const tecnicasBasicasSelecionadas = TECNICAS_BASICAS.map((tecnica) => {
    const graduacao = clamp(
      parseNatural(selectedCharacter.tecnicasBasicas[tecnica.nome].graduacao),
      0,
      limiteTecnica,
    );

    return {
      tecnica,
      graduacao,
      derived: getTecnicaBasicaDerived(
        tecnica,
        String(graduacao),
        limiteTecnica,
      ),
    };
  }).filter((item) => item.graduacao > 0);

  const poderesSelecionadosResumo = selectedCharacter.poderes
    .map((powerEntry) => {
      const power = POWER_BY_ID.get(powerEntry.powerId);
      if (!power) {
        return null;
      }

      const graduacao = clamp(
        parseNatural(powerEntry.graduacao),
        1,
        limitePoder,
      );
      const custoBase = getPowerTotalCost(
        power,
        graduacao,
        powerEntry.extrasSelecionados,
        powerEntry.falhasSelecionadas,
      );
      const multiplicadorNaipe = getPowerNaipeMultiplier(
        selectedCharacter.naipe,
        power.naipe,
      );

      return {
        id: powerEntry.id,
        nome: power.nome,
        naipe: power.naipe,
        tipo: power.tipo,
        graduacao,
        custoFinal: custoBase * multiplicadorNaipe,
        narrativa: toQuickNarrative(power.efeitoPrincipal ?? power.resumo, 150),
        extras: powerEntry.extrasSelecionados,
        falhas: powerEntry.falhasSelecionadas,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (screen === "quick-sheet") {
    return (
      <>
        <div className="quick-sheet-screen">
          <header className="quick-sheet-header">
            <div>
              <p className="quick-sheet-kicker">Ficha gerada</p>
              <h1>{selectedCharacter.nome || "Personagem sem nome"}</h1>
              <p>
                Jogador: {selectedCharacter.jogador || "Nao informado"} | Nivel{" "}
                {selectedCharacter.nivel || "0"}
              </p>
            </div>
            <div className="quick-sheet-header-actions">
              <button
                type="button"
                className="quick-sheet-nav-btn"
                onClick={() => navigateToScreen("editor")}
              >
                Voltar ao editor
              </button>
              <button
                type="button"
                className="quick-sheet-nav-btn"
                onClick={() => navigateToScreen("home")}
              >
                Inicio
              </button>
            </div>
          </header>

          <nav className="quick-sheet-nav" aria-label="Secoes da ficha rapida">
            <button
              type="button"
              className={fichaGeradaPagina === 1 ? "active" : ""}
              onClick={() => setFichaGeradaPagina(1)}
            >
              Macro geral
            </button>
            <button
              type="button"
              className={fichaGeradaPagina === 2 ? "active" : ""}
              onClick={() => setFichaGeradaPagina(2)}
            >
              Poderes e tecnicas
            </button>
          </nav>

          {fichaGeradaPagina === 1 ? (
            <div className="quick-sheet-grid">
              <section className="quick-sheet-card">
                <h2>Identidade</h2>
                <p>
                  <strong>Conceito:</strong> {selectedCharacter.conceito || "-"}
                </p>
                <p>
                  <strong>Naipe:</strong>{" "}
                  {selectedCharacter.naipe || "Nao definido"}
                </p>
                <p>
                  <strong>XP:</strong> {selectedCharacter.xp || "0"}
                </p>
              </section>

              <section className="quick-sheet-card">
                <h2>Status</h2>
                <p>
                  <strong>Vida:</strong> {vidaMaxima}
                </p>
                <p>
                  <strong>Eter:</strong> {eterMaximo}
                </p>
                <p>
                  <strong>Defesa:</strong> {defesaAtual} | <strong>Res:</strong>{" "}
                  {resistenciaTotalEfetiva}
                </p>
                <p>
                  <strong>CaC:</strong> {selectedCharacter.combate.ataqueCac} |{" "}
                  <strong>Disparo:</strong> {selectedCharacter.combate.disparo}
                </p>
                <p>
                  <strong>Mov:</strong> {movimentoAtual}m |{" "}
                  <strong>Carga:</strong> {cargaAtual}kg
                </p>
              </section>

              <section className="quick-sheet-card">
                <h2>Atributos</h2>
                <ul className="quick-sheet-list">
                  {ATRIBUTOS.map((atributo) => (
                    <li key={atributo}>
                      {atributo}: {selectedCharacter.atributos[atributo]}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="quick-sheet-card">
                <h2>Pericias</h2>
                {periciasSelecionadas.length === 0 ? (
                  <p>Sem pericias com graduacao.</p>
                ) : (
                  <ul className="quick-sheet-list">
                    {periciasSelecionadas.map((pericia) => (
                      <li key={pericia.nome}>
                        {pericia.nome}: {pericia.graduacao}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="quick-sheet-card quick-sheet-card-wide">
                <h2>Conhecimentos</h2>
                {conhecimentosSelecionados.length === 0 ? (
                  <p>Sem conhecimentos cadastrados.</p>
                ) : (
                  <ul className="quick-sheet-list">
                    {conhecimentosSelecionados.map((conhecimento, index) => (
                      <li key={`quick-conhecimento-${index}`}>
                        {conhecimento.area || "Area nao definida"}:{" "}
                        {parseNatural(conhecimento.graduacoes)}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="quick-sheet-card">
                <h2>Vantagens</h2>
                {selectedCharacter.vantagens.length === 0 ? (
                  <p>Nenhuma vantagem.</p>
                ) : (
                  <ul className="quick-sheet-list">
                    {selectedCharacter.vantagens.map((vantagem) => (
                      <li key={vantagem.id}>
                        {vantagem.nome}
                        {vantagem.temGraduacao
                          ? ` (Grad. ${vantagem.graduacao})`
                          : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="quick-sheet-card">
                <h2>Desvantagens</h2>
                {selectedCharacter.desvantagens.length === 0 ? (
                  <p>Nenhuma desvantagem.</p>
                ) : (
                  <ul className="quick-sheet-list">
                    {selectedCharacter.desvantagens.map((desvantagem) => (
                      <li key={desvantagem.id}>
                        {desvantagem.nome} ({desvantagem.nivel})
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="quick-sheet-card quick-sheet-card-wide">
                <h2>Equipamentos e notas</h2>
                <p>
                  {selectedCharacter.equipamentos?.trim() ||
                    "Sem anotacoes de equipamentos."}
                </p>
              </section>
            </div>
          ) : (
            <div className="quick-sheet-grid">
              <section className="quick-sheet-card quick-sheet-card-wide">
                <h2>Fluxos naturais</h2>
                <p className="quick-sheet-section-note">
                  Fluxos natural direto para resposta imediata em combate,
                  leitura do campo e sustentacao do personagem.
                </p>
                {tecnicasBasicasSelecionadas.length === 0 ? (
                  <p>Nenhum fluxo natural configurado.</p>
                ) : (
                  <ul className="quick-sheet-list">
                    {tecnicasBasicasSelecionadas.map((item) => (
                      <li
                        key={item.tecnica.nome}
                        className="quick-sheet-item-rich"
                      >
                        <div className="quick-sheet-item-head">
                          <strong>{item.tecnica.nome}</strong>
                          <span className="quick-sheet-item-tag">
                            {item.tecnica.tipo}
                          </span>
                        </div>
                        <span className="quick-sheet-item-meta">
                          Grad. {item.graduacao} · Valor Efetivo{" "}
                          {item.tecnica.nome === "Campo"
                            ? getCampoRaio(item.graduacao)
                            : item.derived.ve}{" "}
                          · Custo {item.derived.custoPE} PE
                        </span>
                        <p className="quick-sheet-item-meta quick-sheet-item-meta-extra">
                          Aplicacao do Valor Efetivo:{" "}
                          {getFluxoAplicacaoValorEfetivo(
                            item.tecnica.nome,
                            item.graduacao,
                          )}
                        </p>
                        <p className="quick-sheet-item-note">
                          {toQuickNarrative(item.tecnica.descricao, 150)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="quick-sheet-card quick-sheet-card-wide">
                <h2>Poderes</h2>
                <p className="quick-sheet-section-note">
                  Poderes configurados por naipe para formar seu arsenal ativo,
                  com graduacao, custo final e ajustes aplicados.
                </p>
                {poderesSelecionadosResumo.length === 0 ? (
                  <p>Nenhum poder no arsenal.</p>
                ) : (
                  <ul className="quick-sheet-list">
                    {poderesSelecionadosResumo.map((poder) => (
                      <li key={poder.id} className="quick-sheet-item-rich">
                        <div className="quick-sheet-item-head">
                          <strong>{poder.nome}</strong>
                          <span className="quick-sheet-item-tag">
                            {poder.naipe}
                          </span>
                        </div>
                        <span className="quick-sheet-item-meta">
                          {poder.tipo} · Grad. {poder.graduacao} · Custo{" "}
                          {poder.custoFinal} PP
                        </span>
                        {poder.narrativa ? (
                          <p className="quick-sheet-item-note">
                            {poder.narrativa}
                          </p>
                        ) : null}
                        {poder.extras.length > 0 || poder.falhas.length > 0 ? (
                          <p className="quick-sheet-item-meta quick-sheet-item-meta-extra">
                            {poder.extras.length > 0
                              ? `Extras: ${poder.extras.join(", ")}`
                              : "Sem extras"}
                            {poder.falhas.length > 0
                              ? ` · Falhas: ${poder.falhas.join(", ")}`
                              : ""}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="quick-sheet-card quick-sheet-card-wide">
                <h2>Tecnicas desenvolvidas</h2>
                <p className="quick-sheet-section-note">
                  Tecnicas Primarias, Avancadas e Especiais montadas a partir de
                  poderes base e modificadores customizados.
                </p>
                {selectedCharacter.tecnicasDesenvolvidas.length === 0 ? (
                  <p>Nenhuma tecnica cadastrada.</p>
                ) : (
                  <ul className="quick-sheet-list">
                    {selectedCharacter.tecnicasDesenvolvidas.map((tecnica) => (
                      <li key={tecnica.id} className="quick-sheet-item-rich">
                        <div className="quick-sheet-item-head">
                          <strong>{tecnica.nome}</strong>
                          <span className="quick-sheet-item-tag">
                            {tecnica.tipo}
                          </span>
                        </div>
                        <span className="quick-sheet-item-meta">
                          Custo final: {tecnica.custoFinalPE} PE
                        </span>
                        {tecnica.conceito || tecnica.efeito ? (
                          <p className="quick-sheet-item-note">
                            {toQuickNarrative(
                              tecnica.conceito || tecnica.efeito,
                              150,
                            )}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}
        </div>

        {renderGlobalOverlays()}
      </>
    );
  }

  return (
    <>
      <div className="page">
        <aside className="character-list">
          <h1 className="sheet-brand-heading">
            <img
              src={logoImage}
              alt="Eter e Naipes"
              className="sheet-brand-logo"
            />
          </h1>

          <div className="character-primary-actions">
            {!isSelectedVariation ? (
              <button
                type="button"
                onClick={() => void saveSelectedCharacter()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M5 3h11l3 3v15H5zm2 2v5h8V5zm0 14h10v-7H7z" />
                </svg>
                {isSavingSheet
                  ? !isSelectedCharacterPersisted
                    ? "Cadastrando..."
                    : "Salvando..."
                  : !isSelectedCharacterPersisted
                    ? "Cadastrar"
                    : "Salvar"}
              </button>
            ) : null}
            <button type="button" onClick={addCharacter}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
              </svg>
              Nova
            </button>
            <button
              type="button"
              className="generate-sheet-button"
              onClick={() => {
                setFichaGeradaPagina(1);
                navigateToScreen("quick-sheet");
              }}
            >
              Gerar ficha
            </button>
          </div>
          {apiError ? <p className="danger-value">{apiError}</p> : null}

          {principalCharacter ? (
            <ul className="character-local-list character-local-list--principal">
              {renderCharacterListItem(principalCharacter)}
            </ul>
          ) : null}

          <section
            className="character-prototype-panel"
            aria-label="Prototipos locais"
          >
            <div className="character-prototype-header">
              Prototipos locais ({prototypeCharacters.length})
            </div>
            <div className="character-prototype-scroll">
              {prototypeCharacters.length === 0 ? (
                <p className="character-prototype-empty">
                  Nenhum prototipo criado.
                </p>
              ) : (
                <ul className="character-local-list character-local-list--prototypes">
                  {prototypeCharacters.map(renderCharacterListItem)}
                </ul>
              )}
            </div>
          </section>

          <div className="character-list-footer">
            <button type="button" onClick={() => void goBackToHome()}>
              Sair
            </button>
          </div>
        </aside>

        <main className="sheet-wrapper">
          <section className="block pp-summary editor-pp-summary">
            <h3>
              Pontos de Personagem
              <span className="pp-total-inline">{totalPPDisponivel} pts</span>
            </h3>
            <div className="editor-pp-content">
              <div className="pp-header">
                <div>
                  <AnimatedNumber
                    value={totalSpent}
                    className="pp-strong"
                    precision={1}
                  />
                  <span>Gastos</span>
                </div>
                <div className={ppRestante < 0 ? "danger-value" : ""}>
                  <AnimatedNumber
                    value={ppRestante}
                    className="pp-strong"
                    precision={1}
                  />
                  <span>Restantes</span>
                </div>
              </div>
              <div className="pp-breakdown-inline">
                <span className="pp-chip">
                  <span className="pp-chip-name">Atributos</span>
                  <span className="pp-chip-value">
                    <AnimatedNumber value={atributosSpent} />
                  </span>
                </span>
                <span className="pp-chip">
                  <span className="pp-chip-name">Ataque</span>
                  <span className="pp-chip-value">
                    <AnimatedNumber value={combateSpent} />
                  </span>
                </span>
                <span className="pp-chip">
                  <span className="pp-chip-name">Defesa</span>
                  <span className="pp-chip-value">
                    <AnimatedNumber value={defesaSpent} />
                  </span>
                </span>
                <span className="pp-chip">
                  <span className="pp-chip-name">Pericias</span>
                  <span className="pp-chip-value">
                    <AnimatedNumber value={periciasSpent} precision={1} />
                  </span>
                </span>
                <span className="pp-chip">
                  <span className="pp-chip-name">Vantagens</span>
                  <span className="pp-chip-value">
                    <AnimatedNumber value={vantagensSpent} />
                  </span>
                </span>
                <span className="pp-chip pp-chip-bonus">
                  <span className="pp-chip-name">Desvantagens</span>
                  <span className="pp-chip-value">
                    +<AnimatedNumber value={desvantagensBonus} />
                  </span>
                </span>
                <span className="pp-chip">
                  <span className="pp-chip-name">Tecnicas</span>
                  <span className="pp-chip-value">
                    <AnimatedNumber value={tecnicasBasicasSpent} />
                  </span>
                </span>
                <span className="pp-chip">
                  <span className="pp-chip-name">Poderes</span>
                  <span className="pp-chip-value">
                    <AnimatedNumber value={poderesSpent} />
                  </span>
                </span>
              </div>
            </div>
          </section>

          <div className="editor-tabs-bar">
            <div className="editor-tabs">
              {EDITOR_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  className={activeEditorTab === tab.id ? "active" : ""}
                  onClick={() => setActiveEditorTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="editor-tab-content">
            {activeEditorTab === "identidade" ? (
              <>
                <section className="sheet-header block">
                  <div className="identity-info-header">
                    <h3>
                      Identidade
                      <div className="identity-info-badges">
                        <div className="identity-info-badge">
                          <span>Nível</span>
                          <NumericStepperInput
                            min={0}
                            value={selectedCharacter.nivel}
                            ariaLabel="Nivel"
                            onChange={(value) =>
                              updateCharacter((current) => ({
                                ...current,
                                nivel: String(parseNatural(String(value))),
                              }))
                            }
                          />
                        </div>
                        <div className="identity-info-badge">
                          <span>XP</span>
                          <NumericStepperInput
                            min={0}
                            max={10}
                            value={selectedCharacter.xp}
                            ariaLabel="XP"
                            onChange={(value) => {
                              const xpValue = parseNatural(String(value));
                              if (xpValue >= 10) {
                                const novoNivel =
                                  parseNatural(selectedCharacter.nivel) + 1;
                                toast.success(
                                  `Voce upou para o nivel ${novoNivel}! +10 PP totais.`,
                                );
                                updateCharacter((current) => ({
                                  ...current,
                                  xp: "0",
                                  nivel: String(novoNivel),
                                }));
                              } else {
                                updateCharacter((current) => ({
                                  ...current,
                                  xp: String(xpValue),
                                }));
                              }
                            }}
                          />
                        </div>
                      </div>
                    </h3>
                  </div>

                  <div className="grid identity-grid identity-grid-layout">
                    <div className="identity-left-panel">
                      <span className="naipe-radio-title identity-column-title">
                        Informações
                      </span>
                      <div className="identity-left-column">
                        <label>
                          Personagem
                          <input
                            value={selectedCharacter.nome}
                            onChange={(event) =>
                              updateCharacter((current) => ({
                                ...current,
                                nome: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label>
                          Jogador
                          <input
                            value={selectedCharacter.jogador}
                            onChange={(event) =>
                              updateCharacter((current) => ({
                                ...current,
                                jogador: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label>
                          Conceito
                          <input
                            placeholder="Ex: Velocista que ataca com lâminas de vento"
                            value={selectedCharacter.conceito}
                            onChange={(event) =>
                              updateCharacter((current) => ({
                                ...current,
                                conceito: event.target.value,
                              }))
                            }
                          />
                        </label>
                      </div>
                    </div>
                    <div className="naipe-radio-panel identity-right-column">
                      <span className="naipe-radio-title">
                        Naipe
                        <span className="naipe-radio-subtitle">
                          (Selecione 1)
                        </span>
                      </span>
                      <div className="naipe-radio-grid">
                        {NAIPE_IDENTITY_OPTIONS.map((option) => {
                          const checked =
                            selectedCharacter.naipe === option.value;
                          const slotClass = option.value
                            ? `naipe-slot-${option.value.toLowerCase()}`
                            : "naipe-slot-none";
                          return (
                            <label
                              key={option.value || "nenhum"}
                              className={`naipe-radio-option ${slotClass} ${option.tone} ${checked ? "checked" : ""}`}
                            >
                              <input
                                type="radio"
                                name="identity-naipe"
                                value={option.value}
                                checked={checked}
                                onChange={() =>
                                  updateCharacter((current) => ({
                                    ...current,
                                    naipe: option.value,
                                  }))
                                }
                              />
                              <span className="naipe-icon" aria-hidden="true">
                                {option.icon}
                              </span>
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                <div className="identity-secondary-grid">
                  <section className="block identity-image-panel">
                    <h3 className="identity-image-title">
                      Imagem do Personagem
                    </h3>
                    <p className="identity-image-subtitle">
                      Adicione uma URL ou envie um arquivo local.
                    </p>
                    <div className="identity-image-row">
                      {getCharacterImageForDisplay(selectedCharacter) ? (
                        <img
                          className="identity-portrait"
                          src={getCharacterImageForDisplay(selectedCharacter)}
                          alt={`Retrato de ${selectedCharacter.nome || "personagem"}`}
                        />
                      ) : (
                        <div className="identity-portrait placeholder">
                          Sem imagem
                        </div>
                      )}
                      <div className="identity-image-controls">
                        <label className="identity-url-label">
                          URL da imagem
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={selectedCharacter.imagemUrl ?? ""}
                          onChange={(event) => {
                            const value = event.target.value;
                            // Don't allow endpoint URLs in imagemUrl (reserve for base64)
                            if (value && isApiImageUrl(value)) {
                              toast.error(
                                "Use uma URL externa ou envie um arquivo.",
                              );
                              return;
                            }
                            updateCharacter((current) => ({
                              ...current,
                              imagemUrl: value,
                            }));
                          }}
                          className="identity-url-input"
                        />
                        <div className="identity-file-row">
                          <label
                            htmlFor="identity-file-input"
                            className="identity-file-button"
                          >
                            <MdOutlineAddPhotoAlternate
                              size={16}
                              aria-hidden="true"
                            />
                            Adicionar Imagem
                          </label>
                          <input
                            id="identity-file-input"
                            type="file"
                            accept="image/*"
                            className="identity-file-input-hidden"
                            onChange={onImageFileSelected}
                          />
                          <button
                            type="button"
                            className="danger"
                            onClick={() =>
                              updateCharacter((current) => ({
                                ...current,
                                imagemUrl: "",
                                imagemViewUrl: "",
                              }))
                            }
                            disabled={
                              !getCharacterImageForDisplay(selectedCharacter)
                            }
                          >
                            Remover imagem
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="pretipo-panel">
                    <h3 className="pretipo-heading">Modelo de Personagens</h3>
                    <p className="pretipo-hint">
                      Escolha um conceito pre-configurado para gerar uma ficha
                      completa de nivel 0 automaticamente, gastando exatamente
                      180 PP.
                    </p>
                    <div className="pretipo-select-row">
                      <select
                        value={pretipoSelecionado}
                        onChange={(e) => setPretipoSelecionado(e.target.value)}
                      >
                        <option value="">-- Escolha um pre-tipo --</option>
                        {(
                          ["Espadas", "Ouros", "Paus", "Copas"] as Exclude<
                            Naipe,
                            ""
                          >[]
                        ).map((naipe) => (
                          <optgroup key={naipe} label={naipe}>
                            {(PRETIPOS_POR_NAIPE[naipe] ?? []).map((pt) => (
                              <option key={pt.id} value={pt.id}>
                                {pt.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="pretipo-apply-btn"
                        disabled={!pretipoSelecionado}
                        onClick={() => applyPretipo(pretipoSelecionado)}
                      >
                        Aplicar Pre-tipo
                      </button>
                    </div>
                    {pretipoSelecionado
                      ? (() => {
                          const def = PRETIPOS.find(
                            (p) => p.id === pretipoSelecionado,
                          );
                          if (!def) return null;
                          return (
                            <div className="pretipo-preview">
                              <strong>{def.label}</strong>
                              <span className="pretipo-naipe-badge">
                                {def.naipe}
                              </span>
                              <p>{def.descricao}</p>
                              <ul className="pretipo-powers-list">
                                {def.poderes.map((p) => {
                                  const pw = POWER_BY_ID.get(p.powerId);
                                  return pw ? (
                                    <li key={p.powerId}>
                                      {pw.nome}{" "}
                                      <span className="pretipo-grad">
                                        grad {p.graduacao}
                                      </span>
                                    </li>
                                  ) : null;
                                })}
                              </ul>
                            </div>
                          );
                        })()
                      : null}
                  </section>
                </div>
              </>
            ) : null}

            {activeEditorTab === "base" ? (
              <section className="sheet-columns base-layout">
                <div className="base-top-resources">
                  <div className="resource-stat-grid">
                    <div className="resource-stat-card">
                      <div className="resource-stat-head">
                        <span
                          className="resource-stat-icon vida"
                          aria-hidden="true"
                        >
                          <IoMdHeartHalf />
                        </span>
                        <p className="resource-stat-label">
                          Vida
                          <span
                            className="info-dot"
                            data-tooltip={VIDA_MAX_TOOLTIP}
                          >
                            i
                          </span>
                        </p>
                      </div>
                      <p className="resource-stat-value">
                        <AnimatedNumber value={vidaMaxima} />
                      </p>
                    </div>
                    <div className="resource-stat-card">
                      <div className="resource-stat-head">
                        <span
                          className="resource-stat-icon eter"
                          aria-hidden="true"
                        >
                          <GiRollingEnergy />
                        </span>
                        <p className="resource-stat-label">
                          Eter
                          <span
                            className="info-dot"
                            data-tooltip={ETER_MAX_TOOLTIP}
                          >
                            i
                          </span>
                        </p>
                      </div>
                      <p className="resource-stat-value">
                        <AnimatedNumber value={eterMaximo} />
                      </p>
                    </div>
                    <div className="resource-stat-card">
                      <div className="resource-stat-head">
                        <span
                          className="resource-stat-icon carga"
                          aria-hidden="true"
                        >
                          <FaWeightHanging />
                        </span>
                        <p className="resource-stat-label">
                          Carga
                          <span
                            className="info-dot"
                            data-tooltip={CARGA_TOOLTIP}
                          >
                            i
                          </span>
                        </p>
                      </div>
                      <p className="resource-stat-value">
                        <AnimatedNumber value={parseNatural(cargaAtual)} /> kg
                      </p>
                    </div>
                    <div className="resource-stat-card">
                      <div className="resource-stat-head">
                        <span
                          className="resource-stat-icon movimento"
                          aria-hidden="true"
                        >
                          <GiWalkingBoot />
                        </span>
                        <p className="resource-stat-label">
                          Movimento
                          <span
                            className="info-dot"
                            data-tooltip={MOVIMENTO_TOOLTIP}
                          >
                            i
                          </span>
                        </p>
                      </div>
                      <p className="resource-stat-value">
                        <AnimatedNumber value={parseNatural(movimentoAtual)} />{" "}
                        m
                      </p>
                    </div>
                  </div>
                </div>

                <article className="block atributos">
                  <h3>
                    Atributos
                    <span
                      className="info-dot section-info-dot"
                      data-tooltip={ATTRIBUTE_PROGRESS_TOOLTIP}
                    >
                      i
                    </span>
                  </h3>
                  <div className="list-grid">
                    {ATRIBUTOS.map((atributo) => {
                      const currentDice = selectedCharacter.atributos[atributo];
                      const atributoTooltip =
                        ATTRIBUTE_DETAIL_TOOLTIPS[atributo];
                      const handleDiceChange = (grade: Dice) =>
                        updateCharacter((current) => {
                          const novosAtributos = {
                            ...current.atributos,
                            [atributo]: grade,
                          };

                          if (
                            atributo !== "Constituicao" &&
                            atributo !== "Agilidade"
                          ) {
                            return { ...current, atributos: novosAtributos };
                          }

                          const bonusAgilidadeAtual =
                            BONUS_BY_DICE[novosAtributos.Agilidade];
                          const maxDefesaCompradaAtual = Math.max(
                            0,
                            parseNatural(current.nivel) +
                              18 -
                              DEFESA_BASE -
                              bonusAgilidadeAtual,
                          );
                          const defesaCompradaAtual = clamp(
                            parseNatural(current.combate.defesa) - DEFESA_BASE,
                            0,
                            maxDefesaCompradaAtual,
                          );

                          return {
                            ...current,
                            atributos: novosAtributos,
                            combate: {
                              ...current.combate,
                              defesa: String(
                                DEFESA_BASE +
                                  clamp(
                                    defesaCompradaAtual,
                                    0,
                                    maxDefesaCompradaAtual,
                                  ),
                              ),
                            },
                          };
                        });

                      return (
                        <div key={atributo} className="atributo-row">
                          <div className="atributo-meta">
                            <span className="atributo-nome">{atributo}</span>
                            <span
                              className="info-dot atributo-info-dot"
                              data-tooltip={atributoTooltip}
                            >
                              i
                            </span>
                          </div>
                          <div
                            className="dice-radio-group"
                            role="radiogroup"
                            aria-label={atributo}
                          >
                            {DICE_OPTIONS.map((grade) => {
                              const checked = currentDice === grade;
                              const isDisabled = nivel === 0 && grade === "D12";
                              const points = DICE_POLYGON_POINTS[grade];
                              return (
                                <label
                                  key={grade}
                                  className={`dice-radio-label${checked ? " checked" : ""}${isDisabled ? " disabled" : ""}`}
                                  title={grade}
                                >
                                  <input
                                    type="radio"
                                    name={`attr-${atributo}`}
                                    value={grade}
                                    checked={checked}
                                    disabled={isDisabled}
                                    onChange={() => handleDiceChange(grade)}
                                  />
                                  <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    focusable="false"
                                  >
                                    {points === null ? (
                                      <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="2.5"
                                      />
                                    ) : (
                                      <polygon points={points} />
                                    )}
                                  </svg>
                                  <span>{grade}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="block combat-panel combat-panel-full">
                  <h3>
                    Combate
                    <span
                      className="info-dot section-info-dot"
                      data-tooltip={COMBAT_PROGRESS_TOOLTIP}
                    >
                      i
                    </span>
                  </h3>
                  <div className="resource-grid combat-grid">
                    <div className="combat-dice-row">
                      <div className="combat-dice-meta">
                        <span className="combat-dice-name">Ataque CaC</span>
                        <span
                          className="info-dot"
                          data-tooltip={COMBAT_DICE_DETAIL_TOOLTIPS.ataqueCac}
                        >
                          i
                        </span>
                      </div>
                      <div
                        className="dice-radio-group"
                        role="radiogroup"
                        aria-label="Ataque CaC"
                      >
                        {COMBAT_DICE_OPTIONS.map((value) => {
                          const checked =
                            selectedCharacter.combate.ataqueCac === value;
                          const isDisabled = nivel === 0 && value === "D12";
                          const points =
                            value === "-" ? null : DICE_POLYGON_POINTS[value];

                          return (
                            <label
                              key={`cac-${value}`}
                              className={`dice-radio-label${checked ? " checked" : ""}${isDisabled ? " disabled" : ""}`}
                              title={value === "-" ? "Sem dado" : value}
                            >
                              <input
                                type="radio"
                                name="combat-ataque-cac"
                                value={value}
                                checked={checked}
                                disabled={isDisabled}
                                onChange={() =>
                                  updateCharacter((current) => ({
                                    ...current,
                                    combate: {
                                      ...current.combate,
                                      ataqueCac: value,
                                    },
                                  }))
                                }
                              />
                              <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                focusable="false"
                              >
                                {value === "-" ? (
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                ) : points === null ? (
                                  <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2.5"
                                  />
                                ) : (
                                  <polygon points={points} />
                                )}
                              </svg>
                              <span>{value === "-" ? "Nenhum" : value}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="combat-dice-row">
                      <div className="combat-dice-meta">
                        <span className="combat-dice-name">Disparo</span>
                        <span
                          className="info-dot"
                          data-tooltip={COMBAT_DICE_DETAIL_TOOLTIPS.disparo}
                        >
                          i
                        </span>
                      </div>
                      <div
                        className="dice-radio-group"
                        role="radiogroup"
                        aria-label="Disparo"
                      >
                        {COMBAT_DICE_OPTIONS.map((value) => {
                          const checked =
                            selectedCharacter.combate.disparo === value;
                          const isDisabled = nivel === 0 && value === "D12";
                          const points =
                            value === "-" ? null : DICE_POLYGON_POINTS[value];

                          return (
                            <label
                              key={`disparo-${value}`}
                              className={`dice-radio-label${checked ? " checked" : ""}${isDisabled ? " disabled" : ""}`}
                              title={value === "-" ? "Sem dado" : value}
                            >
                              <input
                                type="radio"
                                name="combat-disparo"
                                value={value}
                                checked={checked}
                                disabled={isDisabled}
                                onChange={() =>
                                  updateCharacter((current) => ({
                                    ...current,
                                    combate: {
                                      ...current.combate,
                                      disparo: value,
                                    },
                                  }))
                                }
                              />
                              <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                focusable="false"
                              >
                                {value === "-" ? (
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                ) : points === null ? (
                                  <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2.5"
                                  />
                                ) : (
                                  <polygon points={points} />
                                )}
                              </svg>
                              <span>{value === "-" ? "Nenhum" : value}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="combat-summary-row">
                      <div className="defesa-stack emphasis-panel">
                        <span className="combat-group-title">Defesa</span>
                        <div className="defesa-line">
                          <span className="defesa-chip">
                            <span className="defesa-chip-title">
                              Base
                              <span
                                className="info-dot"
                                data-tooltip={DEFESA_BASE_HUMANA_TOOLTIP}
                              >
                                i
                              </span>
                            </span>
                            <span className="defesa-chip-value">
                              {DEFESA_BASE}
                            </span>
                          </span>
                          <span className="defesa-op">+</span>
                          <span className="defesa-chip">
                            <span className="defesa-chip-title">
                              Agilidade
                              <span
                                className="info-dot"
                                data-tooltip={DEFESA_AGILIDADE_TOOLTIP}
                              >
                                i
                              </span>
                            </span>
                            <span className="defesa-chip-value">
                              <AnimatedNumber value={bonusAgilidadeDefesa} />
                            </span>
                          </span>
                          <span className="defesa-op">+</span>
                          <label className="defesa-chip defesa-comprada-group">
                            <span className="defesa-chip-title">
                              Comprada
                              <span
                                className="info-dot"
                                data-tooltip={DEFESA_COMPRADA_TOOLTIP}
                              >
                                i
                              </span>
                            </span>
                            <NumericStepperInput
                              className="defesa-chip-input"
                              min={0}
                              max={Math.max(0, maxDefesaComprada)}
                              value={String(defesaCompradaEfetiva)}
                              ariaLabel="Defesa comprada"
                              onChange={(value) =>
                                updateCharacter((current) => {
                                  const limiteAtual =
                                    parseNatural(current.nivel) + 18;
                                  const bonusAgilidadeAtual =
                                    BONUS_BY_DICE[current.atributos.Agilidade];
                                  const maxDefesaCompradaAtual = clamp(
                                    limiteAtual -
                                      DEFESA_BASE -
                                      bonusAgilidadeAtual,
                                    0,
                                    limiteAtual,
                                  );

                                  const novaDefesaComprada = clamp(
                                    parseNatural(value),
                                    0,
                                    maxDefesaCompradaAtual,
                                  );

                                  return {
                                    ...current,
                                    combate: {
                                      ...current.combate,
                                      defesa: String(
                                        DEFESA_BASE + novaDefesaComprada,
                                      ),
                                    },
                                  };
                                })
                              }
                            />
                          </label>
                          <span className="defesa-total">
                            <span className="defesa-total-label">
                              Defesa Total
                              <span
                                className="info-dot section-info-dot tooltip-edge-right"
                                data-tooltip={DEFESA_TOTAL_TOOLTIP}
                              >
                                i
                              </span>
                            </span>
                            <strong>{defesaAtual}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="resistance-stack emphasis-panel passive-panel">
                        <span className="combat-group-title">Resistencia</span>
                        <div className="resistance-row">
                          <span className="resistance-stat">
                            <span className="metric-label-with-tip">
                              Base
                              <span
                                className="info-dot"
                                data-tooltip={RESISTENCIA_BASE_TOOLTIP}
                              >
                                i
                              </span>
                            </span>
                            <span className="resistance-value">
                              <AnimatedNumber value={bonusConstituicao} />
                            </span>
                          </span>
                          <span className="resistance-op">+</span>
                          <label className="resistance-poder-group">
                            <span className="metric-label-with-tip">
                              Fonte de Poder
                              <span
                                className="info-dot"
                                data-tooltip={RESISTENCIA_PODERES_TOOLTIP}
                              >
                                i
                              </span>
                            </span>
                            <div className="resistance-poder-inline">
                              <select
                                value={resistenciaPoderFonteSelecionada}
                                onChange={(event) =>
                                  updateCharacter((current) => ({
                                    ...current,
                                    combate: {
                                      ...current.combate,
                                      resistenciaPoderFonte: event.target
                                        .value as ResistancePowerSource,
                                    },
                                  }))
                                }
                              >
                                <option value="">Nenhum</option>
                                {resistenciasDePoderDisponiveis.map((item) => {
                                  const label =
                                    item.graduacao > 0
                                      ? `${item.fonte} (+${item.graduacao})`
                                      : `${item.fonte} (nao comprado)`;
                                  return (
                                    <option
                                      key={item.fonte}
                                      value={item.fonte}
                                      disabled={item.graduacao === 0}
                                    >
                                      {label}
                                    </option>
                                  );
                                })}
                              </select>
                              {resistenciaPoderes > 0 && (
                                <span className="resistance-value poder-value">
                                  +{resistenciaPoderes}
                                </span>
                              )}
                            </div>
                          </label>
                          <span className="resistance-op">=</span>
                          <span className="resistance-stat resistance-total-stat">
                            <span className="metric-label-with-tip">
                              Total
                              <span
                                className="info-dot tooltip-edge-right"
                                data-tooltip={RESISTENCIA_TOTAL_TOOLTIP}
                              >
                                i
                              </span>
                            </span>
                            <span className="resistance-value total-value">
                              {resistenciaTotalEfetiva}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="dano-base-panel emphasis-panel passive-panel">
                        <span className="combat-group-title">Dano Base</span>
                        <p className="dano-base-note">
                          Este é o dano humano do personagem, sem uso de Éter.
                        </p>
                        <div className="dano-base-content">
                          <span className="resistance-stat">
                            <span className="metric-label-with-tip">
                              Dano Físico (Força)
                              <span
                                className="info-dot"
                                data-tooltip={DANO_BASE_TOOLTIP}
                              >
                                i
                              </span>
                            </span>
                            <span className="resistance-value total-value">
                              <AnimatedNumber value={danoBase} />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            ) : null}

            {activeEditorTab === "pericias" ? (
              <section className="block pericias-block">
                <h3>Pericias</h3>
                <div className="pericias-intro-card">
                  <p>
                    Pericias representam conhecimentos, treinamento e
                    experiencia acumulada. Enquanto atributos mostram talento
                    natural, pericias mostram pratica e especializacao em
                    atividades especificas.
                  </p>
                  <div className="pericias-intro-columns">
                    <div className="pericias-intro-column">
                      <p>
                        <strong>Teste de Pericia:</strong>
                      </p>
                      <p className="pericias-intro-formula">
                        1d20 + Atributo + Bonus da Pericia + Modificadores
                      </p>
                      <ul className="pericias-intro-list">
                        <li>1d20: imprevisibilidade da situacao.</li>
                        <li>Atributo: capacidade natural do personagem.</li>
                        <li>Pericia: treinamento e experiencia.</li>
                        <li>Modificadores: circunstancias da cena.</li>
                        <li>
                          Sucesso quando o resultado final e igual ou maior que
                          a CD definida pelo mestre.
                        </li>
                      </ul>
                      <p>
                        <strong>Custo:</strong> cada graduacao custa 0,5 PP.
                        Limite por pericia: Nivel + 5.
                      </p>
                    </div>
                    <div className="pericias-intro-column">
                      <p>
                        <strong>Funcionamento:</strong> testes de pericia
                        representam o esforco do personagem para resolver
                        desafios com conhecimento tecnico e pratica.
                      </p>
                      <p>
                        <strong>Treinamento:</strong> personagens treinados
                        aplicam o bonus de graduacao normalmente. Sem
                        treinamento, usam apenas o atributo e podem ser
                        impedidos em tarefas que exigem especializacao.
                      </p>
                      <p>
                        <strong>Especializacao:</strong> algumas pericias
                        possuem areas especificas (ex.: Conhecimento em
                        historia, ciencia, politica, cultura popular), refinando
                        o perfil mecanico e narrativo do personagem.
                      </p>
                    </div>
                  </div>
                  <p className="pericias-intro-status">
                    Limite atual por pericia/conhecimento: {limitePericia}
                    (Nivel + 5). Total investido: {periciasPontosTotal}
                    graduacoes = {periciasSpent} PP ({periciasPontos} em
                    Pericias e {conhecimentosPontos} em Conhecimentos).
                  </p>
                </div>
                <div className="skills-grid">
                  {PERICIAS.map((pericia) => {
                    const valorSheet = getPericiaSheetValue(
                      selectedCharacter.pericias,
                      pericia,
                    );
                    const valor = parseNatural(valorSheet);
                    const acimaLimite = valor > limitePericia;
                    const info = PERICIA_INFO[pericia];
                    const atributoRelacionado = info?.atributo ?? "Intelecto";
                    const dadoRelacionado =
                      selectedCharacter.atributos[atributoRelacionado];
                    const pontosDadoRelacionado =
                      DICE_POLYGON_POINTS[dadoRelacionado];
                    const tooltip = info?.descricao ?? "Sem descricao.";

                    return (
                      <label
                        key={pericia}
                        className={acimaLimite ? "warn" : ""}
                      >
                        <span className="pericia-name">
                          <span className="pericia-atributo-badge">
                            <span className="pericia-atributo-badge-label">
                              {ATRIBUTO_SIGLA[atributoRelacionado]}
                            </span>
                            <span
                              className="pericia-atributo-badge-icon"
                              aria-hidden="true"
                            >
                              <svg viewBox="0 0 24 24" focusable="false">
                                {pontosDadoRelacionado === null ? (
                                  <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2.5"
                                  />
                                ) : (
                                  <polygon points={pontosDadoRelacionado} />
                                )}
                              </svg>
                            </span>
                            <span className="pericia-atributo-badge-die">
                              {dadoRelacionado}
                            </span>
                          </span>
                          <span className="pericia-name-line">
                            <span className="pericia-name-text">{pericia}</span>
                            <span className="info-dot" data-tooltip={tooltip}>
                              i
                            </span>
                          </span>
                        </span>
                        <NumericStepperInput
                          min={0}
                          max={limitePericia || undefined}
                          value={valorSheet}
                          ariaLabel={pericia}
                          onChange={(value) =>
                            updateCharacter((current) => ({
                              ...current,
                              pericias: {
                                ...current.pericias,
                                [pericia]: value,
                              },
                            }))
                          }
                        />
                      </label>
                    );
                  })}
                </div>
                <div className="conhecimentos-stack">
                  <div className="conhecimentos-header">
                    <div>
                      <strong>Conhecimento</strong>
                      <p>
                        Escolha uma area por vez e use Adicionar para abrir um
                        novo Conhecimento.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="conhecimento-add-button"
                      onClick={adicionarConhecimento}
                    >
                      Adicionar
                    </button>
                  </div>
                  {conhecimentosEditaveis.map((conhecimento, index) => {
                    const valor = parseNatural(conhecimento.graduacoes);
                    const acimaLimite = valor > limitePericia;
                    const conhecimentoTooltip =
                      PERICIA_INFO.Conhecimento.descricao;
                    const conhecimentoAtributo =
                      PERICIA_INFO.Conhecimento.atributo;
                    const conhecimentoDado =
                      selectedCharacter.atributos[conhecimentoAtributo];
                    const conhecimentoPontos =
                      DICE_POLYGON_POINTS[conhecimentoDado];

                    return (
                      <div
                        key={`conhecimento-${index}`}
                        className={`conhecimento-row ${acimaLimite ? "warn" : ""}`}
                      >
                        <span className="pericia-name">
                          <span className="pericia-atributo-badge">
                            <span className="pericia-atributo-badge-label">
                              {ATRIBUTO_SIGLA[conhecimentoAtributo]}
                            </span>
                            <span
                              className="pericia-atributo-badge-icon"
                              aria-hidden="true"
                            >
                              <svg viewBox="0 0 24 24" focusable="false">
                                {conhecimentoPontos === null ? (
                                  <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2.5"
                                  />
                                ) : (
                                  <polygon points={conhecimentoPontos} />
                                )}
                              </svg>
                            </span>
                            <span className="pericia-atributo-badge-die">
                              {conhecimentoDado}
                            </span>
                          </span>
                          <span className="pericia-name-line">
                            <span className="pericia-name-text">
                              Conhecimento
                            </span>
                            <span
                              className="info-dot"
                              data-tooltip={conhecimentoTooltip}
                            >
                              i
                            </span>
                          </span>
                        </span>
                        <select
                          value={conhecimento.area}
                          onChange={(event) =>
                            atualizarConhecimento(index, {
                              area: event.target.value,
                            })
                          }
                        >
                          <option value="">Selecione</option>
                          {CONHECIMENTO_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.value}: {option.descricao}
                            </option>
                          ))}
                        </select>
                        <NumericStepperInput
                          min={0}
                          max={limitePericia || undefined}
                          value={conhecimento.graduacoes}
                          ariaLabel={`Graduacoes de conhecimento ${index + 1}`}
                          onChange={(value) =>
                            atualizarConhecimento(index, {
                              graduacoes: value,
                            })
                          }
                        />
                        <div className="conhecimento-row-actions">
                          <button
                            type="button"
                            className="conhecimento-remove-button danger"
                            onClick={() => removerConhecimento(index)}
                            aria-label={`Remover conhecimento ${index + 1}`}
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {activeEditorTab === "tecnicas" ? (
              <section>
                <article className="block manipulacoes tecnicas-basicas-wide">
                  <h3>Fluxos Naturais</h3>
                  <div className="tecnicas-intro">
                    <div className="tecnicas-intro-columns">
                      <div className="tecnicas-intro-column">
                        <p className="tecnicas-intro-chapter-title">
                          Fluxos Naturais
                        </p>
                        <p>
                          Fluxos Naturais sao usos diretos do Eter para reacao,
                          leitura, defesa e reforco em combate.
                        </p>
                        <p>
                          Cada tecnica tem Graduacao, Valor Efetivo e consumo de
                          PE. O Valor Efetivo segue uma progressao comum, mas o
                          efeito e o custo real dependem de cada tecnica.
                        </p>

                        <p className="tecnicas-intro-chapter-title">
                          Progressao
                        </p>
                        <ul className="tecnicas-intro-list">
                          <li>
                            Graduacao 1-4: Valor Efetivo igual a graduacao.
                          </li>
                          <li>
                            A partir da graduacao 5: cada 2 graduacoes concedem
                            +1 Valor Efetivo.
                          </li>
                          <li>1=1, 2=2, 3=3, 4=4, 5-6=5, 7-8=6, 9-10=7.</li>
                          <li>
                            Limite de Graduacao: nivel + 5 ({limiteTecnica} no
                            nivel atual).
                          </li>
                        </ul>

                        <p className="tecnicas-intro-chapter-title">
                          Consumo de Eter
                        </p>
                        <p>
                          O consumo de PE e individual por tecnica. Tecnicas
                          instantaneas gastam por uso; tecnicas sustentadas, por
                          turno.
                        </p>
                      </div>

                      <div className="tecnicas-intro-column">
                        <p className="tecnicas-intro-chapter-title">
                          Regras Gerais
                        </p>
                        <ul className="tecnicas-intro-list">
                          <li>
                            Valor Efetivo segue a progressao geral mostrada ao
                            lado.
                          </li>
                          <li>Tecnicas sustentadas consomem PE por turno.</li>
                          <li>Tecnicas instantaneas consomem PE por uso.</li>
                          <li>
                            Apenas 1 tecnica sustentada pode ficar ativa por
                            vez.
                          </li>
                          <li>Cada reacao adicional no turno custa +1 PE.</li>
                          <li>
                            Apos reagir: -2 em testes de Tecnica ate o proximo
                            turno.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="manip-grid">
                    {TECNICAS_BASICAS.map((tecnica) => (
                      <div className="manip-card" key={tecnica.nome}>
                        <h4>{tecnica.nome}</h4>
                        <p className="manip-meta">
                          {tecnica.tipo} | {tecnica.acao} | {tecnica.duracao}
                        </p>
                        <p className="manip-description">{tecnica.descricao}</p>
                        {(() => {
                          const graduacao =
                            selectedCharacter.tecnicasBasicas[tecnica.nome]
                              .graduacao;
                          const derived = getTecnicaBasicaDerived(
                            tecnica,
                            graduacao,
                            limiteTecnica,
                          );
                          return (
                            <>
                              <div className="manip-stats-grid">
                                <label className="manip-input-field">
                                  <span>Graduacao</span>
                                  <NumericStepperInput
                                    min={0}
                                    max={limiteTecnica}
                                    value={graduacao}
                                    ariaLabel={`Graduacao de ${tecnica.nome}`}
                                    onChange={(value) =>
                                      updateCharacter((current) => ({
                                        ...current,
                                        tecnicasBasicas: {
                                          ...current.tecnicasBasicas,
                                          [tecnica.nome]: {
                                            graduacao: value,
                                          },
                                        },
                                      }))
                                    }
                                  />
                                </label>
                                <div className="manip-stat-chip">
                                  <span className="manip-stat-label">
                                    Valor Efetivo
                                  </span>
                                  <span className="manip-stat-value">
                                    {tecnica.nome === "Campo"
                                      ? getCampoRaio(derived.graduacao)
                                      : derived.ve}
                                  </span>
                                </div>
                                <div className="manip-stat-chip">
                                  <span className="manip-stat-label">
                                    Consumo de Eter
                                  </span>
                                  <span className="manip-stat-value manip-stat-value-text">
                                    {derived.custoPE} PE{" "}
                                    {tecnica.duracao === "Sustentada"
                                      ? "por turno"
                                      : "por uso"}
                                  </span>
                                </div>
                                <div className="manip-stat-chip">
                                  <span className="manip-stat-label">
                                    Custo em PP
                                  </span>
                                  <span className="manip-stat-value manip-stat-value-text">
                                    {tecnica.custoPPPorGraduacao} PP/grad
                                  </span>
                                </div>
                              </div>
                              <p className="manip-effect">
                                Efeito: {derived.efeito}
                              </p>
                              <p className="manip-limitation">
                                Limitacoes: {tecnica.limitacoes}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                  <p className="rule-note">
                    Limite atual: {limiteTecnica}. Valor Efetivo tem rendimento
                    decrescente a partir da graduacao 5. Efeito e consumo de PE
                    devem ser lidos em cada tecnica.
                  </p>
                </article>
              </section>
            ) : null}

            {activeEditorTab === "tecnicas-desenvolvimento" ? (
              <section className="block tecnicas-dev-panel">
                <h3>Desenvolvimento de Tecnicas</h3>
                <div className="tecnicas-dev-intro">
                  <p>
                    Construa tecnicas a partir de poderes base e aplique
                    modificadores/reducoes conforme o Capitulo 11. A tecnica e
                    resolvida como uma unica acao.
                  </p>
                  <p>
                    Custo de aquisicao por tipo: Primaria
                    {` (${TECHNIQUE_PP_BY_TYPE.Primaria} PP)`}, Avancada
                    {` (${TECHNIQUE_PP_BY_TYPE.Avancada} PP)`} e Especial
                    {` (${TECHNIQUE_PP_BY_TYPE.Especial} PP)`}.
                  </p>
                </div>

                <div className="tecnicas-dev-grid">
                  <label>
                    Nome da tecnica
                    <input
                      value={tecnicaDraft.nome}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          nome: event.target.value,
                        }))
                      }
                      placeholder="Ex: Lamina Perfurante"
                    />
                  </label>

                  <label>
                    Tipo
                    <select
                      value={tecnicaDraft.tipo}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          tipo: event.target.value as DevelopedTechniqueType,
                        }))
                      }
                    >
                      <option value="Primaria">Primaria</option>
                      <option value="Avancada">Avancada</option>
                      <option value="Especial">Especial</option>
                    </select>
                  </label>

                  <label>
                    Acao
                    <input
                      value={tecnicaDraft.acao}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          acao: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Alcance
                    <input
                      value={tecnicaDraft.alcance}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          alcance: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Alvo
                    <input
                      value={tecnicaDraft.alvo}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          alvo: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Duracao
                    <input
                      value={tecnicaDraft.duracao}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          duracao: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="tecnicas-dev-textareas">
                  <label>
                    Conceito
                    <textarea
                      value={tecnicaDraft.conceito}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          conceito: event.target.value,
                        }))
                      }
                      placeholder="Defina a intencao e identidade da tecnica."
                    />
                  </label>
                  <label>
                    Efeito completo
                    <textarea
                      value={tecnicaDraft.efeito}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          efeito: event.target.value,
                        }))
                      }
                      placeholder="Descreva resolucao mecanica objetiva."
                    />
                  </label>
                  <label>
                    Gatilho / condicao
                    <textarea
                      value={tecnicaDraft.gatilho}
                      onChange={(event) =>
                        setTecnicaDraft((current) => ({
                          ...current,
                          gatilho: event.target.value,
                        }))
                      }
                      placeholder="Opcional. Ex: exige preparacao."
                    />
                  </label>
                </div>

                <section className="tecnicas-dev-subsection">
                  <h4>Poderes Base</h4>
                  {tecnicaDraft.poderesBase.map((base, index) => {
                    const selectedPowerData =
                      poderesDisponiveisParaTecnica.find(
                        (item) => item.power.id === base.powerId,
                      );
                    const displayGraduacao =
                      selectedPowerData?.graduacaoAtual ?? base.graduacao;

                    return (
                      <div className="tecnica-base-row" key={base.id}>
                        <label>
                          Poder #{index + 1}
                          <select
                            value={base.powerId}
                            onChange={(event) => {
                              const newPowerId = event.target.value;
                              const newPowerData =
                                poderesDisponiveisParaTecnica.find(
                                  (item) => item.power.id === newPowerId,
                                );
                              setTecnicaDraft((current) => ({
                                ...current,
                                poderesBase: current.poderesBase.map((item) =>
                                  item.id === base.id
                                    ? {
                                        ...item,
                                        powerId: newPowerId,
                                        graduacao: newPowerData
                                          ? String(newPowerData.graduacaoAtual)
                                          : item.graduacao,
                                      }
                                    : item,
                                ),
                              }));
                            }}
                          >
                            <option value="">
                              Selecione um poder do arsenal
                            </option>
                            {poderesDisponiveisParaTecnica.map((item) => (
                              <option key={item.power.id} value={item.power.id}>
                                {item.power.nome} ({item.power.naipe}) - Grad.{" "}
                                {item.graduacaoAtual}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Graduacao
                          <input
                            type="number"
                            value={displayGraduacao}
                            disabled
                            aria-label={`Graduacao do poder base ${index + 1} (fixo)`}
                          />
                        </label>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => removerPoderBaseTecnica(base.id)}
                          disabled={tecnicaDraft.poderesBase.length <= 1}
                        >
                          Remover
                        </button>
                      </div>
                    );
                  })}
                  <button type="button" onClick={adicionarPoderBaseTecnica}>
                    Adicionar poder base
                  </button>
                </section>

                <section className="tecnicas-dev-subsection">
                  <h4>Modificadores e Reducoes</h4>
                  <div className="tecnicas-dev-grid">
                    <label>
                      +Dano (max 5)
                      <NumericStepperInput
                        min={0}
                        max={5}
                        value={tecnicaDraft.modificadores.bonusDano}
                        ariaLabel="Bonus de dano"
                        onChange={(value) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              bonusDano: value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Precisao (0 a 3)
                      <NumericStepperInput
                        min={0}
                        max={3}
                        value={tecnicaDraft.modificadores.bonusPrecisao}
                        ariaLabel="Bonus de precisao"
                        onChange={(value) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              bonusPrecisao: value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Penetracao
                      <NumericStepperInput
                        min={0}
                        value={tecnicaDraft.modificadores.penetracao}
                        ariaLabel="Penetracao"
                        onChange={(value) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              penetracao: value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Dano ampliado
                      <NumericStepperInput
                        min={0}
                        value={tecnicaDraft.modificadores.danoAmpliado}
                        ariaLabel="Dano ampliado"
                        onChange={(value) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              danoAmpliado: value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Ataque multiplo
                      <select
                        value={tecnicaDraft.modificadores.ataqueMultiplo}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              ataqueMultiplo: event.target
                                .value as DevelopedTechniqueModifierSet["ataqueMultiplo"],
                            },
                          }))
                        }
                      >
                        <option value="1">1 ataque</option>
                        <option value="2">2 ataques</option>
                        <option value="3">3 ataques</option>
                      </select>
                    </label>
                    <label>
                      Area
                      <select
                        value={tecnicaDraft.modificadores.area}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              area: event.target
                                .value as DevelopedTechniqueModifierSet["area"],
                            },
                          }))
                        }
                      >
                        <option value="">Sem area</option>
                        <option value="3m">3m</option>
                        <option value="5m">5m</option>
                        <option value="10m">10m</option>
                      </select>
                    </label>
                    <label>
                      Controle
                      <select
                        value={tecnicaDraft.modificadores.controleNivel}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              controleNivel: event.target
                                .value as DevelopedTechniqueModifierSet["controleNivel"],
                            },
                          }))
                        }
                      >
                        <option value="">Sem controle</option>
                        <option value="Leve">Leve</option>
                        <option value="Moderado">Moderado</option>
                        <option value="Forte">Forte</option>
                      </select>
                    </label>
                    <label>
                      Estado de controle
                      <input
                        value={tecnicaDraft.modificadores.controleEstado}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              controleEstado: event.target.value,
                            },
                          }))
                        }
                        placeholder="Ex: Imobilizado"
                      />
                    </label>
                    <label>
                      Atributo de resistencia
                      <select
                        value={
                          tecnicaDraft.modificadores.controleAtributoResistencia
                        }
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              controleAtributoResistencia: event.target
                                .value as DevelopedTechniqueModifierSet["controleAtributoResistencia"],
                            },
                          }))
                        }
                      >
                        <option value="Forca">Forca</option>
                        <option value="Agilidade">Agilidade</option>
                        <option value="Vontade">Vontade</option>
                      </select>
                    </label>
                    <label>
                      Etapas de alcance
                      <select
                        value={tecnicaDraft.modificadores.alcanceEtapas}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              alcanceEtapas: event.target
                                .value as DevelopedTechniqueModifierSet["alcanceEtapas"],
                            },
                          }))
                        }
                      >
                        <option value="0">Sem aumento</option>
                        <option value="1">1 etapa</option>
                        <option value="2">2 etapas</option>
                        <option value="3">3 etapas</option>
                        <option value="4">4 etapas</option>
                      </select>
                    </label>
                    <label>
                      Duracao
                      <select
                        value={tecnicaDraft.modificadores.duracao}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              duracao: event.target
                                .value as DevelopedTechniqueModifierSet["duracao"],
                            },
                          }))
                        }
                      >
                        <option value="">Sem alteracao</option>
                        <option value="Sustentada">
                          Instantanea para Sustentada
                        </option>
                        <option value="Continua">
                          Sustentada para Continua
                        </option>
                      </select>
                    </label>
                    <label>
                      Ativacao rapida
                      <select
                        value={tecnicaDraft.modificadores.ativacaoRapida}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              ativacaoRapida: event.target
                                .value as DevelopedTechniqueModifierSet["ativacaoRapida"],
                            },
                          }))
                        }
                      >
                        <option value="">Sem alteracao</option>
                        <option value="Livre">Acao Livre</option>
                        <option value="Reacao">Reacao</option>
                      </select>
                    </label>
                    <label>
                      Preparacao
                      <select
                        value={tecnicaDraft.modificadores.preparacao}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              preparacao: event.target
                                .value as DevelopedTechniqueModifierSet["preparacao"],
                            },
                          }))
                        }
                      >
                        <option value="">Sem preparacao</option>
                        <option value="preparacao">Exige preparacao</option>
                        <option value="turno-completo">
                          Exige 1 turno completo
                        </option>
                      </select>
                    </label>
                    <label>
                      Defesa bonus
                      <NumericStepperInput
                        min={0}
                        max={2}
                        value={tecnicaDraft.modificadores.bonusDefesa}
                        ariaLabel="Bonus de defesa"
                        onChange={(value) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              bonusDefesa: value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Reducao dano recebido
                      <NumericStepperInput
                        min={0}
                        max={2}
                        value={tecnicaDraft.modificadores.reducaoDanoRecebido}
                        ariaLabel="Reducao de dano recebido"
                        onChange={(value) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              reducaoDanoRecebido: value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Modificador personalizado (nome)
                      <input
                        value={
                          tecnicaDraft.modificadores
                            .modificadorPersonalizadoNome
                        }
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              modificadorPersonalizadoNome: event.target.value,
                            },
                          }))
                        }
                        placeholder="Ex: Ruido ritual"
                      />
                    </label>
                    <label>
                      Modificador personalizado (PE)
                      <input
                        type="number"
                        value={
                          tecnicaDraft.modificadores
                            .modificadorPersonalizadoCusto
                        }
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              modificadorPersonalizadoCusto: event.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className="tecnicas-dev-checks">
                    <label>
                      <input
                        type="checkbox"
                        checked={tecnicaDraft.modificadores.absorcao}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              absorcao: event.target.checked,
                            },
                          }))
                        }
                      />
                      Absorcao (+3 PE)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={tecnicaDraft.modificadores.reflexo}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              reflexo: event.target.checked,
                            },
                          }))
                        }
                      />
                      Reflexo (+2 PE)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={tecnicaDraft.modificadores.duracaoEstendida}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              duracaoEstendida: event.target.checked,
                            },
                          }))
                        }
                      />
                      Duracao estendida (+2 PE)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          tecnicaDraft.modificadores.limitacaoPerdeMovimento
                        }
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              limitacaoPerdeMovimento: event.target.checked,
                            },
                          }))
                        }
                      />
                      Perde acao de movimento (-1 PE)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          tecnicaDraft.modificadores.limitacaoCondicaoEspecifica
                        }
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              limitacaoCondicaoEspecifica: event.target.checked,
                            },
                          }))
                        }
                      />
                      Exige condicao especifica (-1 PE)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          tecnicaDraft.modificadores.limitacaoContatoDireto
                        }
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              limitacaoContatoDireto: event.target.checked,
                            },
                          }))
                        }
                      />
                      Exige contato direto (-1 PE)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          tecnicaDraft.modificadores.limitacaoAlvoEspecifico
                        }
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              limitacaoAlvoEspecifico: event.target.checked,
                            },
                          }))
                        }
                      />
                      So funciona contra alvo especifico (-1 PE)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={tecnicaDraft.modificadores.limitacaoUsoCena}
                        onChange={(event) =>
                          setTecnicaDraft((current) => ({
                            ...current,
                            modificadores: {
                              ...current.modificadores,
                              limitacaoUsoCena: event.target.checked,
                            },
                          }))
                        }
                      />
                      Uso limitado por cena (-1 PE)
                    </label>
                  </div>
                </section>

                <section className="tecnicas-dev-subsection tecnica-cost-summary">
                  <h4>Calculo Final</h4>
                  <p>
                    <strong>Custo Base:</strong> {tecnicaCustoBasePE} PE
                  </p>
                  <p>
                    <strong>Modificadores:</strong> +
                    {tecnicaCustoModificadoresPE} PE
                  </p>
                  <p>
                    <strong>Reducoes:</strong> -{tecnicaReducoesPE} PE
                  </p>
                  <p>
                    <strong>Adicional aplicado:</strong> +
                    {tecnicaAdicionalAplicadoPE} PE
                    {` (limite ${tecnicaDraft.tipo}: +${tecnicaLimiteAdicional})`}
                  </p>
                  <p>
                    <strong>Custo Final:</strong> {tecnicaCustoFinalPE} PE
                  </p>
                  <p>
                    <strong>Limite de escala:</strong> bonus direto bruto =
                    {` ${tecnicaBonusDiretoBruto}`} | aplicado =
                    {` ${tecnicaBonusDiretoAplicado}`} | maior graduacao base =
                    {` ${tecnicaMaiorGraduacaoBase}`}.
                  </p>
                  {tecnicaExcedeLimite ? (
                    <p className="danger-value">
                      Excede limite de PE adicional para tecnica{" "}
                      {tecnicaDraft.tipo}.
                    </p>
                  ) : null}
                  <button type="button" onClick={salvarTecnicaDesenvolvida}>
                    Cadastrar tecnica
                  </button>
                </section>

                <section className="tecnicas-dev-subsection">
                  <h4>Tecnicas cadastradas</h4>
                  {selectedCharacter.tecnicasDesenvolvidas.length === 0 ? (
                    <p>Nenhuma tecnica cadastrada.</p>
                  ) : (
                    <div className="tecnica-dev-list">
                      {selectedCharacter.tecnicasDesenvolvidas.map(
                        (tecnica) => (
                          <article
                            key={tecnica.id}
                            className="tecnica-dev-item"
                          >
                            <div>
                              <strong>
                                {tecnica.nome} ({tecnica.tipo})
                              </strong>
                              <span>
                                Custo: {tecnica.custoFinalPE} PE | Aquisicao:{" "}
                                {TECHNIQUE_PP_BY_TYPE[tecnica.tipo]} PP
                              </span>
                              <span>
                                Base: {tecnica.custoBasePE} | Mods: +
                                {tecnica.custoModificadoresPE} | Reducoes: -
                                {tecnica.reducoesPE}
                              </span>
                              <p>
                                {tecnica.efeito ||
                                  tecnica.conceito ||
                                  "Sem descricao."}
                              </p>
                              <ul className="ficha-inline-list">
                                {tecnica.poderesBase.map((base) => {
                                  const power = POWER_BY_ID.get(base.powerId);
                                  return (
                                    <li key={base.id}>
                                      {power?.nome ?? "Poder removido"} | Grad.{" "}
                                      {base.graduacao}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <button
                              type="button"
                              className="trash-button"
                              onClick={() =>
                                removerTecnicaDesenvolvida(tecnica.id)
                              }
                              aria-label={`Remover tecnica ${tecnica.nome}`}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9z" />
                              </svg>
                            </button>
                          </article>
                        ),
                      )}
                    </div>
                  )}
                </section>
              </section>
            ) : null}

            {activeEditorTab === "vantagens" ? (
              <section className="block vantagens-panel vantagens-wide">
                <h3>Vantagens</h3>
                <div className="vantagens-intro">
                  <p>
                    Vantagens representam talentos especiais, treinamentos
                    incomuns e capacidades que diferenciam seu personagem das
                    pessoas comuns. Elas permitem superar limitacoes normais do
                    sistema e ampliar opcoes taticas, sociais e narrativas.
                  </p>
                  <p>
                    <strong>Custo:</strong> as vantagens possuem custos
                    variados. O valor de cada uma aparece ao lado do nome na
                    lista (ex.: 3 PP/grad). Algumas podem ser compradas em
                    multiplas graduacoes para ampliar seus efeitos; outras sao
                    unicas e podem ser adquiridas apenas uma vez.
                  </p>
                  <p>
                    <strong>Tipos de Vantagem:</strong>
                  </p>
                  <ul className="vantagens-intro-list">
                    <li>
                      <strong>Combate:</strong> melhora desempenho ofensivo e
                      defensivo.
                    </li>
                    <li>
                      <strong>Pericia:</strong> aprimora o uso de pericias e
                      suas aplicacoes.
                    </li>
                    <li>
                      <strong>Sorte:</strong> permite manipular resultados e o
                      uso de recursos especiais.
                    </li>
                    <li>
                      <strong>Geral:</strong> representa talentos unicos,
                      recursos narrativos e influencia.
                    </li>
                    <li>
                      <strong>Eter:</strong> aprimora o dominio de energia
                      espiritual e tecnicas baseadas em Eter.
                    </li>
                  </ul>
                </div>
                <div
                  className={`vantagens-controls ${vantagemSelecionada?.temGraduacao ? "with-graduacao" : "without-graduacao"}`}
                >
                  <label>
                    Tipo de Vantagem
                    <select
                      value={vantagemCategoriaSelecionada}
                      onChange={(event) => {
                        setVantagemCategoriaSelecionada(
                          event.target.value as VantagemCategoria | "",
                        );
                        setVantagemSelecionadaId("");
                        setVantagemGraduacao("1");
                      }}
                    >
                      <option value="">Selecione</option>
                      {VANTAGEM_CATEGORIAS.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Vantagem
                    <select
                      className="vantagem-select"
                      value={vantagemSelecionadaId}
                      onChange={(event) => {
                        setVantagemSelecionadaId(event.target.value);
                        setVantagemGraduacao("1");
                      }}
                      disabled={!vantagemCategoriaSelecionada}
                    >
                      <option value="">Selecione</option>
                      {vantagensDisponiveis.map((vantagem) => (
                        <option key={vantagem.id} value={vantagem.id}>
                          {`${formatVantagemCusto(vantagem.custoPorGraduacao, vantagem.temGraduacao)} ${vantagem.nome} - ${vantagem.resumo}`}
                        </option>
                      ))}
                    </select>
                  </label>
                  {vantagemSelecionada?.temGraduacao ? (
                    <label>
                      Graduacao
                      <NumericStepperInput
                        min={1}
                        value={vantagemGraduacao}
                        ariaLabel="Graduacao de vantagem"
                        onChange={setVantagemGraduacao}
                      />
                    </label>
                  ) : null}
                  <button
                    type="button"
                    className="add-vantagem"
                    onClick={addVantagem}
                    disabled={!vantagemSelecionada}
                  >
                    Adicionar vantagem
                  </button>
                </div>

                {vantagemSelecionada ? (
                  <p className="rule-note vantagem-preview">
                    {`${formatVantagemCusto(vantagemSelecionada.custoPorGraduacao, vantagemSelecionada.temGraduacao)} ${vantagemSelecionada.resumo}`}
                    {` ${vantagemSelecionada.efeito}`}
                  </p>
                ) : null}

                <div className="vantagens-list">
                  {selectedCharacter.vantagens.length === 0 ? (
                    <p className="empty-vantagens">
                      Nenhuma vantagem adicionada.
                    </p>
                  ) : (
                    selectedCharacter.vantagens.map((vantagem) => {
                      const catalogo = VANTAGEM_BY_ID.get(vantagem.catalogId);
                      const custoPorGraduacao =
                        catalogo?.custoPorGraduacao ??
                        vantagem.custoPorGraduacao ??
                        3;

                      return (
                        <div className="vantagem-item" key={vantagem.id}>
                          <div>
                            <strong>{vantagem.nome}</strong>
                            <span>
                              {vantagem.categoria}
                              {vantagem.temGraduacao
                                ? ` | Graduacao ${vantagem.graduacao}`
                                : ""}
                              {` | ${vantagem.graduacao * custoPorGraduacao} PP`}
                            </span>
                            <p>{vantagem.efeito}</p>
                          </div>
                          <button
                            type="button"
                            className="trash-button"
                            onClick={() => removeVantagem(vantagem.id)}
                            aria-label={`Remover ${vantagem.nome}`}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9z" />
                            </svg>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            ) : null}

            {activeEditorTab === "desvantagens" ? (
              <section className="block desvantagens-panel desvantagens-wide">
                <h3>Desvantagens</h3>
                <div className="desvantagens-intro">
                  <p>
                    Nem todos os personagens sao definidos apenas por suas
                    capacidades. Desvantagens representam limitacoes reais,
                    falhas, restricoes ou condicoes que impactam o desempenho de
                    forma recorrente e exigem adaptacao durante o jogo.
                  </p>
                  <p>
                    Mais do que fraquezas, desvantagens sao ferramentas de
                    identidade: ajudam a definir quem o personagem e quando as
                    coisas nao saem como planejado.
                  </p>
                  <p>
                    <strong>Aquisicao:</strong> desvantagens sao escolhidas na
                    criacao e concedem PP que podem ser usados normalmente,
                    respeitando os limites abaixo.
                  </p>
                  <p>
                    <strong>Limites:</strong> maximo absoluto de
                    {` +${DESVANTAGENS_MAX_PP} PP`}, ate
                    {` ${DESVANTAGENS_MAX_SEVERAS} Severas`} e
                    {` ${DESVANTAGENS_MAX_LEVES} Leves`}. Nao ha minimo
                    obrigatorio.
                  </p>
                  <div className="desvantagens-intro-columns">
                    <div className="desvantagens-intro-column">
                      <p>
                        <strong>Escala de Impacto:</strong>
                      </p>
                      <ul className="desvantagens-intro-list">
                        <li>
                          <strong>Leve:</strong> impacto ocasional (
                          {" " + "+1 PP"})
                        </li>
                        <li>
                          <strong>Moderada:</strong> impacto frequente (
                          {" " + "+2 PP"})
                        </li>
                        <li>
                          <strong>Severa:</strong> impacto forte e recorrente (
                          {" " + "+4 PP"})
                        </li>
                      </ul>
                    </div>
                    <div className="desvantagens-intro-column">
                      <p>
                        <strong>Combinacoes equilibradas (ate +10 PP):</strong>
                      </p>
                      <ul className="desvantagens-intro-list">
                        <li>1 Severa + 3 Moderadas</li>
                        <li>1 Severa + 2 Moderadas + 2 Leves</li>
                        <li>1 Severa + 1 Moderada + 4 Leves</li>
                        <li>5 Moderadas</li>
                        <li>3 Moderadas + 4 Leves</li>
                        <li>2 Moderadas + 6 Leves</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                  className={`desvantagens-controls ${desvantagemSelecionada?.temGraduacao ? "with-graduacao" : "without-graduacao"}`}
                >
                  <label>
                    Tipo de Desvantagem
                    <select
                      value={desvantagemCategoriaSelecionada}
                      onChange={(event) => {
                        setDesvantagemCategoriaSelecionada(
                          event.target.value as DesvantagemCategoria | "",
                        );
                        setDesvantagemSelecionadaId("");
                        setDesvantagemGraduacao("1");
                      }}
                    >
                      <option value="">Selecione</option>
                      {DESVANTAGEM_CATEGORIAS.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Desvantagem
                    <select
                      className="desvantagem-select"
                      value={desvantagemSelecionadaId}
                      onChange={(event) => {
                        setDesvantagemSelecionadaId(event.target.value);
                        setDesvantagemGraduacao("1");
                      }}
                      disabled={!desvantagemCategoriaSelecionada}
                    >
                      <option value="">Selecione</option>
                      {desvantagensDisponiveis.map((desvantagem) => (
                        <option key={desvantagem.id} value={desvantagem.id}>
                          {`${formatDesvantagemBonus(desvantagem.ppPorGraduacao, desvantagem.temGraduacao)} ${desvantagem.nome} (${desvantagem.nivel}) - ${desvantagem.resumo}`}
                        </option>
                      ))}
                    </select>
                  </label>
                  {desvantagemSelecionada?.temGraduacao ? (
                    <label>
                      Graduacao
                      <NumericStepperInput
                        min={1}
                        value={desvantagemGraduacao}
                        ariaLabel="Graduacao de desvantagem"
                        onChange={setDesvantagemGraduacao}
                      />
                    </label>
                  ) : null}
                  <button
                    type="button"
                    className="add-desvantagem"
                    onClick={addDesvantagem}
                    disabled={!desvantagemSelecionada}
                  >
                    Adicionar desvantagem
                  </button>
                </div>

                <p className="rule-note desvantagens-limits">
                  {`Limites: +${DESVANTAGENS_MAX_PP} PP maximo | ${DESVANTAGENS_MAX_SEVERAS} Severas maximo | ${DESVANTAGENS_MAX_LEVES} Leves maximo.`}
                </p>

                {desvantagemSelecionada ? (
                  <p className="rule-note desvantagem-preview">
                    {`${formatDesvantagemBonus(desvantagemSelecionada.ppPorGraduacao, desvantagemSelecionada.temGraduacao)} ${desvantagemSelecionada.nome} (${desvantagemSelecionada.nivel}) - ${desvantagemSelecionada.resumo}`}
                    {` ${desvantagemSelecionada.efeito}`}
                  </p>
                ) : null}

                <div className="desvantagens-list">
                  {selectedCharacter.desvantagens.length === 0 ? (
                    <p className="empty-desvantagens">
                      Nenhuma desvantagem adicionada.
                    </p>
                  ) : (
                    selectedCharacter.desvantagens.map((desvantagem) => {
                      const catalogo = DESVANTAGEM_BY_ID.get(
                        desvantagem.catalogId,
                      );
                      const ppPorGraduacao =
                        catalogo?.ppPorGraduacao ??
                        desvantagem.ppPorGraduacao ??
                        0;

                      return (
                        <div className="desvantagem-item" key={desvantagem.id}>
                          <div>
                            <strong>{desvantagem.nome}</strong>
                            <span>
                              {desvantagem.categoria}
                              {` | ${desvantagem.nivel}`}
                              {desvantagem.temGraduacao
                                ? ` | Graduacao ${desvantagem.graduacao}`
                                : ""}
                              {` | +${desvantagem.graduacao * ppPorGraduacao} PP`}
                            </span>
                            <p>{desvantagem.efeito}</p>
                          </div>
                          <button
                            type="button"
                            className="trash-button"
                            onClick={() => removeDesvantagem(desvantagem.id)}
                            aria-label={`Remover ${desvantagem.nome}`}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9z" />
                            </svg>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            ) : null}

            {activeEditorTab === "equipamentos" ? (
              <section className="block equipamentos-panel equipamentos-wide">
                <h3>Equipamentos</h3>
                <div className="equipamentos-intro">
                  <p>
                    Equipamentos sao recursos externos que ampliam
                    possibilidades de acao. Eles nao definem o nivel de poder do
                    personagem, apenas como esse poder e aplicado em situacoes
                    especificas.
                  </p>
                  <p>
                    <strong>Uso na campanha:</strong> opcional, com relevancia
                    definida pelo mestre. Campanhas focadas em Eter podem
                    reduzir equipamentos; campanhas taticas podem torna-los
                    centrais; campanhas narrativas podem trata-los como recurso
                    pontual.
                  </p>
                  <p>
                    <strong>Autoridade do mestre:</strong> decide existencia,
                    disponibilidade, acesso inicial, concessao/restricao e
                    ajustes de equilibrio.
                  </p>
                </div>

                <div className="equipamentos-grid">
                  <article className="equip-card">
                    <h4>Aquisicao</h4>
                    <ul>
                      <li>Escolha inicial (se permitida).</li>
                      <li>Aquisicao narrativa (conquistas e descobertas).</li>
                      <li>Recompensa por eventos e progressao.</li>
                    </ul>
                  </article>
                  <article className="equip-card">
                    <h4>Escolha Inicial</h4>
                    <ul>
                      <li>{`Ate ${EQUIPAMENTOS_LIMITE_INICIAL.armas} armas (Comum).`}</li>
                      <li>{`Ate ${EQUIPAMENTOS_LIMITE_INICIAL.protecoes} protecoes (Comum).`}</li>
                      <li>{`Ate ${EQUIPAMENTOS_LIMITE_INICIAL.utilitarios} utilitarios (Comum).`}</li>
                      <li>Itens devem respeitar cenario, conceito e tom.</li>
                    </ul>
                  </article>
                  <article className="equip-card">
                    <h4>Nivel de Acesso</h4>
                    <ul>
                      {EQUIPAMENTOS_ACESSO_NIVEIS.map((nivel) => (
                        <li key={nivel}>{nivel}</li>
                      ))}
                    </ul>
                  </article>
                </div>

                <div className="equip-regras-wrap">
                  <h4>Regras Gerais</h4>
                  <ul className="equip-regras-list">
                    {EQUIPAMENTOS_REGRAS_GERAIS.map((regra) => (
                      <li key={regra}>{regra}</li>
                    ))}
                  </ul>
                </div>

                <div className="equip-regras-wrap equip-principios-wrap">
                  <h4>Principios do Capitulo</h4>
                  <ul className="equip-regras-list">
                    <li>
                      <strong>Armas:</strong> nao substituem dano base; alteram
                      como o ataque acontece.
                    </li>
                    <li>
                      <strong>Protecoes:</strong> complementam resistencia
                      dentro dos limites do sistema.
                    </li>
                    <li>
                      <strong>Utilitarios:</strong> ampliam possibilidades;
                      valor esta na decisao, nao no poder bruto.
                    </li>
                    <li>
                      <strong>Equilibrio:</strong> equipamentos nao substituem
                      atributos/tecnicas, nao ignoram totalmente defesa ou
                      resistencia, nao escalam acima das mecanicas centrais e
                      nao eliminam decisoes.
                    </li>
                  </ul>
                </div>

                <div className="progression-table-wrap equip-desgaste-wrap">
                  <h4>Desgaste de Equipamentos</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Estado</th>
                        <th>Efeito</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EQUIPAMENTOS_DESGASTE.map((item) => (
                        <tr key={item.estado}>
                          <td>{item.estado}</td>
                          <td>{item.efeitos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="rule-note equip-rule-note">
                    O desgaste e aplicado quando fizer sentido narrativo,
                    especialmente em falhas criticas, impactos intensos, uso
                    excessivo e situacoes de alto risco. Cada nivel de desgaste
                    exige reparo (ferramentas, especialistas, recursos
                    narrativos, tecnicas ou poderes).
                  </p>
                </div>

                <div className="equip-filtros">
                  <label>
                    Era
                    <select
                      value={equipamentosEra}
                      onChange={(event) => {
                        setEquipamentosEra(event.target.value as EquipmentEra);
                        setEquipamentosSubcategoria("");
                      }}
                    >
                      <option value="Medieval">Medieval</option>
                      <option value="Moderno">Moderno</option>
                      <option value="Futurista">Futurista</option>
                    </select>
                  </label>
                  <label>
                    Tipo
                    <select
                      value={equipamentosTipo}
                      onChange={(event) => {
                        setEquipamentosTipo(
                          event.target.value as EquipmentKind,
                        );
                        setEquipamentosSubcategoria("");
                      }}
                    >
                      <option value="Armas">Armas</option>
                      <option value="Protecoes">Protecoes</option>
                      <option value="Utilitarios">Itens Utilitarios</option>
                    </select>
                  </label>
                  <label>
                    Subcategoria
                    <select
                      value={equipamentosSubcategoria}
                      onChange={(event) =>
                        setEquipamentosSubcategoria(event.target.value)
                      }
                    >
                      <option value="">Todas</option>
                      {equipamentosSubcategorias.map((subcategoria) => (
                        <option key={subcategoria} value={subcategoria}>
                          {subcategoria}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {equipamentosTipo === "Armas" ? (
                  <div className="progression-table-wrap equip-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Arma</th>
                          <th>Categoria</th>
                          <th>Tipo</th>
                          <th>Alcance</th>
                          <th>Dano</th>
                          <th>Acerto</th>
                          <th>Efeito</th>
                          <th>Peso</th>
                          <th>Acesso</th>
                          <th>Acoes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(equipamentosFiltrados as EquipmentWeaponEntry[]).map(
                          (item) => {
                            const noLimite = destaqueArmaNoLimite(item);

                            return (
                              <tr
                                key={`${item.subcategoria}-${item.nome}`}
                                className={noLimite ? "equip-row-cap" : ""}
                              >
                                <td>{item.nome}</td>
                                <td>{item.subcategoria}</td>
                                <td>{item.tipo}</td>
                                <td>{item.alcance}</td>
                                <td>{item.dano}</td>
                                <td>{item.acerto}</td>
                                <td>{item.efeito}</td>
                                <td>{item.peso}</td>
                                <td>
                                  <span
                                    className={`equip-acesso-badge ${getAcessoBadgeClass(item.acesso)}`}
                                  >
                                    {item.acesso}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="equip-add-btn"
                                    onClick={() =>
                                      adicionarNotaEquipamento(
                                        `[${equipamentosEra} | Arma] ${item.nome} (${item.subcategoria}) | Alcance ${item.alcance} | Dano ${item.dano} | Acerto ${item.acerto} | Acesso ${item.acesso} | Efeito: ${item.efeito}`,
                                      )
                                    }
                                  >
                                    Adicionar
                                  </button>
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {equipamentosTipo === "Protecoes" ? (
                  <div className="progression-table-wrap equip-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Protecao</th>
                          <th>Categoria</th>
                          <th>Tipo</th>
                          <th>Resistencia</th>
                          <th>Defesa</th>
                          <th>Efeito</th>
                          <th>Penalidade</th>
                          <th>Peso</th>
                          <th>Acesso</th>
                          <th>Acoes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          equipamentosFiltrados as EquipmentProtectionEntry[]
                        ).map((item) => {
                          const noLimite = destaqueProtecaoNoLimite(item);

                          return (
                            <tr
                              key={`${item.subcategoria}-${item.nome}`}
                              className={noLimite ? "equip-row-cap" : ""}
                            >
                              <td>{item.nome}</td>
                              <td>{item.subcategoria}</td>
                              <td>{item.tipo}</td>
                              <td>{item.resistencia}</td>
                              <td>{item.defesa}</td>
                              <td>{item.efeito}</td>
                              <td>{item.penalidade}</td>
                              <td>{item.peso}</td>
                              <td>
                                <span
                                  className={`equip-acesso-badge ${getAcessoBadgeClass(item.acesso)}`}
                                >
                                  {item.acesso}
                                </span>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="equip-add-btn"
                                  onClick={() =>
                                    adicionarNotaEquipamento(
                                      `[${equipamentosEra} | Protecao] ${item.nome} (${item.subcategoria}) | RES ${item.resistencia} | DEF ${item.defesa} | Acesso ${item.acesso} | Efeito: ${item.efeito}`,
                                    )
                                  }
                                >
                                  Adicionar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {equipamentosTipo === "Utilitarios" ? (
                  <div className="progression-table-wrap equip-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Categoria</th>
                          <th>Tipo</th>
                          <th>Efeito</th>
                          <th>Limite</th>
                          <th>Peso</th>
                          <th>Acesso</th>
                          <th>Acoes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(equipamentosFiltrados as EquipmentUtilityEntry[]).map(
                          (item) => {
                            const noLimite = destaqueUtilitarioNoLimite(item);

                            return (
                              <tr
                                key={`${item.subcategoria}-${item.nome}`}
                                className={noLimite ? "equip-row-cap" : ""}
                              >
                                <td>{item.nome}</td>
                                <td>{item.subcategoria}</td>
                                <td>{item.tipo}</td>
                                <td>{item.efeito}</td>
                                <td>{item.limite}</td>
                                <td>{item.peso}</td>
                                <td>
                                  <span
                                    className={`equip-acesso-badge ${getAcessoBadgeClass(item.acesso)}`}
                                  >
                                    {item.acesso}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="equip-add-btn"
                                    onClick={() =>
                                      adicionarNotaEquipamento(
                                        `[${equipamentosEra} | Utilitario] ${item.nome} (${item.subcategoria}) | Tipo ${item.tipo} | Limite ${item.limite} | Acesso ${item.acesso} | Efeito: ${item.efeito}`,
                                      )
                                    }
                                  >
                                    Adicionar
                                  </button>
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                <div className="equip-notes lined-textarea">
                  <h4>Anotacoes da Ficha</h4>
                  <textarea
                    value={selectedCharacter.equipamentos}
                    onChange={(event) =>
                      updateCharacter((current) => ({
                        ...current,
                        equipamentos: event.target.value,
                      }))
                    }
                    placeholder="Armas equipadas, protecoes ativas, itens consumidos, desgaste e reparos..."
                  />
                </div>
              </section>
            ) : null}

            {activeEditorTab === "poderes" ? (
              <section className="block poderes-panel poderes-wide">
                <h3>Poderes</h3>

                <div className="poderes-intro">
                  <p>
                    Poderes sao manifestacoes do Eter, a energia espiritual que
                    permeia o mundo. Cada poder manipula essa energia de forma
                    especifica para atacar, se defender, controlar o ambiente ou
                    aprimorar o corpo. O dominio de Poderes define o estilo de
                    combate e a identidade de cada personagem.
                  </p>

                  <div className="poderes-intro-row">
                    <div className="poderes-intro-col">
                      <p>
                        <strong>Graduacao:</strong> quanto maior, mais forte o
                        efeito. Limite: Nivel + 10. Custo Base × Graduacao.
                      </p>
                      <p>
                        <strong>Consumo de Eter:</strong>
                      </p>
                      <table className="poderes-ether-table">
                        <tbody>
                          <tr>
                            <td>Graduacao</td>
                            <td>1-2</td>
                            <td>3-4</td>
                            <td>5-6</td>
                            <td>7-8</td>
                            <td>9-10</td>
                          </tr>
                          <tr>
                            <td>Eter</td>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="poderes-intro-col">
                      <p>
                        <strong>Os 4 Naipes:</strong>
                      </p>
                      <ul className="poderes-naipes-list">
                        <li>
                          <strong>♠ Espadas (Projecao):</strong> combate direto,
                          fortalecimento corporal.
                        </li>
                        <li>
                          <strong>♦ Ouros (Conjuracao):</strong> criacao,
                          invocacao, suporte.
                        </li>
                        <li>
                          <strong>♥ Copas (Manipulacao):</strong> controle de
                          energia, influencia.
                        </li>
                        <li>
                          <strong>♣ Paus (Alteracao):</strong> mudanca de forma,
                          adaptacao.
                        </li>
                      </ul>
                      <p>
                        <strong>Afinidade:</strong> mesmo (1x) | adjacente (2x)
                        | oposto (3x).
                      </p>
                    </div>
                  </div>

                  <p className="poderes-intro-footer">
                    <strong>Parametros:</strong> Acao (Padrao, Movimento, Livre,
                    Reacao) | Alcance (Pessoal, Toque, Distancia) | Duracao
                    (Instantanea, Sustentada, Permanente) |{" "}
                    <strong>Penetrante:</strong> ignora Resistencia (2 PP por
                    ponto).
                  </p>
                </div>

                <div className="powers-tabs">
                  <button
                    type="button"
                    className={
                      poderesPanelVisivel === "catalogo"
                        ? "active"
                        : catalogoPoderesLiberado
                          ? ""
                          : "locked"
                    }
                    onClick={() => setPoderesPanelAtivo("catalogo")}
                    disabled={!catalogoPoderesLiberado}
                    title={
                      catalogoPoderesLiberado
                        ? ""
                        : "Selecione o Naipe em Identidade para liberar o catalogo"
                    }
                  >
                    Catalogo por naipe
                  </button>
                  <button
                    type="button"
                    className={
                      poderesPanelVisivel === "arsenal" ? "active" : ""
                    }
                    onClick={() => setPoderesPanelAtivo("arsenal")}
                  >
                    Arsenal de poderes
                  </button>
                </div>

                {!catalogoPoderesLiberado ? (
                  <p className="rule-note powers-lock-note">
                    Selecione o Naipe em Identidade para liberar o Catalogo.
                  </p>
                ) : null}

                {poderesPanelVisivel === "catalogo" ? (
                  <>
                    <div className="powers-suit-tabs">
                      {NAIPE_PODERES.map((naipe) => {
                        const naipeOption = NAIPE_IDENTITY_OPTIONS.find(
                          (option) => option.value === naipe,
                        );
                        return (
                          <button
                            type="button"
                            key={naipe}
                            className={
                              naipePoderSelecionado === naipe ? "active" : ""
                            }
                            onClick={() => {
                              setNaipePoderSelecionado(naipe);
                              setCatalogoSearch("");
                              setCatalogoFiltroAcao("");
                              setCatalogoFiltroDuracao("");
                              setCatalogoFiltroTipo("");
                            }}
                          >
                            {naipeOption && (
                              <span
                                className="powers-suit-icon"
                                aria-hidden="true"
                              >
                                {naipeOption.icon}
                              </span>
                            )}
                            <span>{naipe}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="catalog-search-bar">
                      <input
                        type="search"
                        placeholder="Buscar por nome..."
                        value={catalogoSearch}
                        onChange={(e) => setCatalogoSearch(e.target.value)}
                        className="catalog-search-input"
                      />
                      <select
                        value={catalogoFiltroAcao}
                        onChange={(e) => setCatalogoFiltroAcao(e.target.value)}
                        className="catalog-filter-select"
                      >
                        <option value="">Acao: todas</option>
                        {(
                          [
                            "Padrao",
                            "Movimento",
                            "Livre",
                            "Reacao",
                            "Nenhuma",
                          ] as const
                        ).map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      <select
                        value={catalogoFiltroDuracao}
                        onChange={(e) =>
                          setCatalogoFiltroDuracao(e.target.value)
                        }
                        className="catalog-filter-select"
                      >
                        <option value="">Duracao: todas</option>
                        {(
                          [
                            "Instantanea",
                            "Sustentado",
                            "Continuo",
                            "Temporaria",
                            "Permanente",
                            "Variavel",
                          ] as const
                        ).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <select
                        value={catalogoFiltroTipo}
                        onChange={(e) => setCatalogoFiltroTipo(e.target.value)}
                        className="catalog-filter-select"
                      >
                        <option value="">Tipo: todos</option>
                        {tiposNoCatalogo.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      {catalogoSearch ||
                      catalogoFiltroAcao ||
                      catalogoFiltroDuracao ||
                      catalogoFiltroTipo ? (
                        <button
                          type="button"
                          className="catalog-clear-btn"
                          onClick={() => {
                            setCatalogoSearch("");
                            setCatalogoFiltroAcao("");
                            setCatalogoFiltroDuracao("");
                            setCatalogoFiltroTipo("");
                          }}
                        >
                          Limpar
                        </button>
                      ) : null}
                    </div>

                    {poderesCatalogoFiltrado.length === 0 ? (
                      <p className="catalog-empty-note">
                        Nenhum poder encontrado com esses filtros.
                      </p>
                    ) : null}

                    <div className="power-catalog-grid">
                      {poderesCatalogoFiltrado.map((power) => {
                        const jaNoArsenal = selectedCharacter.poderes.some(
                          (item) => item.powerId === power.id,
                        );
                        const multiplicadorNaipe = getPowerNaipeMultiplier(
                          selectedCharacter.naipe,
                          power.naipe,
                        );
                        const tierClasse =
                          multiplicadorNaipe === 1
                            ? "normal"
                            : multiplicadorNaipe === 2
                              ? "adjacente"
                              : "oposto";
                        const tierLabel =
                          multiplicadorNaipe === 1
                            ? "Custo normal"
                            : multiplicadorNaipe === 2
                              ? "Custo x2"
                              : "Custo x3";

                        return (
                          <div
                            className={`power-catalog-card power-cost-${tierClasse}`}
                            key={power.id}
                          >
                            <div className="power-card-header">
                              <h4>{power.nome}</h4>
                              <span
                                className={`power-tier-badge ${tierClasse}`}
                              >
                                {tierLabel}
                              </span>
                            </div>
                            <div className="power-card-meta">
                              <span>{power.tipo}</span>
                              <span>{power.acao}</span>
                              <span>{power.alcance}</span>
                              <span>{power.duracao}</span>
                            </div>
                            <div className="power-card-costs">
                              <span>PP: {power.custoPontosTexto}</span>
                              <span>Eter: {power.custoEterBase}</span>
                              {multiplicadorNaipe > 1 ? (
                                <span
                                  className={`power-tier-badge ${tierClasse}`}
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  x{multiplicadorNaipe}
                                </span>
                              ) : null}
                            </div>
                            {power.resumo ? (
                              <p className="power-card-resumo">
                                {power.resumo}
                              </p>
                            ) : null}
                            {power.efeitoPrincipal ? (
                              <p className="power-card-efeito">
                                {power.efeitoPrincipal}
                              </p>
                            ) : null}
                            <div className="power-card-actions">
                              <button
                                type="button"
                                className="power-detail-button"
                                onClick={() => setDetalhesPoderId(power.id)}
                              >
                                Detalhes
                              </button>
                              <button
                                type="button"
                                onClick={() => adicionarPoder(power)}
                                disabled={jaNoArsenal}
                              >
                                {jaNoArsenal
                                  ? "Ja no arsenal"
                                  : "Adicionar ao arsenal"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="powers-arsenal-list">
                    {selectedCharacter.poderes.length === 0 ? (
                      <p className="empty-vantagens">
                        Nenhum poder no arsenal.
                      </p>
                    ) : (
                      selectedCharacter.poderes.map((powerEntry) => {
                        const power = POWER_BY_ID.get(powerEntry.powerId);

                        if (!power) {
                          return null;
                        }

                        const graduacao = clamp(
                          parseNatural(powerEntry.graduacao),
                          1,
                          limiteTecnica,
                        );
                        const custoPoder = getPowerTotalCost(
                          power,
                          graduacao,
                          powerEntry.extrasSelecionados,
                          powerEntry.falhasSelecionadas,
                        );
                        const multiplicadorNaipe = getPowerNaipeMultiplier(
                          selectedCharacter.naipe,
                          power.naipe,
                        );
                        const custoPoderFinal = custoPoder * multiplicadorNaipe;

                        return (
                          <div
                            className="power-arsenal-item"
                            key={powerEntry.id}
                          >
                            <div>
                              <strong>
                                {power.nome} ({power.naipe})
                              </strong>
                              <span>
                                Tipo: {power.tipo} | Duracao: {power.duracao}
                              </span>
                              <span>
                                {custoPoderFinal} PP
                                {multiplicadorNaipe > 1
                                  ? ` (${custoPoder} x ${multiplicadorNaipe})`
                                  : ""}
                              </span>
                            </div>

                            <label>
                              Graduacao
                              <NumericStepperInput
                                min={1}
                                max={limitePoder}
                                value={powerEntry.graduacao}
                                ariaLabel={`Graduacao de ${power.nome}`}
                                onChange={(value) =>
                                  updateCharacter((current) => ({
                                    ...current,
                                    poderes: current.poderes.map((item) =>
                                      item.id === powerEntry.id
                                        ? {
                                            ...item,
                                            graduacao: value,
                                          }
                                        : item,
                                    ),
                                  }))
                                }
                              />
                            </label>

                            {power.extras.length > 0 ? (
                              <div className="power-mod-list">
                                <h5>Extras</h5>
                                {power.extras.map((extra) => (
                                  <label
                                    key={`${powerEntry.id}-extra-${extra.nome}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={powerEntry.extrasSelecionados.includes(
                                        extra.nome,
                                      )}
                                      onChange={(event) =>
                                        updateCharacter((current) => ({
                                          ...current,
                                          poderes: current.poderes.map(
                                            (item) => {
                                              if (item.id !== powerEntry.id) {
                                                return item;
                                              }

                                              const extrasSelecionados = event
                                                .target.checked
                                                ? [
                                                    ...item.extrasSelecionados,
                                                    extra.nome,
                                                  ]
                                                : item.extrasSelecionados.filter(
                                                    (nome) =>
                                                      nome !== extra.nome,
                                                  );

                                              return {
                                                ...item,
                                                extrasSelecionados,
                                              };
                                            },
                                          ),
                                        }))
                                      }
                                    />
                                    <span>
                                      {extra.nome} ({extra.custo})
                                    </span>
                                  </label>
                                ))}
                              </div>
                            ) : null}

                            {power.falhas.length > 0 ? (
                              <div className="power-mod-list">
                                <h5>Falhas</h5>
                                {power.falhas.map((falha) => (
                                  <label
                                    key={`${powerEntry.id}-falha-${falha.nome}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={powerEntry.falhasSelecionadas.includes(
                                        falha.nome,
                                      )}
                                      onChange={(event) =>
                                        updateCharacter((current) => ({
                                          ...current,
                                          poderes: current.poderes.map(
                                            (item) => {
                                              if (item.id !== powerEntry.id) {
                                                return item;
                                              }

                                              const falhasSelecionadas = event
                                                .target.checked
                                                ? [
                                                    ...item.falhasSelecionadas,
                                                    falha.nome,
                                                  ]
                                                : item.falhasSelecionadas.filter(
                                                    (nome) =>
                                                      nome !== falha.nome,
                                                  );

                                              return {
                                                ...item,
                                                falhasSelecionadas,
                                              };
                                            },
                                          ),
                                        }))
                                      }
                                    />
                                    <span>
                                      {falha.nome} ({falha.custo})
                                    </span>
                                  </label>
                                ))}
                              </div>
                            ) : null}

                            <div className="power-item-actions">
                              <button
                                type="button"
                                className="power-detail-button"
                                onClick={() => setDetalhesPoderId(power.id)}
                              >
                                Detalhes
                              </button>
                              <button
                                type="button"
                                className="trash-button"
                                onClick={() => removerPoder(powerEntry.id)}
                                aria-label={`Remover ${power.nome}`}
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <p className="rule-note powers-note">
                      Limite de graduacao por poder: {limitePoder}
                    </p>
                  </div>
                )}
              </section>
            ) : null}

            {activeEditorTab === "poderes" && poderDetalhesSelecionado ? (
              <div
                className="power-modal-backdrop"
                role="presentation"
                onClick={() => setDetalhesPoderId(null)}
              >
                <div
                  className="power-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="power-modal-title"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="power-modal-header">
                    <div>
                      <h3 id="power-modal-title">
                        {poderDetalhesSelecionado.nome}
                      </h3>
                      <p>
                        {poderDetalhesSelecionado.tipo} |{" "}
                        {poderDetalhesSelecionado.acao} |{" "}
                        {poderDetalhesSelecionado.alcance} |{" "}
                        {poderDetalhesSelecionado.duracao}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="power-modal-close"
                      onClick={() => setDetalhesPoderId(null)}
                      aria-label={`Fechar detalhes de ${poderDetalhesSelecionado.nome}`}
                    >
                      Fechar
                    </button>
                  </div>

                  <div className="power-modal-meta">
                    <span>
                      Custo: {poderDetalhesSelecionado.custoPontosTexto}
                    </span>
                    <span>Eter: {poderDetalhesSelecionado.custoEterBase}</span>
                    <span>
                      Efeito:{" "}
                      {poderDetalhesSelecionado.efeitoPrincipal || "Sem resumo"}
                    </span>
                  </div>

                  {poderDetalhesSelecionado.resumo ? (
                    <p className="power-modal-summary">
                      {poderDetalhesSelecionado.resumo}
                    </p>
                  ) : null}

                  {poderDetalhesSelecionado.detalhes?.introducao?.map(
                    (paragrafo) => (
                      <p className="power-modal-paragraph" key={paragrafo}>
                        {paragrafo}
                      </p>
                    ),
                  )}

                  {poderDetalhesSelecionado.detalhes?.tabelas?.map((tabela) => (
                    <section
                      className="power-modal-section"
                      key={tabela.titulo}
                    >
                      <h4>{tabela.titulo}</h4>
                      <div className="power-modal-table-wrap">
                        <table>
                          <thead>
                            <tr>
                              {tabela.colunas.map((coluna) => (
                                <th key={coluna}>{coluna}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tabela.linhas.map((linha) => (
                              <tr key={linha.join("|")}>
                                {linha.map((coluna) => (
                                  <td key={coluna}>{coluna}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  ))}

                  {poderDetalhesSelecionado.detalhes?.secoes?.map((secao) => (
                    <section className="power-modal-section" key={secao.titulo}>
                      <h4>{secao.titulo}</h4>
                      {secao.descricao?.map((paragrafo) => (
                        <p className="power-modal-paragraph" key={paragrafo}>
                          {paragrafo}
                        </p>
                      ))}
                      {secao.itens?.length ? (
                        <ul className="power-modal-list">
                          {secao.itens.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>

      {renderGlobalOverlays()}
    </>
  );
}

export default App;
