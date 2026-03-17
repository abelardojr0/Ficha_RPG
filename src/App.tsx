import { useMemo, useState } from "react";
import {
  MAX_POWER_GRADUATION_LIMIT,
  MAX_POWER_GRADUATION_RULE,
  PODERES_POR_NAIPE,
  type NaipePoder,
  type PowerDefinition,
} from "./data/powers";
import "./App.css";

type Dice = "D4" | "D6" | "D8" | "D10" | "D12";
type CombatDice = "-" | Dice;
type Naipe = "Espadas" | "Ouros" | "Paus" | "Copas" | "";
type VantagemCategoria = "Combate" | "Pericia" | "Sorte" | "Geral" | "Eter";

type CharacterAdvantage = {
  id: string;
  catalogId: string;
  nome: string;
  categoria: VantagemCategoria;
  graduacao: number;
  temGraduacao: boolean;
  efeito: string;
};

type CharacterPower = {
  id: string;
  powerId: string;
  graduacao: string;
  extrasSelecionados: string[];
  falhasSelecionadas: string[];
};

type CharacterSheet = {
  id: string;
  nome: string;
  nivel: string;
  jogador: string;
  xp: string;
  conceito: string;
  naipe: Naipe;
  carga: string;
  mov: string;
  atributos: Record<string, Dice>;
  combate: {
    ataqueCac: CombatDice;
    disparo: CombatDice;
    resistenciaComprada: string;
    resistenciaPoderes: string;
    defesa: string;
  };
  pericias: Record<string, string>;
  conhecimentos: Array<{
    area: string;
    graduacoes: string;
  }>;
  manipulacoes: Record<
    string,
    {
      graduacao: string;
      custo: string;
    }
  >;
  vantagens: CharacterAdvantage[];
  poderes: CharacterPower[];
  equipamentos: string;
};

const TOTAL_PP = 160;

const ATRIBUTOS = [
  "Forca",
  "Agilidade",
  "Tecnica",
  "Intelecto",
  "Presenca",
  "Percepcao",
  "Constituicao",
] as const;

const PERICIAS = [
  "Acrobacia",
  "Atletismo",
  "Entendimento do Eter",
  "Furtividade",
  "Intimidacao",
  "Intuicao",
  "Investigacao",
  "Medicina",
  "Percepcao",
  "Persuasao",
  "Sobrevivencia",
  "Tecnologia",
] as const;

const VANTAGEM_CATEGORIAS: VantagemCategoria[] = [
  "Combate",
  "Pericia",
  "Sorte",
  "Geral",
  "Eter",
];

const VANTAGENS_CATALOGO = [
  {
    id: "acao-em-movimento",
    nome: "Acao em Movimento",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Permite mover-se antes e depois da acao principal.",
  },
  {
    id: "ataque-poderoso",
    nome: "Ataque Poderoso",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Troca ate -5 no ataque por +5 no dano.",
  },
  {
    id: "ataque-defensivo",
    nome: "Ataque Defensivo",
    categoria: "Combate",
    temGraduacao: false,
    efeito:
      "Troca ate -5 no ataque por +5 em Defesa contra o proximo ataque recebido.",
  },
  {
    id: "ataque-imprudente",
    nome: "Ataque Imprudente",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Troca ate -5 em Defesa por +5 no ataque.",
  },
  {
    id: "critico-aprimorado",
    nome: "Critico Aprimorado",
    categoria: "Combate",
    temGraduacao: true,
    efeito: "Aumenta alcance critico em +1 por graduacao.",
  },
  {
    id: "saque-rapido",
    nome: "Saque Rapido",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Sacar armas passa a ser acao livre.",
  },
  {
    id: "iniciativa-aprimorada",
    nome: "Iniciativa Aprimorada",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Compra duas cartas de iniciativa e escolhe uma.",
  },
  {
    id: "esquiva-instintiva",
    nome: "Esquiva Instintiva",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Nao fica vulneravel quando surpreendido.",
  },
  {
    id: "ataque-domino",
    nome: "Ataque Domino",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Apos derrotar um inimigo, pode atacar outro adjacente.",
  },
  {
    id: "mira-aprimorada",
    nome: "Mira Aprimorada",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Dobra o bonus obtido ao usar Mirar.",
  },
  {
    id: "defesa-aprimorada",
    nome: "Defesa Aprimorada",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Recebe +4 em Defesa ao usar a acao Defender.",
  },
  {
    id: "luta-no-chao",
    nome: "Luta no Chao",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Nao sofre penalidades por lutar caido.",
  },
  {
    id: "rolamento-defensivo",
    nome: "Rolamento Defensivo",
    categoria: "Combate",
    temGraduacao: true,
    efeito: "+1 Resistencia contra dano por graduacao.",
  },
  {
    id: "ataque-preciso",
    nome: "Ataque Preciso",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Ignora penalidades de cobertura ou camuflagem leve.",
  },
  {
    id: "arma-improvisada",
    nome: "Arma Improvisada",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Permite usar objetos como armas sem penalidade.",
  },
  {
    id: "maestria-em-arremesso",
    nome: "Maestria em Arremesso",
    categoria: "Combate",
    temGraduacao: true,
    efeito: "+1 dano com armas arremessadas por graduacao.",
  },
  {
    id: "prender-arma",
    nome: "Prender Arma",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Permite tentar desarmar inimigo que falhe ataque.",
  },
  {
    id: "quebrar-aprimorado",
    nome: "Quebrar Aprimorado",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Remove penalidade ao tentar quebrar objetos.",
  },
  {
    id: "quebrar-arma",
    nome: "Quebrar Arma",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Permite atacar arma inimiga ao defender.",
  },
  {
    id: "redirecionar",
    nome: "Redirecionar",
    categoria: "Combate",
    temGraduacao: false,
    efeito: "Permite redirecionar ataque inimigo que falhe.",
  },
  {
    id: "maestria-em-pericia",
    nome: "Maestria em Pericia",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Permite testes de rotina mesmo sob pressao.",
  },
  {
    id: "contatos",
    nome: "Contatos",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Rede de contatos que fornece informacoes.",
  },
  {
    id: "bem-informado",
    nome: "Bem Informado",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Pode saber informacoes sobre pessoas ou grupos.",
  },
  {
    id: "rastreador",
    nome: "Rastreador",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Usa Percepcao para seguir rastros.",
  },
  {
    id: "finta-agil",
    nome: "Finta Agil",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Usa Acrobacia para fintar em combate.",
  },
  {
    id: "assustar",
    nome: "Assustar",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Usa Intimidacao para fintar inimigos.",
  },
  {
    id: "faz-tudo",
    nome: "Faz-Tudo",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Permite usar pericias sem treinamento.",
  },
  {
    id: "ferramentas-improvisadas",
    nome: "Ferramentas Improvisadas",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Ignora penalidades por falta de ferramentas.",
  },
  {
    id: "idiomas",
    nome: "Idiomas",
    categoria: "Pericia",
    temGraduacao: true,
    efeito: "Permite falar idiomas adicionais.",
  },
  {
    id: "inventor",
    nome: "Inventor",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Permite criar dispositivos tecnologicos temporarios.",
  },
  {
    id: "empatia-com-animais",
    nome: "Empatia com Animais",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Permite interacao social com animais.",
  },
  {
    id: "zombar",
    nome: "Zombar",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Usa Enganacao para desmoralizar inimigos.",
  },
  {
    id: "tontear",
    nome: "Tontear",
    categoria: "Pericia",
    temGraduacao: false,
    efeito: "Pode atordoar inimigos com interacao.",
  },
  {
    id: "sorte",
    nome: "Sorte",
    categoria: "Sorte",
    temGraduacao: false,
    efeito: "+1 Pedra de Eter no inicio da sessao.",
  },
  {
    id: "esforco-supremo",
    nome: "Esforco Supremo",
    categoria: "Sorte",
    temGraduacao: false,
    efeito: "Gasta Pedra de Eter para tratar teste como 20.",
  },
  {
    id: "tomar-a-iniciativa",
    nome: "Tomar a Iniciativa",
    categoria: "Sorte",
    temGraduacao: false,
    efeito: "Pode trocar carta de iniciativa abaixo de 5.",
  },
  {
    id: "sorte-de-principiante",
    nome: "Sorte de Principiante",
    categoria: "Sorte",
    temGraduacao: false,
    efeito: "Gasta Pedra de Eter para ganhar +5 em uma pericia.",
  },
  {
    id: "inspirar",
    nome: "Inspirar",
    categoria: "Sorte",
    temGraduacao: false,
    efeito: "Gasta Pedra de Eter para conceder bonus a aliados.",
  },
  {
    id: "lideranca",
    nome: "Lideranca",
    categoria: "Sorte",
    temGraduacao: false,
    efeito: "Remove condicao negativa de um aliado.",
  },
  {
    id: "beneficio",
    nome: "Beneficio",
    categoria: "Geral",
    temGraduacao: true,
    efeito: "Concede recurso narrativo ou vantagem social.",
  },
  {
    id: "memoria-eidetica",
    nome: "Memoria Eidetica",
    categoria: "Geral",
    temGraduacao: false,
    efeito: "+5 em testes para lembrar informacoes.",
  },
  {
    id: "destemido",
    nome: "Destemido",
    categoria: "Geral",
    temGraduacao: false,
    efeito: "Imune a efeitos de medo.",
  },
  {
    id: "duro-de-matar",
    nome: "Duro de Matar",
    categoria: "Geral",
    temGraduacao: false,
    efeito: "Estabiliza automaticamente ao chegar a 0 Vida.",
  },
  {
    id: "interpor-se",
    nome: "Interpor-se",
    categoria: "Geral",
    temGraduacao: false,
    efeito: "Pode receber ataque no lugar de aliado.",
  },
  {
    id: "trabalho-em-equipe",
    nome: "Trabalho em Equipe",
    categoria: "Geral",
    temGraduacao: false,
    efeito: "Concede +5 ao ajudar em testes de equipe.",
  },
  {
    id: "tolerancia-maior",
    nome: "Tolerancia Maior",
    categoria: "Geral",
    temGraduacao: false,
    efeito: "+5 contra fadiga, frio, calor e ambientes extremos.",
  },
  {
    id: "reserva-de-eter",
    nome: "Reserva de Eter",
    categoria: "Eter",
    temGraduacao: true,
    efeito: "+5 Eter maximo por graduacao.",
  },
  {
    id: "tecnica-eficiente",
    nome: "Tecnica Eficiente",
    categoria: "Eter",
    temGraduacao: false,
    efeito: "Reduz custo de tecnicas em 1 Eter.",
  },
  {
    id: "controle-eter",
    nome: "Controle Eter",
    categoria: "Eter",
    temGraduacao: false,
    efeito: "+1 em testes de Tecnica.",
  },
  {
    id: "pressao-de-eter",
    nome: "Pressao de Eter",
    categoria: "Eter",
    temGraduacao: false,
    efeito: "Inimigos sofrem penalidade contra suas tecnicas.",
  },
  {
    id: "deteccao-de-eter",
    nome: "Deteccao de Eter",
    categoria: "Eter",
    temGraduacao: false,
    efeito: "+2 para perceber Eter.",
  },
] as const;

const PERICIA_INFO: Record<string, { atributo: string; uso: string }> = {
  Acrobacia: {
    atributo: "Agilidade",
    uso: "Saltos, equilibrio, manobras fisicas e movimentos evasivos.",
  },
  Atletismo: {
    atributo: "Forca",
    uso: "Escalar, nadar, correr e realizar feitos fisicos intensos.",
  },
  Furtividade: {
    atributo: "Agilidade",
    uso: "Esconder-se, mover-se silenciosamente e infiltrar-se em locais.",
  },
  Percepcao: {
    atributo: "Percepcao",
    uso: "Detectar inimigos, notar detalhes e perceber perigos.",
  },
  Investigacao: {
    atributo: "Intelecto",
    uso: "Analisar pistas, examinar evidencias e resolver misterios.",
  },
  Intuicao: {
    atributo: "Percepcao",
    uso: "Interpretar emocoes, detectar mentiras e perceber intencoes ocultas.",
  },
  Persuasao: {
    atributo: "Presenca",
    uso: "Convencer pessoas, negociar e influenciar atitudes.",
  },
  Intimidacao: {
    atributo: "Presenca",
    uso: "Ameacar, pressionar ou desmoralizar adversarios.",
  },
  Conhecimento: {
    atributo: "Intelecto",
    uso: "Recordar informacoes academicas ou culturais.",
  },
  Tecnologia: {
    atributo: "Intelecto",
    uso: "Operar, reparar ou construir dispositivos tecnologicos.",
  },
  Medicina: {
    atributo: "Intelecto",
    uso: "Diagnosticar ferimentos, tratar doencas e prestar primeiros socorros.",
  },
  Sobrevivencia: {
    atributo: "Percepcao",
    uso: "Rastrear, orientar-se na natureza e sobreviver em ambientes hostis.",
  },
  "Entendimento do Eter": {
    atributo: "Tecnica",
    uso: "Detectar e analisar energia espiritual e tecnicas.",
  },
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

const MANIPULACOES = [
  "Ocultacao de Eter",
  "Percepcao nos Olhos",
  "Expansao Sensorial",
  "Protecao Absoluta",
  "Explosao de Eter",
  "Endurecimento",
] as const;

const MANIPULACAO_PP_POR_GRADUACAO: Record<string, number> = {
  "Ocultacao de Eter": 1,
  "Percepcao nos Olhos": 1,
  "Expansao Sensorial": 1,
  "Protecao Absoluta": 2,
  "Explosao de Eter": 2,
  Endurecimento: 2,
};

const MOD_BONUS_BY_GRADUACAO: Record<number, number> = {
  0: 0,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
  9: 10,
  10: 12,
};

const EXPANSAO_SENSORIAL_METROS_POR_GRADUACAO: Record<number, number> = {
  0: 0,
  1: 5,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 25,
  7: 30,
  8: 40,
  9: 50,
  10: 60,
};

const DICE_OPTIONS: Dice[] = ["D4", "D6", "D8", "D10", "D12"];
const COMBAT_DICE_OPTIONS: CombatDice[] = ["-", ...DICE_OPTIONS];
const NAIPE_OPTIONS: Naipe[] = ["", "Espadas", "Ouros", "Paus", "Copas"];
const NAIPE_PODERES: NaipePoder[] = ["Espadas", "Ouros", "Paus", "Copas"];
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

const BONUS_BY_DICE: Record<Dice, number> = {
  D4: 1,
  D6: 2,
  D8: 3,
  D10: 4,
  D12: 5,
};

const MOVIMENTO_BASE_POR_AGILIDADE: Record<Dice, number> = {
  D4: 6,
  D6: 9,
  D8: 12,
  D10: 15,
  D12: 18,
};

const CARGA_BASE_POR_FORCA: Record<Dice, number> = {
  D4: 50,
  D6: 100,
  D8: 200,
  D10: 400,
  D12: 800,
};

const DEFESA_BASE = 10;
const LIMITE_DEFESA_RESISTENCIA = 22;

const parseNatural = (value: string): number => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
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
  const match = costText.match(/([+-]\d+)/);
  if (!match) {
    return 0;
  }

  const base = Number.parseInt(match[1], 10);
  if (!Number.isFinite(base)) {
    return 0;
  }

  const normalized = costText.toLowerCase();
  if (normalized.includes("por graduacao")) {
    return base * graduacao;
  }

  return base;
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
  const baseCost =
    power.custoPontosPorGraduacao !== null
      ? power.custoPontosPorGraduacao * graduacao
      : 0;

  const extrasCost = power.extras
    .filter((extra) => extrasSelecionados.includes(extra.nome))
    .reduce(
      (total, extra) => total + parsePowerModifierCost(extra.custo, graduacao),
      0,
    );

  const falhasCost = power.falhas
    .filter((falha) => falhasSelecionadas.includes(falha.nome))
    .reduce(
      (total, falha) => total + parsePowerModifierCost(falha.custo, graduacao),
      0,
    );

  return Math.max(0, baseCost + extrasCost + falhasCost);
};

const formatSigned = (value: number): string => {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
};

const getManipulacaoDerived = (name: string, graduacaoRaw: string) => {
  const graduacao = clamp(parseNatural(graduacaoRaw), 0, 10);
  const bonusEscalonado = MOD_BONUS_BY_GRADUACAO[graduacao] ?? 0;

  switch (name) {
    case "Ocultacao de Eter":
      return {
        modificador: `Furtividade ${formatSigned(bonusEscalonado)}`,
        custo: "2 por turno",
      };
    case "Percepcao nos Olhos":
      return {
        modificador: `Percepcao de Eter ${formatSigned(bonusEscalonado)}`,
        custo: "1 por turno",
      };
    case "Protecao Absoluta":
      return {
        modificador: `Absorcao de dano +${graduacao}`,
        custo: `${5 + graduacao} por turno`,
      };
    case "Explosao de Eter":
      return {
        modificador: `Dano +${graduacao} / Intimidacao +${graduacao}`,
        custo: `${3 + graduacao} por turno`,
      };
    case "Endurecimento":
      return {
        modificador: `Ataque/Bloqueio +${graduacao}`,
        custo: `${2 + graduacao} por uso`,
      };
    case "Expansao Sensorial":
      const raioMetros =
        EXPANSAO_SENSORIAL_METROS_POR_GRADUACAO[graduacao] ?? 0;
      return {
        modificador: `Raio sensorial: ${raioMetros} m`,
        custo: `${8 + graduacao} por turno`,
      };
    default:
      return {
        modificador: `+${graduacao}`,
        custo: "0",
      };
  }
};

const createEmptyCharacter = (): CharacterSheet => ({
  id: crypto.randomUUID(),
  nome: "",
  nivel: "",
  jogador: "",
  xp: "",
  conceito: "",
  naipe: "",
  carga: "",
  mov: "",
  atributos: Object.fromEntries(
    ATRIBUTOS.map((item) => [item, "D4"]),
  ) as Record<string, Dice>,
  combate: {
    ataqueCac: "-",
    disparo: "-",
    resistenciaComprada: "0",
    resistenciaPoderes: "0",
    defesa: "10",
  },
  pericias: Object.fromEntries(PERICIAS.map((item) => [item, "0"])) as Record<
    string,
    string
  >,
  conhecimentos: [
    { area: "", graduacoes: "0" },
    { area: "", graduacoes: "0" },
    { area: "", graduacoes: "0" },
  ],
  manipulacoes: Object.fromEntries(
    MANIPULACOES.map((item) => [item, { graduacao: "", custo: "" }]),
  ) as Record<string, { graduacao: string; custo: string }>,
  vantagens: [],
  poderes: [],
  equipamentos: "",
});

function App() {
  const [characters, setCharacters] = useState<CharacterSheet[]>([
    createEmptyCharacter(),
  ]);
  const [selectedId, setSelectedId] = useState<string>(characters[0].id);
  const [vantagemCategoriaSelecionada, setVantagemCategoriaSelecionada] =
    useState<VantagemCategoria | "">("");
  const [vantagemSelecionadaId, setVantagemSelecionadaId] = useState("");
  const [vantagemGraduacao, setVantagemGraduacao] = useState("1");
  const [poderesPanelAtivo, setPoderesPanelAtivo] = useState<
    "catalogo" | "arsenal"
  >("arsenal");
  const [naipePoderSelecionado, setNaipePoderSelecionado] =
    useState<NaipePoder>("Espadas");

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === selectedId),
    [characters, selectedId],
  );

  if (!selectedCharacter) {
    return null;
  }

  const updateCharacter = (
    updater: (current: CharacterSheet) => CharacterSheet,
  ) => {
    setCharacters((current) =>
      current.map((character) =>
        character.id === selectedId ? updater(character) : character,
      ),
    );
  };

  const addCharacter = () => {
    const newCharacter = createEmptyCharacter();
    setCharacters((current) => [...current, newCharacter]);
    setSelectedId(newCharacter.id);
  };

  const deleteCharacter = () => {
    if (characters.length <= 1) {
      window.alert("Mantenha pelo menos um personagem na lista.");
      return;
    }

    const confirmed = window.confirm(
      `Excluir ${selectedCharacter.nome || "personagem sem nome"}?`,
    );

    if (!confirmed) {
      return;
    }

    const remaining = characters.filter(
      (character) => character.id !== selectedId,
    );
    setCharacters(remaining);
    setSelectedId(remaining[0].id);
  };

  const duplicateCharacter = () => {
    const cloned: CharacterSheet = {
      ...selectedCharacter,
      id: crypto.randomUUID(),
      nome: selectedCharacter.nome ? `${selectedCharacter.nome} (Copia)` : "",
    };
    setCharacters((current) => [...current, cloned]);
    setSelectedId(cloned.id);
  };

  const vantagensDisponiveis = useMemo(
    () =>
      vantagemCategoriaSelecionada
        ? VANTAGENS_CATALOGO.filter(
            (vantagem) => vantagem.categoria === vantagemCategoriaSelecionada,
          )
        : [],
    [vantagemCategoriaSelecionada],
  );

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
  const limitePericia = nivel + 10;

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
      total + parseNatural(selectedCharacter.pericias[pericia]),
    0,
  );

  const conhecimentosPontos = selectedCharacter.conhecimentos.reduce(
    (total, conhecimento) => total + parseNatural(conhecimento.graduacoes),
    0,
  );

  const periciasPontosTotal = periciasPontos + conhecimentosPontos;

  const periciasSpent = periciasPontosTotal / 4;

  const vantagensSpent = selectedCharacter.vantagens.reduce(
    (total, vantagem) => total + vantagem.graduacao * 3,
    0,
  );

  const bonusConstituicao =
    BONUS_BY_DICE[selectedCharacter.atributos.Constituicao];

  const resistenciaComprada = clamp(
    parseNatural(selectedCharacter.combate.resistenciaComprada),
    0,
    LIMITE_DEFESA_RESISTENCIA,
  );
  const resistenciaPoderes = clamp(
    parseNatural(selectedCharacter.combate.resistenciaPoderes),
    0,
    LIMITE_DEFESA_RESISTENCIA,
  );

  const resistenciaTotal =
    bonusConstituicao + resistenciaComprada + resistenciaPoderes;

  const defesaComprada = clamp(
    parseNatural(selectedCharacter.combate.defesa) - DEFESA_BASE,
    0,
    LIMITE_DEFESA_RESISTENCIA,
  );

  const defesaCompradaEfetiva = clamp(
    defesaComprada,
    0,
    Math.max(0, LIMITE_DEFESA_RESISTENCIA - resistenciaTotal),
  );

  const defesaAtual = DEFESA_BASE + defesaCompradaEfetiva;
  const defesaSpent = defesaCompradaEfetiva * 2;

  const resistenciaCompradaEfetiva = Math.max(
    0,
    Math.min(
      resistenciaComprada,
      LIMITE_DEFESA_RESISTENCIA - defesaCompradaEfetiva - bonusConstituicao,
    ),
  );
  const resistenciaTotalEfetiva =
    bonusConstituicao + resistenciaCompradaEfetiva + resistenciaPoderes;

  const resistenciaCompradaSpent = resistenciaCompradaEfetiva * 2;

  const manipulacoesSpent = MANIPULACOES.reduce((total, manipulacao) => {
    const graduacao = clamp(
      parseNatural(selectedCharacter.manipulacoes[manipulacao].graduacao),
      0,
      10,
    );
    const custoPorGraduacao = MANIPULACAO_PP_POR_GRADUACAO[manipulacao] ?? 0;

    return total + graduacao * custoPorGraduacao;
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
    resistenciaCompradaSpent +
    manipulacoesSpent +
    poderesSpent;

  const ppRestante = TOTAL_PP - totalSpent;
  const poderesCatalogo = PODERES_POR_NAIPE[naipePoderSelecionado];
  const catalogoPoderesLiberado = selectedCharacter.naipe !== "";
  const poderesPanelVisivel = catalogoPoderesLiberado
    ? poderesPanelAtivo
    : "arsenal";

  const bonusTecnica = BONUS_BY_DICE[selectedCharacter.atributos.Tecnica];
  const vidaMaxima = 30 + bonusConstituicao * 5;
  const eterMaximo = 30 + bonusTecnica * 5;
  const danoBase = BONUS_BY_DICE[selectedCharacter.atributos.Forca];
  const movimentoBase =
    MOVIMENTO_BASE_POR_AGILIDADE[selectedCharacter.atributos.Agilidade];
  const cargaBase = CARGA_BASE_POR_FORCA[selectedCharacter.atributos.Forca];
  const movimentoAtual =
    selectedCharacter.mov.trim() === ""
      ? String(movimentoBase)
      : selectedCharacter.mov;
  const cargaAtual =
    selectedCharacter.carga.trim() === ""
      ? String(cargaBase)
      : selectedCharacter.carga;

  return (
    <div className="page">
      <aside className="character-list">
        <h1>Estrelas Ascendentes</h1>
        <p>Criacao de personagem (mockado)</p>

        <div className="character-actions">
          <button type="button" onClick={addCharacter}>
            Novo
          </button>
          <button type="button" onClick={duplicateCharacter}>
            Duplicar
          </button>
          <button type="button" className="danger" onClick={deleteCharacter}>
            Excluir
          </button>
        </div>

        <ul>
          {characters.map((character) => (
            <li key={character.id}>
              <button
                type="button"
                className={character.id === selectedId ? "active" : ""}
                onClick={() => setSelectedId(character.id)}
              >
                <strong>{character.nome || "Sem nome"}</strong>
                <span>Nivel {character.nivel || "-"}</span>
              </button>
            </li>
          ))}
        </ul>

        <section className="block pp-summary sidebar-pp-summary">
          <h3>Pontos de Personagem</h3>
          <div className="pp-header">
            <div>
              <strong>{TOTAL_PP}</strong>
              <span>Total</span>
            </div>
            <div>
              <strong>{totalSpent}</strong>
              <span>Gastos</span>
            </div>
            <div className={ppRestante < 0 ? "danger-value" : ""}>
              <strong>{ppRestante}</strong>
              <span>Restantes</span>
            </div>
          </div>
          <div className="pp-breakdown">
            <p>Atributos: {atributosSpent} PP</p>
            <p>Pericias: {periciasSpent} PP</p>
            <p>Vantagens: {vantagensSpent} PP</p>
            <p>CaC + Disparo: {combateSpent} PP</p>
            <p>Defesa: {defesaSpent} PP</p>
            <p>Resistencia Comprada: {resistenciaCompradaSpent} PP</p>
            <p>Manipulacoes: {manipulacoesSpent} PP</p>
            <p>Poderes: {poderesSpent} PP</p>
          </div>
        </section>
      </aside>

      <main className="sheet-wrapper">
        <section className="sheet-header block">
          <h2>Identidade</h2>
          <div className="grid identity-grid">
            <label>
              Nome
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
              Nivel
              <input
                type="number"
                min={0}
                value={selectedCharacter.nivel}
                onChange={(event) =>
                  updateCharacter((current) => ({
                    ...current,
                    nivel: event.target.value,
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
              XP
              <input
                type="number"
                min={0}
                value={selectedCharacter.xp}
                onChange={(event) =>
                  updateCharacter((current) => ({
                    ...current,
                    xp: event.target.value,
                  }))
                }
              />
            </label>
            <label className="full-width">
              Conceito
              <input
                placeholder="Ex: Espadachim veloz que cria laminas de energia"
                value={selectedCharacter.conceito}
                onChange={(event) =>
                  updateCharacter((current) => ({
                    ...current,
                    conceito: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Naipe
              <select
                value={selectedCharacter.naipe}
                onChange={(event) =>
                  updateCharacter((current) => ({
                    ...current,
                    naipe: event.target.value as Naipe,
                  }))
                }
              >
                {NAIPE_OPTIONS.map((naipe) => (
                  <option key={naipe || "vazio"} value={naipe}>
                    {naipe || "Selecione"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="sheet-columns">
          <div className="stacked">
            <article className="block compact-card">
              <h3>Carga</h3>
              <input
                type="number"
                min={0}
                value={cargaAtual}
                onChange={(event) =>
                  updateCharacter((current) => ({
                    ...current,
                    carga: event.target.value,
                  }))
                }
              />
              <p className="rule-note">
                Base por Forca: {cargaBase} kg (editavel por poderes)
              </p>
            </article>
            <article className="block compact-card">
              <h3>Mov.</h3>
              <input
                type="number"
                min={0}
                value={movimentoAtual}
                onChange={(event) =>
                  updateCharacter((current) => ({
                    ...current,
                    mov: event.target.value,
                  }))
                }
              />
              <p className="rule-note">
                Base por Agilidade: {movimentoBase} m (editavel por poderes)
              </p>
            </article>
          </div>

          <article className="block atributos">
            <h3>Atributos</h3>
            <div className="list-grid">
              {ATRIBUTOS.map((atributo) => (
                <label key={atributo}>
                  <span>{atributo}</span>
                  <select
                    value={selectedCharacter.atributos[atributo]}
                    onChange={(event) =>
                      updateCharacter((current) => {
                        const novosAtributos = {
                          ...current.atributos,
                          [atributo]: event.target.value as Dice,
                        };

                        if (atributo !== "Constituicao") {
                          return {
                            ...current,
                            atributos: novosAtributos,
                          };
                        }

                        const novoBonusConstituicao =
                          BONUS_BY_DICE[novosAtributos.Constituicao];
                        const resistenciaCompradaAtual = parseNatural(
                          current.combate.resistenciaComprada,
                        );
                        const resistenciaPoderesAtual = parseNatural(
                          current.combate.resistenciaPoderes,
                        );
                        const resistenciaTotalAtual =
                          novoBonusConstituicao +
                          resistenciaCompradaAtual +
                          resistenciaPoderesAtual;
                        const maxDefesaCompradaAtual = Math.max(
                          0,
                          LIMITE_DEFESA_RESISTENCIA - resistenciaTotalAtual,
                        );
                        const defesaCompradaAtual = clamp(
                          parseNatural(current.combate.defesa) - DEFESA_BASE,
                          0,
                          LIMITE_DEFESA_RESISTENCIA,
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
                      })
                    }
                  >
                    {DICE_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </article>

          <div className="stacked wider">
            <article className="block">
              <h3>Recursos</h3>
              <div className="resource-grid">
                <label>
                  Vida Max
                  <input value={String(vidaMaxima)} readOnly />
                </label>
                <label>
                  Eter Max
                  <input value={String(eterMaximo)} readOnly />
                </label>
              </div>
            </article>

            <article className="block">
              <h3>Combate</h3>
              <div className="resource-grid combat-grid">
                <label>
                  Ataque CaC
                  <select
                    value={selectedCharacter.combate.ataqueCac}
                    onChange={(event) =>
                      updateCharacter((current) => ({
                        ...current,
                        combate: {
                          ...current.combate,
                          ataqueCac: event.target.value as CombatDice,
                        },
                      }))
                    }
                  >
                    {COMBAT_DICE_OPTIONS.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Disparo
                  <select
                    value={selectedCharacter.combate.disparo}
                    onChange={(event) =>
                      updateCharacter((current) => ({
                        ...current,
                        combate: {
                          ...current.combate,
                          disparo: event.target.value as CombatDice,
                        },
                      }))
                    }
                  >
                    {COMBAT_DICE_OPTIONS.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="defesa-stack">
                  <span>Defesa</span>
                  <div className="defesa-line">
                    <span>Base {DEFESA_BASE} +</span>
                    <input
                      type="number"
                      min={0}
                      max={LIMITE_DEFESA_RESISTENCIA}
                      value={defesaCompradaEfetiva}
                      onChange={(event) =>
                        updateCharacter((current) => {
                          const resistenciaTotalAtual =
                            BONUS_BY_DICE[current.atributos.Constituicao] +
                            parseNatural(current.combate.resistenciaComprada) +
                            parseNatural(current.combate.resistenciaPoderes);

                          const maxDefesaCompradaAtual = clamp(
                            LIMITE_DEFESA_RESISTENCIA - resistenciaTotalAtual,
                            0,
                            LIMITE_DEFESA_RESISTENCIA,
                          );

                          const novaDefesaComprada = clamp(
                            parseNatural(event.target.value),
                            0,
                            maxDefesaCompradaAtual,
                          );

                          return {
                            ...current,
                            combate: {
                              ...current.combate,
                              defesa: String(DEFESA_BASE + novaDefesaComprada),
                            },
                          };
                        })
                      }
                    />
                    <span className="defesa-total">Total: {defesaAtual}</span>
                  </div>
                </div>
                <div className="resistance-stack">
                  <label>
                    Resistencia Base (Constituicao)
                    <input value={String(bonusConstituicao)} disabled />
                  </label>
                  <label>
                    Resistencia Comprada
                    <input
                      type="number"
                      min={0}
                      max={LIMITE_DEFESA_RESISTENCIA}
                      value={resistenciaCompradaEfetiva}
                      onChange={(event) =>
                        updateCharacter((current) => {
                          const bonusBase =
                            BONUS_BY_DICE[current.atributos.Constituicao];
                          const defesaCompradaAtual = clamp(
                            parseNatural(current.combate.defesa) - DEFESA_BASE,
                            0,
                            LIMITE_DEFESA_RESISTENCIA,
                          );
                          const resistenciaPoderesAtual = parseNatural(
                            current.combate.resistenciaPoderes,
                          );
                          const maxComprada = Math.max(
                            0,
                            LIMITE_DEFESA_RESISTENCIA -
                              defesaCompradaAtual -
                              bonusBase -
                              resistenciaPoderesAtual,
                          );
                          const novaComprada = clamp(
                            parseNatural(event.target.value),
                            0,
                            maxComprada,
                          );

                          return {
                            ...current,
                            combate: {
                              ...current.combate,
                              resistenciaComprada: String(novaComprada),
                            },
                          };
                        })
                      }
                    />
                  </label>
                  <label>
                    Resistencia de Poderes
                    <input
                      type="number"
                      min={0}
                      max={LIMITE_DEFESA_RESISTENCIA}
                      value={resistenciaPoderes}
                      onChange={(event) =>
                        updateCharacter((current) => {
                          const bonusBase =
                            BONUS_BY_DICE[current.atributos.Constituicao];
                          const defesaCompradaAtual = clamp(
                            parseNatural(current.combate.defesa) - DEFESA_BASE,
                            0,
                            LIMITE_DEFESA_RESISTENCIA,
                          );
                          const resistenciaCompradaAtual = parseNatural(
                            current.combate.resistenciaComprada,
                          );
                          const maxPoderes = Math.max(
                            0,
                            LIMITE_DEFESA_RESISTENCIA -
                              defesaCompradaAtual -
                              bonusBase -
                              resistenciaCompradaAtual,
                          );
                          const novaResistenciaPoderes = clamp(
                            parseNatural(event.target.value),
                            0,
                            maxPoderes,
                          );

                          return {
                            ...current,
                            combate: {
                              ...current.combate,
                              resistenciaPoderes: String(
                                novaResistenciaPoderes,
                              ),
                            },
                          };
                        })
                      }
                    />
                  </label>
                </div>
                <label>
                  Resistencia Total
                  <input value={String(resistenciaTotalEfetiva)} readOnly />
                </label>
                <label>
                  Dano Base
                  <input value={String(danoBase)} readOnly />
                </label>
              </div>
              <p className="rule-note">
                Limite: Defesa Comprada + Resistencia Total nao pode passar de
                22. Defesa base 10 nao entra nesse calculo.
              </p>
            </article>
          </div>
        </section>

        <section className="block pericias-block">
          <h3>Pericias</h3>
          <div className="skills-grid">
            {PERICIAS.map((pericia) => {
              const valor = parseNatural(selectedCharacter.pericias[pericia]);
              const acimaLimite = valor > limitePericia;
              const info = PERICIA_INFO[pericia];
              const tooltip = info
                ? `Atributo: ${info.atributo}. ${info.uso}`
                : "Sem descricao.";

              return (
                <label key={pericia} className={acimaLimite ? "warn" : ""}>
                  <span className="pericia-name">
                    {pericia}
                    <span className="info-dot" data-tooltip={tooltip}>
                      i
                    </span>
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={limitePericia || undefined}
                    value={selectedCharacter.pericias[pericia]}
                    onChange={(event) =>
                      updateCharacter((current) => ({
                        ...current,
                        pericias: {
                          ...current.pericias,
                          [pericia]: event.target.value,
                        },
                      }))
                    }
                  />
                </label>
              );
            })}
          </div>
          <div className="conhecimentos-stack">
            {selectedCharacter.conhecimentos.map((conhecimento, index) => {
              const valor = parseNatural(conhecimento.graduacoes);
              const acimaLimite = valor > limitePericia;

              return (
                <div
                  key={`conhecimento-${index}`}
                  className={`conhecimento-row ${acimaLimite ? "warn" : ""}`}
                >
                  <span className="pericia-name">
                    Conhecimento
                    <span
                      className="info-dot"
                      data-tooltip={`Atributo: ${PERICIA_INFO.Conhecimento.atributo}. ${PERICIA_INFO.Conhecimento.uso}`}
                    >
                      i
                    </span>
                  </span>
                  <select
                    value={conhecimento.area}
                    onChange={(event) =>
                      updateCharacter((current) => {
                        const novosConhecimentos = [...current.conhecimentos];
                        novosConhecimentos[index] = {
                          ...novosConhecimentos[index],
                          area: event.target.value,
                        };

                        return {
                          ...current,
                          conhecimentos: novosConhecimentos,
                        };
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
                  <input
                    type="number"
                    min={0}
                    max={limitePericia || undefined}
                    value={conhecimento.graduacoes}
                    onChange={(event) =>
                      updateCharacter((current) => {
                        const novosConhecimentos = [...current.conhecimentos];
                        novosConhecimentos[index] = {
                          ...novosConhecimentos[index],
                          graduacoes: event.target.value,
                        };

                        return {
                          ...current,
                          conhecimentos: novosConhecimentos,
                        };
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
          <p className="rule-note">
            Limite por pericia: Nivel + 10 = {limitePericia}
          </p>
        </section>

        <section className="sheet-columns bottom-grid">
          <article className="block manipulacoes">
            <h3>Poderes / Manipulacoes</h3>
            <div className="manip-grid">
              {MANIPULACOES.map((manipulacao) => (
                <div className="manip-card" key={manipulacao}>
                  <h4>{manipulacao}</h4>
                  {(() => {
                    const graduacao =
                      selectedCharacter.manipulacoes[manipulacao].graduacao;
                    const derived = getManipulacaoDerived(
                      manipulacao,
                      graduacao,
                    );

                    return (
                      <>
                        <label>
                          Graduacao
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={graduacao}
                            onChange={(event) =>
                              updateCharacter((current) => ({
                                ...current,
                                manipulacoes: {
                                  ...current.manipulacoes,
                                  [manipulacao]: {
                                    ...current.manipulacoes[manipulacao],
                                    graduacao: event.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </label>
                        <label>
                          Modificador
                          <input value={derived.modificador} disabled />
                        </label>
                        <label>
                          Custo de Eter
                          <input value={derived.custo} disabled />
                        </label>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </article>

          <div className="stacked wider">
            <article className="block vantagens-panel">
              <h3>Vantagens</h3>
              <div className="vantagens-controls">
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
                        {vantagem.nome}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Graduacao
                  <input
                    type="number"
                    min={1}
                    value={
                      vantagemSelecionada?.temGraduacao
                        ? vantagemGraduacao
                        : "1"
                    }
                    onChange={(event) =>
                      setVantagemGraduacao(event.target.value)
                    }
                    disabled={!vantagemSelecionada?.temGraduacao}
                  />
                </label>
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
                  {vantagemSelecionada.efeito}
                </p>
              ) : null}

              <div className="vantagens-list">
                {selectedCharacter.vantagens.length === 0 ? (
                  <p className="empty-vantagens">
                    Nenhuma vantagem adicionada.
                  </p>
                ) : (
                  selectedCharacter.vantagens.map((vantagem) => (
                    <div className="vantagem-item" key={vantagem.id}>
                      <div>
                        <strong>{vantagem.nome}</strong>
                        <span>
                          {vantagem.categoria}
                          {vantagem.temGraduacao
                            ? ` | Graduacao ${vantagem.graduacao}`
                            : ""}
                          {` | ${vantagem.graduacao * 3} PP`}
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
                  ))
                )}
              </div>
            </article>

            <article className="block lined-textarea">
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
            </article>
          </div>
        </section>

        <section className="powers-wide">
          <div className="powers-header">
            <h3>Poderes</h3>
          </div>

          <div className="powers-main-tabs">
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
              className={poderesPanelVisivel === "arsenal" ? "active" : ""}
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
                {NAIPE_PODERES.map((naipe) => (
                  <button
                    type="button"
                    key={naipe}
                    className={naipePoderSelecionado === naipe ? "active" : ""}
                    onClick={() => setNaipePoderSelecionado(naipe)}
                  >
                    {naipe}
                  </button>
                ))}
              </div>

              <div className="power-catalog-grid">
                {poderesCatalogo.map((power) => {
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
                      <h4>{power.nome}</h4>
                      <span className={`power-tier-badge ${tierClasse}`}>
                        {tierLabel}
                      </span>
                      <p>
                        {power.tipo} | {power.acao} | {power.alcance}
                      </p>
                      <p>
                        Custo: {power.custoPontosTexto} | Eter:{" "}
                        {power.custoEterBase}
                      </p>
                      <p>
                        Multiplicador por naipe: x{multiplicadorNaipe}
                        {multiplicadorNaipe > 1
                          ? ` (${selectedCharacter.naipe || "Sem Naipe"} -> ${power.naipe})`
                          : ""}
                      </p>
                      <p>
                        Extras: {power.extras.length} | Falhas:{" "}
                        {power.falhas.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => adicionarPoder(power)}
                        disabled={jaNoArsenal}
                      >
                        {jaNoArsenal ? "Ja no arsenal" : "Adicionar ao arsenal"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="powers-arsenal-list">
              {selectedCharacter.poderes.length === 0 ? (
                <p className="empty-vantagens">Nenhum poder no arsenal.</p>
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
                    <div className="power-arsenal-item" key={powerEntry.id}>
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
                        <input
                          type="number"
                          min={1}
                          max={MAX_POWER_GRADUATION_LIMIT}
                          value={powerEntry.graduacao}
                          onChange={(event) =>
                            updateCharacter((current) => ({
                              ...current,
                              poderes: current.poderes.map((item) =>
                                item.id === powerEntry.id
                                  ? {
                                      ...item,
                                      graduacao: event.target.value,
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
                            <label key={`${powerEntry.id}-extra-${extra.nome}`}>
                              <input
                                type="checkbox"
                                checked={powerEntry.extrasSelecionados.includes(
                                  extra.nome,
                                )}
                                onChange={(event) =>
                                  updateCharacter((current) => ({
                                    ...current,
                                    poderes: current.poderes.map((item) => {
                                      if (item.id !== powerEntry.id) {
                                        return item;
                                      }

                                      const extrasSelecionados = event.target
                                        .checked
                                        ? [
                                            ...item.extrasSelecionados,
                                            extra.nome,
                                          ]
                                        : item.extrasSelecionados.filter(
                                            (nome) => nome !== extra.nome,
                                          );

                                      return {
                                        ...item,
                                        extrasSelecionados,
                                      };
                                    }),
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
                            <label key={`${powerEntry.id}-falha-${falha.nome}`}>
                              <input
                                type="checkbox"
                                checked={powerEntry.falhasSelecionadas.includes(
                                  falha.nome,
                                )}
                                onChange={(event) =>
                                  updateCharacter((current) => ({
                                    ...current,
                                    poderes: current.poderes.map((item) => {
                                      if (item.id !== powerEntry.id) {
                                        return item;
                                      }

                                      const falhasSelecionadas = event.target
                                        .checked
                                        ? [
                                            ...item.falhasSelecionadas,
                                            falha.nome,
                                          ]
                                        : item.falhasSelecionadas.filter(
                                            (nome) => nome !== falha.nome,
                                          );

                                      return {
                                        ...item,
                                        falhasSelecionadas,
                                      };
                                    }),
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
                  );
                })
              )}
              <p className="rule-note powers-note">
                Limite de graduacao por poder: {MAX_POWER_GRADUATION_RULE}
              </p>
            </div>
          )}
        </section>

        <section className="block rules-reference">
          <h3>Referencias de Custo</h3>
          <div className="rules-grid">
            <article>
              <h4>Custo de Atributos</h4>
              <table>
                <thead>
                  <tr>
                    <th>Evolucao</th>
                    <th>Custo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>D4 -&gt; D6</td>
                    <td>3 PP</td>
                  </tr>
                  <tr>
                    <td>D6 -&gt; D8</td>
                    <td>4 PP</td>
                  </tr>
                  <tr>
                    <td>D8 -&gt; D10</td>
                    <td>5 PP</td>
                  </tr>
                  <tr>
                    <td>D10 -&gt; D12</td>
                    <td>6 PP</td>
                  </tr>
                </tbody>
              </table>
            </article>

            <article>
              <h4>Custo de Melhoria (CaC / Disparo)</h4>
              <table>
                <thead>
                  <tr>
                    <th>Evolucao</th>
                    <th>Custo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sem dado -&gt; D4</td>
                    <td>3 PP</td>
                  </tr>
                  <tr>
                    <td>D4 -&gt; D6</td>
                    <td>4 PP</td>
                  </tr>
                  <tr>
                    <td>D6 -&gt; D8</td>
                    <td>5 PP</td>
                  </tr>
                  <tr>
                    <td>D8 -&gt; D10</td>
                    <td>6 PP</td>
                  </tr>
                  <tr>
                    <td>D10 -&gt; D12</td>
                    <td>7 PP</td>
                  </tr>
                </tbody>
              </table>
            </article>

            <article>
              <h4>Bonus de Constituicao</h4>
              <table>
                <thead>
                  <tr>
                    <th>Constituicao</th>
                    <th>Resistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {DICE_OPTIONS.map((dice) => (
                    <tr key={dice}>
                      <td>{dice}</td>
                      <td>+{BONUS_BY_DICE[dice]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <article>
              <h4>Dano Base por Forca</h4>
              <table>
                <thead>
                  <tr>
                    <th>Forca</th>
                    <th>Dano</th>
                  </tr>
                </thead>
                <tbody>
                  {DICE_OPTIONS.map((dice) => (
                    <tr key={dice}>
                      <td>{dice}</td>
                      <td>+{BONUS_BY_DICE[dice]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </div>
          <p className="rule-note">
            Regras aplicadas neste passo: atributos, CaC/disparo, resistencia,
            defesa, vantagem (3 PP por linha), vida/eter automaticos.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
