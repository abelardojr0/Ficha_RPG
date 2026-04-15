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
  MAX_POWER_GRADUATION_LIMIT,
  PODERES_POR_NAIPE,
  type NaipePoder,
  type PowerDefinition,
} from "./data/powers";
import logoImage from "./assets/logo.png";
import "./App.css";

type Dice = "D4" | "D6" | "D8" | "D10" | "D12";
type CombatDice = "-" | Dice;
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
  imagemUrl?: string;
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
  equipamentos: string;
};

type EditorTabId =
  | "identidade"
  | "base"
  | "pericias"
  | "tecnicas"
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
  imagemUrl?: string;
  imageUrl?: string;
  fotoUrl?: string;
  nivel: string;
  jogador: string;
  updatedAt: string;
};

const getSheetPreviewImageUrl = (sheet: SheetSummary) =>
  sheet.imagemUrl || sheet.imageUrl || sheet.fotoUrl || "";

type PendingConfirmation = {
  title: string;
  message: string;
  confirmLabel: string;
  variant?: "default" | "danger";
  action:
    | { type: "apply-pretipo"; pretipoId: string }
    | { type: "delete-character"; characterId: string };
};

const TOTAL_PP = 180;
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "https://ficha-rpg-server.onrender.com/api"
).replace(/\/$/, "");
const HOME_ROUTE = "/";
const CREATE_SHEET_ROUTE = "/criar-ficha";
const SHEET_PASSWORD_MIN_LENGTH = 4;

const getScreenFromPathname = (pathname: string): "home" | "editor" =>
  pathname === CREATE_SHEET_ROUTE ? "editor" : "home";

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
  "Controle de Eter",
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
const DESVANTAGENS_MAX_SEVERAS = 1;
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
    custoPorGraduacao: 3,
    resumo: "-3 no ataque para +3 no dano.",
    efeito: "Sofre -3 no ataque para receber +3 no dano.",
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
    resumo: "+1 no alcance critico por graduacao.",
    efeito: "Aumenta alcance critico em +1 por graduacao.",
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
    custoPorGraduacao: 3,
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
    resumo: "A acao Mirar concede +3 no ataque.",
    efeito: "A acao Mirar concede +3 no ataque.",
  },
  {
    id: "defesa-aprimorada",
    nome: "Defesa Aprimorada",
    categoria: "Combate",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "A acao Defender concede +3 em Defesa.",
    efeito: "A acao Defender concede +3 em Defesa.",
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
    resumo: "+1 no dano com armas arremessadas por graduacao.",
    efeito: "+1 dano com armas arremessadas por graduacao.",
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
    custoPorGraduacao: 4,
    resumo: "Redireciona ataque que falhe por 5+ (1 vez por turno).",
    efeito: "Redireciona ataque que falhe por 5 ou mais (1 vez por turno).",
  },
  {
    id: "adaptado",
    nome: "Adaptado",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Permite usar uma pericia com atributo diferente em casos justificados.",
    efeito:
      "Permite usar uma pericia com atributo diferente em situacoes justificadas.",
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
    custoPorGraduacao: 3,
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
    custoPorGraduacao: 2,
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
    id: "zombar",
    nome: "Zombar",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Enganacao causa -2 em testes do alvo ate o fim do proximo turno.",
    efeito:
      "Permite causar -2 em testes de um alvo com Enganacao (nao acumula).",
  },
  {
    id: "tontear",
    nome: "Tontear",
    categoria: "Pericia",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "Intimidacao/Enganacao causa -2 em testes do alvo (1 vez por cena).",
    efeito:
      "Permite causar -2 em testes de um alvo com interacao social (1 vez por cena).",
  },
  {
    id: "sorte",
    nome: "Sorte",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Recebe +1 Pedra de Eter no inicio de cada sessao.",
    efeito: "+1 Pedra de Eter no inicio da sessao.",
  },
  {
    id: "esforco-supremo",
    nome: "Esforco Supremo",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 4,
    resumo:
      "Gasta 1 Pedra de Eter para receber +10 em um teste (1 vez por cena).",
    efeito:
      "Gasta 1 Pedra de Eter para receber +10 em um teste (1 vez por cena).",
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
    id: "sorte-de-principiante",
    nome: "Sorte de Principiante",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Gasta 1 Pedra de Eter para +3 em teste de pericia.",
    efeito: "Gasta 1 Pedra de Eter para receber +3 em um teste de pericia.",
  },
  {
    id: "inspirar",
    nome: "Inspirar",
    categoria: "Sorte",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Gasta 1 Pedra de Eter para conceder +2 em teste de um aliado.",
    efeito: "Gasta 1 Pedra de Eter para conceder +2 em um teste de um aliado.",
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
    resumo: "+3 em testes para lembrar informacoes.",
    efeito: "+3 em testes para lembrar informacoes.",
  },
  {
    id: "destemido",
    nome: "Destemido",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "+3 contra medo e ignora efeitos secundarios leves ao resistir.",
    efeito:
      "+3 em testes contra medo e ignora efeitos secundarios leves ao resistir.",
  },
  {
    id: "duro-de-matar",
    nome: "Duro de Matar",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 4,
    resumo: "Estabiliza automaticamente ao atingir 0 Vida.",
    efeito: "Estabiliza automaticamente ao chegar a 0 Vida.",
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
    nome: "Trabalho em Equipe",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "Concede +2 ao ajudar em testes de equipe.",
    efeito: "Concede +2 ao ajudar em testes de equipe.",
  },
  {
    id: "tolerancia-maior",
    nome: "Tolerancia Maior",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 2,
    resumo: "+2 contra condicoes ambientais adversas.",
    efeito: "+2 em testes contra condicoes ambientais adversas.",
  },
  {
    id: "recuperacao-rapida",
    nome: "Recuperacao Rapida",
    categoria: "Geral",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo: "Recebe +2 adicional sempre que for curado.",
    efeito: "Recebe +2 adicional sempre que for curado.",
  },
  {
    id: "reserva-de-eter",
    nome: "Reserva de Eter",
    categoria: "Eter",
    temGraduacao: true,
    custoPorGraduacao: 3,
    resumo: "+5 no Eter maximo por graduacao.",
    efeito: "+5 Eter maximo por graduacao.",
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
    nome: "Controle Eter",
    categoria: "Eter",
    temGraduacao: false,
    custoPorGraduacao: 3,
    resumo:
      "+2 em testes de Tecnica para sustentar, manter ou estabilizar tecnicas.",
    efeito:
      "+2 em testes de Tecnica para sustentar, manter ou estabilizar tecnicas.",
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
];

const VANTAGEM_BY_ID = new Map(
  VANTAGENS_CATALOGO.map((item) => [item.id, item]),
);

const DESVANTAGENS_CATALOGO: DisadvantageDefinition[] = [
  {
    id: "ataque-comprometido",
    nome: "Ataque Comprometido",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Falha grave em ataque gera penalidade defensiva.",
    efeito: "Errar ataque por 5+ causa -1 em Defesa ate o proximo turno.",
  },
  {
    id: "defesa-instavel",
    nome: "Defesa Instavel",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Sofrer dano relevante reduz Defesa temporariamente.",
    efeito:
      "Ao sofrer dano >= 8 ou critico, recebe -1 em Defesa ate o proximo turno.",
  },
  {
    id: "postura-exposta",
    nome: "Postura Exposta",
    categoria: "Combate",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo: "Perde bonus de Defesa sob pressao.",
    efeito:
      "Sob pressao, perde bonus ativos de Defesa (ate -3) ate o proximo turno.",
  },
  {
    id: "precisao-reduzida",
    nome: "Precisao Reduzida",
    categoria: "Combate",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "-1 em testes de ataque.",
    efeito: "Sofre -1 em todos os testes de ataque.",
  },
  {
    id: "reacao-lenta",
    nome: "Reacao Lenta",
    categoria: "Combate",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 em testes de reacao.",
    efeito: "Sofre -2 em testes de reacao, esquiva e respostas defensivas.",
  },
  {
    id: "colapso-sensivel",
    nome: "Colapso Sensivel",
    categoria: "Eter",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo: "Ao zerar PE, fica Atordoado.",
    efeito: "Ao chegar a 0 PE, fica Atordoado por 1 turno (1 vez por cena).",
  },
  {
    id: "corpo-incompativel",
    nome: "Corpo Incompativel",
    categoria: "Eter",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo: "Penalidade ao usar tecnicas intensas.",
    efeito:
      "Ao usar tecnica com custo >= 4 PE, sofre -1 em Tecnica ate o proximo turno.",
  },
  {
    id: "fluxo-instavel",
    nome: "Fluxo Instavel",
    categoria: "Eter",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Pode consumir PE adicional ao usar tecnicas.",
    efeito:
      "Ao usar tecnica de custo >= 3 PE, pode perder +1 PE adicional em falha.",
  },
  {
    id: "instabilidade-de-eter",
    nome: "Instabilidade de Eter",
    categoria: "Eter",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "-1 em testes de Tecnica sob pressao.",
    efeito: "Sofre -1 em testes de Tecnica em combate e situacoes de estresse.",
  },
  {
    id: "reserva-reduzida",
    nome: "Reserva Reduzida",
    categoria: "Eter",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-5 PE maximo.",
    efeito: "Reduce o Eter maximo em 5 pontos.",
  },
  {
    id: "sobrecarga",
    nome: "Sobrecarga",
    categoria: "Eter",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Tecnicas fortes podem impedir acoes.",
    efeito:
      "Ao usar tecnica de custo >= 5 PE, falha pode remover acao no proximo turno.",
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
    id: "codigo-de-honra",
    nome: "Codigo de Honra",
    categoria: "Comportamental",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Nao pode violar principios sem penalidade.",
    efeito:
      "Violar o codigo causa -2 em testes por 1 cena e bloqueia Vantagens de Sorte.",
  },
  {
    id: "dependente-de-aprovacao",
    nome: "Dependente de Aprovacao",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-1 geral quando isolado.",
    efeito: "Quando isolado ou sem apoio, sofre -1 em todos os testes.",
  },
  {
    id: "excesso-de-confianca",
    nome: "Excesso de Confianca",
    categoria: "Comportamental",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidade em avaliacao de risco.",
    efeito: "Sofre -2 em testes de risco, estrategia ou cautela.",
  },
  {
    id: "impaciente",
    nome: "Impaciente",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "Penalidade em acoes que exigem espera.",
    efeito: "Sofre -2 em testes que exigem preparacao ou espera.",
  },
  {
    id: "ingenuo",
    nome: "Ingenuo",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "Vulneravel a enganacao.",
    efeito: "Sofre -2 em testes para detectar mentira ou manipulacao.",
  },
  {
    id: "provocador",
    nome: "Provocador",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "Atrai hostilidade e dificulta evitar conflitos.",
    efeito: "Sofre -2 em testes para evitar conflito e desescalar situacoes.",
  },
  {
    id: "teimoso",
    nome: "Teimoso",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "Dificuldade em mudar decisoes.",
    efeito: "Sofre -2 em testes para reconsiderar ou adaptar decisoes.",
  },
  {
    id: "temperamental",
    nome: "Temperamental",
    categoria: "Comportamental",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Perde controle sob pressao.",
    efeito:
      "Sob pressao, pode sofrer -1 geral ou acao impulsiva em falha critica.",
  },
  {
    id: "timido",
    nome: "Timido",
    categoria: "Comportamental",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "Penalidade em interacoes sociais ativas.",
    efeito: "Sofre -2 em Persuasao, Lideranca e negociacao ativa.",
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
    resumo: "Severas penalidades visuais e combate a distancia.",
    efeito:
      "Sofre -5 em percepcao visual e inimigos recebem +2 em ataques a distancia.",
  },
  {
    id: "desnutrido",
    nome: "Desnutrido",
    categoria: "Fisica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "-1 em testes fisicos.",
    efeito:
      "Sofre -1 em testes fisicos e pode sofrer penalidade extra apos dano.",
  },
  {
    id: "expressao-transparente",
    nome: "Expressao Transparente",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 em Enganacao.",
    efeito: "Sofre -2 em Enganacao e ocultacao emocional.",
  },
  {
    id: "feio",
    nome: "Feio",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 em Persuasao.",
    efeito: "Sofre -2 em testes de Persuasao.",
  },
  {
    id: "fragil",
    nome: "Fragil",
    categoria: "Fisica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Sofre +1 de dano.",
    efeito: "Sofre +1 de dano de qualquer fonte e -1 em resistencias fisicas.",
  },
  {
    id: "movimento-pesado",
    nome: "Movimento Pesado",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 em furtividade por movimento.",
    efeito: "Sofre -2 em testes de Furtividade baseados em deslocamento.",
  },
  {
    id: "obeso",
    nome: "Obeso",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 Agilidade.",
    efeito: "Sofre -2 em testes de Agilidade e -1 em Defesa por esquiva.",
  },
  {
    id: "presenca-intimidante",
    nome: "Presenca Intimidante",
    categoria: "Fisica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "+Intimidacao / -Persuasao.",
    efeito: "Recebe +1 em Intimidacao e sofre -2 em Persuasao.",
  },
  {
    id: "presenca-marcante",
    nome: "Presenca Marcante",
    categoria: "Fisica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-2 em disfarce e anonimato.",
    efeito: "Sofre -2 em testes de disfarce, anonimato e infiltracao social.",
  },
  {
    id: "ansiedade",
    nome: "Ansiedade",
    categoria: "Psicologica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "Pode sofrer penalidade antes de testes importantes.",
    efeito: "Antes de testes importantes, falha em Vontade causa -1 no teste.",
  },
  {
    id: "autodestrutivo",
    nome: "Autodestrutivo",
    categoria: "Psicologica",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo: "+ataque / -Defesa obrigatorio.",
    efeito:
      "Sob gatilho, recebe +1 ataque e sofre -2 Defesa ate o proximo turno.",
  },
  {
    id: "culpa",
    nome: "Culpa",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidade apos causar dano significativo.",
    efeito:
      "Apos causar dano significativo, sofre -1 em todos os testes no proximo turno.",
  },
  {
    id: "dependencia-emocional",
    nome: "Dependencia Emocional",
    categoria: "Psicologica",
    nivel: "Leve",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Leve,
    resumo: "-1 geral quando isolado.",
    efeito:
      "Quando sem vinculo emocional proximo, sofre -1 em todos os testes.",
  },
  {
    id: "depressao",
    nome: "Depressao",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidade em rodadas com iniciativa baixa.",
    efeito:
      "Com iniciativa baixa, sofre -1 em testes ate o inicio do proximo turno.",
  },
  {
    id: "fobia",
    nome: "Fobia",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "-2 geral sob gatilho + risco de fuga.",
    efeito:
      "Sob gatilho de fobia, sofre -2 geral e pode ser forcado a se afastar.",
  },
  {
    id: "instabilidade-emocional",
    nome: "Instabilidade Emocional",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidades sob pressao.",
    efeito:
      "Sob pressao, pode sofrer -1 geral por 1 turno (ou -2 em falha critica).",
  },
  {
    id: "obsessivo",
    nome: "Obsessivo",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidade fora do foco.",
    efeito:
      "Sofre -2 em testes que nao estejam relacionados ao foco da obsessao.",
  },
  {
    id: "paranoico",
    nome: "Paranoico",
    categoria: "Psicologica",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidade social / resistencia a engano.",
    efeito:
      "Sofre -2 em cooperacao social, mas recebe +2 contra blefes e emboscadas.",
  },
  {
    id: "trauma",
    nome: "Trauma",
    categoria: "Psicologica",
    nivel: "Severa",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Severa,
    resumo: "Pode perder acao ou controle.",
    efeito: "Sob gatilho de trauma, pode ficar Atordoado ou Desorientado.",
  },
  {
    id: "dependencia-fisica",
    nome: "Dependencia Fisica",
    categoria: "Condicao",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidade crescente sem recurso.",
    efeito: "Sem o fator de dependencia, sofre -1 geral cumulativo ate -3.",
  },
  {
    id: "exaustao-progressiva",
    nome: "Exaustao Progressiva",
    categoria: "Condicao",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidade cumulativa ao longo do combate.",
    efeito:
      "A cada 2 turnos intensos, sofre -1 cumulativo em testes fisicos e de Tecnica (max -3).",
  },
  {
    id: "sensibilidade",
    nome: "Sensibilidade",
    categoria: "Condicao",
    nivel: "Moderada",
    temGraduacao: false,
    ppPorGraduacao: DESVANTAGEM_PP_POR_NIVEL.Moderada,
    resumo: "Penalidade sob estimulo especifico.",
    efeito:
      "Sob exposicao ao estimulo, sofre -2 em testes afetados e pode sofrer -1 geral.",
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
    "Controle de Eter": {
      atributo: "Tecnica",
      descricao:
        "Dominio tecnico para manipular Eter com precisao, estabilizar manifestacoes e ajustar intensidade e forma dos efeitos.",
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
      "Comprime o fluxo de Eter no proprio corpo, reduzindo drasticamente sua presenca no ambiente.",
    limitacoes:
      "Nao pode realizar acoes ofensivas enquanto ativa e sofre -1 em Resistencia.",
  },
  {
    nome: "Foco",
    tipo: "Sensorial",
    custoPPPorGraduacao: 2,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 1,
    descricao:
      "Direciona o Eter para os olhos, tornando sua percepcao mais precisa e capaz de detectar Eter.",
    limitacoes: "Sofre -2 em Defesa contra alvos fora do foco atual.",
  },
  {
    nome: "Campo",
    tipo: "Sensorial / Controle",
    custoPPPorGraduacao: 3,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 2,
    descricao:
      "Expande o Eter ao redor do corpo, percebendo qualquer presenca ou fluxo dentro da area.",
    limitacoes:
      "Sofre -2 em Defesa enquanto mantem parte do Eter fora do corpo.",
  },
  {
    nome: "Guarda",
    tipo: "Defesa",
    custoPPPorGraduacao: 4,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 2,
    descricao:
      "Distribui o Eter por todo o corpo para absorver impacto e dissipar dano recebido.",
    limitacoes: "Sofre -2 em Agilidade enquanto a tecnica estiver ativa.",
  },
  {
    nome: "Impulso",
    tipo: "Fortalecimento",
    custoPPPorGraduacao: 4,
    acao: "Livre",
    duracao: "Sustentada",
    basePE: 2,
    descricao:
      "Forca o Eter a circular em alta intensidade, ampliando ataque ou dano com agressividade.",
    limitacoes:
      "Sofre -2 em Defesa e sua aura se torna facilmente perceptivel.",
  },
  {
    nome: "Ruptura",
    tipo: "Defesa / Ataque",
    custoPPPorGraduacao: 3,
    acao: "Reacao ou Padrao",
    duracao: "Instantanea",
    basePE: 3,
    descricao:
      "Concentra todo o Eter em um ponto unico para reduzir dano em reacao ou ampliar dano em um golpe.",
    limitacoes:
      "Apos usar, sofre -2 em testes de Tecnica ate o proximo turno. Cada reacao adicional custa +1 PE.",
  },
];

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
    label: "Tecnicas Basicas",
    descricao:
      "Ajuste graduacoes das tecnicas fundamentais e acompanhe VE, custo de Eter e limitacoes.",
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
      MAX_POWER_GRADUATION_LIMIT,
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

  return "70 m";
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
        efeito: `+${ve} em Furtividade e -${ve} para perceber sua presenca.`,
      };
    case "Foco":
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `+${ve} em Percepcao e detecta presenca de Eter.`,
      };
    case "Campo":
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `+${ve} em Percepcao na area e revela Supressao inferior. Raio: ${getCampoRaio(graduacao)}.`,
      };
    case "Guarda":
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `Reduz em ${ve} o dano do primeiro ataque sofrido no turno.`,
      };
    case "Impulso":
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `+${ve} em Ataque ou +${ve} no Dano, conforme o foco escolhido ao ativar.`,
      };
    case "Ruptura":
      return {
        graduacao,
        ve,
        custoPE,
        efeito: `Como Reacao, reduz dano em ${ve}; como Acao, recebe +${ve} no dano causado.`,
      };
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
      { catalogId: "presenca-intimidante", graduacao: 1 },
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
      "Controle de Eter": "10",
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
      "Controle de Eter": "10",
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
      "Controle de Eter": "10",
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
      "Controle de Eter": "4",
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
    desvantagens: [
      { catalogId: "obeso", graduacao: 1 },
      { catalogId: "movimento-pesado", graduacao: 1 },
    ],
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
      "Controle de Eter": "10",
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
      "Controle de Eter": "6",
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
  equipamentos: "",
});

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
  const parsedValue = parseNatural(value);
  const isAtMin = parsedValue <= min;
  const isAtMax = max !== undefined && parsedValue >= max;

  const handleStep = (direction: -1 | 1) => {
    if (disabled) {
      return;
    }

    const nextValue = clamp(
      parsedValue + direction * step,
      min,
      max ?? Number.MAX_SAFE_INTEGER,
    );

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
        onChange={(event) => onChange(event.target.value)}
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
  const [characters, setCharacters] = useState<CharacterSheet[]>([
    createEmptyCharacter(),
  ]);
  const [selectedId, setSelectedId] = useState<string>(characters[0].id);
  const [screen, setScreen] = useState<"home" | "editor">(() =>
    getScreenFromPathname(window.location.pathname),
  );
  const [savedSheets, setSavedSheets] = useState<SheetSummary[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [isSavingSheet, setIsSavingSheet] = useState(false);
  const [isUnlockingSheet, setIsUnlockingSheet] = useState(false);
  const [isDeletingSheet, setIsDeletingSheet] = useState(false);
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
  const [activeSheetPassword, setActiveSheetPassword] = useState("");
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
  const [pendingConfirmation, setPendingConfirmation] =
    useState<PendingConfirmation | null>(null);
  const [savePasswordModalOpen, setSavePasswordModalOpen] = useState(false);
  const [savePasswordInput, setSavePasswordInput] = useState("");
  const [savePasswordConfirmInput, setSavePasswordConfirmInput] = useState("");
  const [savePasswordError, setSavePasswordError] = useState("");
  const [vantagemCategoriaSelecionada, setVantagemCategoriaSelecionada] =
    useState<VantagemCategoria | "">("");
  const [vantagemSelecionadaId, setVantagemSelecionadaId] = useState("");
  const [vantagemGraduacao, setVantagemGraduacao] = useState("1");
  const [desvantagemCategoriaSelecionada, setDesvantagemCategoriaSelecionada] =
    useState<DesvantagemCategoria | "">("");
  const [desvantagemSelecionadaId, setDesvantagemSelecionadaId] = useState("");
  const [desvantagemGraduacao, setDesvantagemGraduacao] = useState("1");
  const [poderesPanelAtivo, setPoderesPanelAtivo] = useState<
    "catalogo" | "arsenal"
  >("arsenal");
  const [activeEditorTab, setActiveEditorTab] =
    useState<EditorTabId>("identidade");
  const [naipePoderSelecionado, setNaipePoderSelecionado] =
    useState<NaipePoder>("Espadas");
  const [detalhesPoderId, setDetalhesPoderId] = useState<string | null>(null);
  const [pretipoSelecionado, setPretipoSelecionado] = useState("");
  const [catalogoSearch, setCatalogoSearch] = useState("");
  const [catalogoFiltroAcao, setCatalogoFiltroAcao] = useState("");
  const [catalogoFiltroDuracao, setCatalogoFiltroDuracao] = useState("");
  const [catalogoFiltroTipo, setCatalogoFiltroTipo] = useState("");

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === selectedId),
    [characters, selectedId],
  );

  const navigateToScreen = (nextScreen: "home" | "editor") => {
    const nextPath = nextScreen === "editor" ? CREATE_SHEET_ROUTE : HOME_ROUTE;

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

        return {
          ...sheet,
          imagemUrl,
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

  useEffect(() => {
    void fetchSheetList();
  }, []);

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

  const createNewSheet = () => {
    const next = createEmptyCharacter();
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
    setPendingConfirmation(null);
    setSavePasswordModalOpen(false);
    setSavePasswordInput("");
    setSavePasswordConfirmInput("");
    setSavePasswordError("");
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

      setCharacters([payload.character]);
      setSelectedId(payload.character.id);
      setActiveSheetId(unlockSheetTarget.id);
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

      if (activeSheetId === deleteSheetTarget.id) {
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

  const closeConfirmationModal = () => {
    setPendingConfirmation(null);
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
            <h3 id="save-sheet-password-title">Salvar nova ficha</h3>
            <p>
              Crie uma senha para proteger esta ficha no banco. Ela sera pedida
              para abrir a ficha depois.
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
                  {isSavingSheet ? "Salvando..." : "Salvar ficha"}
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

                  closeConfirmationModal();
                }}
              >
                {pendingConfirmation.confirmLabel}
              </button>
            </div>
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

    if (password.trim().length < SHEET_PASSWORD_MIN_LENGTH) {
      toast.error(
        `Senha invalida. Use no minimo ${SHEET_PASSWORD_MIN_LENGTH} caracteres.`,
      );
      return;
    }

    setIsSavingSheet(true);
    setApiError(null);

    try {
      const isCreating = activeSheetId === null;
      const endpoint = isCreating
        ? `${API_BASE_URL}/sheets`
        : `${API_BASE_URL}/sheets/${activeSheetId}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          character: selectedCharacter,
        }),
      });

      const payload = (await response.json()) as {
        id?: string;
        message?: string;
      };

      if (!response.ok) {
        toast.error(payload.message ?? "Falha ao salvar a ficha.");
        return;
      }

      const persistedId = isCreating
        ? (payload.id ?? activeSheetId)
        : activeSheetId;

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
      }
      toast.success("Ficha salva com sucesso no banco.");
    } catch {
      toast.error("Erro de conexao ao salvar a ficha.");
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

  const saveSelectedCharacter = async () => {
    if (!selectedCharacter) {
      return;
    }

    if (activeSheetId === null) {
      setSavePasswordError("");
      setSavePasswordModalOpen(true);
      return;
    }

    await persistSelectedCharacter(activeSheetPassword);
  };

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
                onClick={createNewSheet}
              >
                <GiScrollQuill size={16} aria-hidden="true" />
                Criar ficha
              </button>
            </div>
          </header>

          <section className="home-list block home-list-panel">
            <h2>Fichas criadas ({savedSheets.length})</h2>
            {isLoadingSheets ? <p>Carregando fichas...</p> : null}
            {apiError ? <p className="danger-value">{apiError}</p> : null}
            {!isLoadingSheets && savedSheets.length === 0 ? (
              <p className="home-empty-state">
                Nenhuma ficha cadastrada ainda.
              </p>
            ) : null}

            <div className="home-card-grid">
              {savedSheets.map((sheet) => {
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
                          src={previewImageUrl}
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
    const newCharacter = createEmptyCharacter();
    setCharacters((current) => [...current, newCharacter]);
    setSelectedId(newCharacter.id);
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
    if (characters.length <= 1) {
      toast.warn("Mantenha pelo menos um personagem na lista.");
      return;
    }

    const targetCharacter = characters.find(
      (character) => character.id === characterId,
    );
    if (!targetCharacter) {
      return;
    }

    setPendingConfirmation({
      title: "Excluir personagem local",
      message: `Excluir ${targetCharacter.nome || "personagem sem nome"}? Essa acao remove apenas a copia local atual.`,
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
    };

    setCharacters((current) => [...current, cloned]);
    setSelectedId(cloned.id);
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
        toast.error("Limite atingido: maximo 1 desvantagem Severa.");
        return current;
      }

      const levesAtuais = current.desvantagens.filter(
        (item) => item.nivel === "Leve",
      ).length;
      if (
        desvantagemSelecionada.nivel === "Leve" &&
        levesAtuais >= DESVANTAGENS_MAX_LEVES
      ) {
        toast.error("Limite atingido: maximo 6 desvantagens Leves.");
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

  const nivel = parseNatural(selectedCharacter.nivel);
  const limitePericia = nivel + 10;
  const limiteDefesaTotal = nivel + 18;
  const limiteResistenciaTotal = nivel + 6;

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
      graduacao: getPowerGraduacaoForResistenciaFonte(selectedCharacter, fonte),
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
      limitePericia,
    );

    return total + graduacao * tecnica.custoPPPorGraduacao;
  }, 0);

  const poderesSpent = selectedCharacter.poderes.reduce((total, powerEntry) => {
    const power = POWER_BY_ID.get(powerEntry.powerId);
    if (!power) {
      return total;
    }

    const graduacao = clamp(
      parseNatural(powerEntry.graduacao),
      1,
      MAX_POWER_GRADUATION_LIMIT,
    );
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
          <p className="sheet-brand-subtitle">Monte sua ficha</p>

          <div className="character-primary-actions">
            <button type="button" onClick={() => void saveSelectedCharacter()}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 3h11l3 3v15H5zm2 2v5h8V5zm0 14h10v-7H7z" />
              </svg>
              {isSavingSheet ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={addCharacter}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
              </svg>
              Nova
            </button>
          </div>
          {apiError ? <p className="danger-value">{apiError}</p> : null}

          <ul className="character-local-list">
            {characters.map((character) => (
              <li key={character.id} className="character-local-item">
                <button
                  type="button"
                  className={`character-local-select ${character.id === selectedId ? "active" : ""}`}
                  onClick={() => setSelectedId(character.id)}
                >
                  <strong>{character.nome || "Sem nome"}</strong>
                </button>
                <div className="character-local-tools">
                  <button
                    type="button"
                    className="character-icon-button"
                    aria-label={`Duplicar ${character.nome || "personagem"}`}
                    title={`Duplicar ${character.nome || "personagem"}`}
                    onClick={() => duplicateCharacterById(character.id)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
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
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M7 7h10l-1 13H8zm3-3h4l1 2h4v2H5V6h4z" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

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
                      {selectedCharacter.imagemUrl ? (
                        <img
                          className="identity-portrait"
                          src={selectedCharacter.imagemUrl}
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
                          onChange={(event) =>
                            updateCharacter((current) => ({
                              ...current,
                              imagemUrl: event.target.value,
                            }))
                          }
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
                              }))
                            }
                            disabled={!selectedCharacter.imagemUrl}
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
                    Pericias e Conhecimentos usam o mesmo custo: total de
                    graduacoes dividido por 2 (0,5 PP por graduacao).
                  </p>
                  <p>
                    Limite por pericia/conhecimento: Nivel + 10 (atual:{" "}
                    {limitePericia}). Total: {periciasPontosTotal} graduacoes ={" "}
                    {periciasSpent} PP ({periciasPontos} em Pericias e{" "}
                    {conhecimentosPontos} em Conhecimentos).
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
                  <h3>Tecnicas Basicas</h3>
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
                            limitePericia,
                          );

                          return (
                            <>
                              <div className="manip-stats-grid">
                                <label className="manip-input-field">
                                  <span>Graduacao</span>
                                  <NumericStepperInput
                                    min={0}
                                    max={limitePericia}
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
                                    {derived.ve}
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
                    Limite de graduacao: Nivel + 10 = {limitePericia}. VE usa
                    rendimento decrescente a partir da graduacao 6. Tecnicas
                    sustentadas consomem PE por turno, tecnicas instantaneas por
                    uso, e apenas 1 tecnica sustentada pode ficar ativa por vez.
                  </p>
                </article>
              </section>
            ) : null}

            {activeEditorTab === "vantagens" ? (
              <section className="block vantagens-panel vantagens-wide">
                <h3>Vantagens</h3>
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
                  {`Limites: +${DESVANTAGENS_MAX_PP} PP maximo | 1 Severa maximo | 6 Leves maximo.`}
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
              <section className="block lined-textarea equipamentos-wide">
                <h3>Equipamentos</h3>
                <textarea
                  value={selectedCharacter.equipamentos}
                  onChange={(event) =>
                    updateCharacter((current) => ({
                      ...current,
                      equipamentos: event.target.value,
                    }))
                  }
                />
              </section>
            ) : null}

            {activeEditorTab === "poderes" ? (
              <section className="block poderes-panel poderes-wide">
                <h3>Poderes</h3>

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
                          limitePericia,
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
                                max={MAX_POWER_GRADUATION_LIMIT}
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
                      Limite de graduacao por poder:{" "}
                      {MAX_POWER_GRADUATION_LIMIT - 1}
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
