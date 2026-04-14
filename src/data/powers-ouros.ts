import type { PowerDefinition } from "./powers";

export const PODERES_OUROS: PowerDefinition[] = [
  {
    id: "ouros-animar-objetos",
    nome: "Animar Objetos",
    naipe: "Ouros",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Controla objetos do ambiente para atacar, interferir ou bloquear areas.",
    efeitoPrincipal:
      "Anima ate graduacao objetos, distribuindo volume total de 0,5 m3 por graduacao.",
    extras: [
      { nome: "Horda Expandida", custo: "+1 por graduacao" },
      { nome: "Impacto Concentrado", custo: "+1 por graduacao" },
      { nome: "Controle Refinado", custo: "+1 por graduacao" },
      { nome: "Zona Densa", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente do Ambiente", custo: "-2 por graduacao" },
      { nome: "Controle Difuso", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado (Tipo de objeto)", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Infunde Eter em objetos inanimados para transforma-los em ferramentas taticas.",
        "O foco e controle de campo: atacar, travar espacos e impor penalidades.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Controla ate graduacao objetos simultaneamente.",
            "Volume total maximo: 0,5 m3 por graduacao.",
            "Objetos ancorados/estruturais nao podem ser animados.",
          ],
        },
        {
          titulo: "Modos",
          itens: [
            "Pressao: ataque distribuido com dano igual a graduacao.",
            "Interferencia: distribui penalidades ate graduacao (max -2 por categoria).",
            "Bloqueio: area de ate 1,5 m por graduacao para dificultar passagem.",
          ],
        },
      ],
    },
  },
  {
    id: "ouros-arsenal",
    nome: "Arsenal",
    naipe: "Ouros",
    tipo: "Ataque / Fortalecimento",
    acao: "Padrao",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Cria armas de Eter com formas variadas, adaptando ataque e propriedades.",
    efeitoPrincipal:
      "Materializa arma de Eter que causa dano igual a graduacao e aplica -1 Defesa ao causar dano apos Resistencia.",
    extras: [
      { nome: "Armas Multiplas", custo: "+1 por graduacao" },
      { nome: "Arma Adaptativa", custo: "+1 fixo" },
      { nome: "Arremesso Espiritual", custo: "+1 por graduacao" },
      { nome: "Perfuracao", custo: "+1 por graduacao" },
      { nome: "Condensacao Estavel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado (Forma)", custo: "-1 por graduacao" },
      { nome: "Exigente", custo: "-1 por graduacao" },
      { nome: "Sobrecarga de Eter", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Condensa Eter em armas funcionais para combate corpo a corpo ou a distancia.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "A arma usa CaC ou Disparo do personagem.",
            "Dano base do poder: graduacao.",
            "Ao causar dano apos Resistencia, aplica -1 Defesa no alvo ate o proximo turno dele.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Arsenal de Eter",
          colunas: ["Graduacao", "Configuracao", "Bonus"],
          linhas: [
            ["1", "Vetor Preciso", "+1 acerto"],
            ["2", "Projecao Direcionada", "alcance medio e +1 acerto"],
            ["3", "Estrutura Balanceada", "+1 dano"],
            ["4", "Projecao Estendida", "+1 acerto e alcance longo"],
            ["5", "Impacto Condensado", "+2 dano"],
            ["6", "Ruptura Direcionada", "+2 acerto"],
            ["7", "Matriz de Combate", "+1 acerto e +1 dano"],
            ["8", "Projecao Refinada", "+2 acerto e +1 dano"],
            ["9", "Ruptura Avancada", "+2 dano e +2 acerto"],
            ["10", "Configuracao Suprema", "+3 acerto e +1 dano"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-armadilha",
    nome: "Armadilha",
    naipe: "Ouros",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Cria efeitos condicionais no campo que ativam ao contato ou entrada.",
    efeitoPrincipal:
      "Configura gatilho imediato ou por entrada e aplica Contencao, Restricao ou Impacto.",
    extras: [
      { nome: "Area Expandida", custo: "+1 por graduacao" },
      { nome: "Persistente", custo: "+1 por graduacao" },
      { nome: "Aprisionamento Total", custo: "+1 por graduacao" },
      { nome: "Oculta", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Solo)", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Visivel", custo: "-1 por graduacao" },
    ],
    observacoes: "Duracao pode ser Sustentado ou ate ativacao.",
    detalhes: {
      introducao: [
        "Estrutura pontos de Eter no campo para punir movimentacao e posicionamento.",
      ],
      secoes: [
        {
          titulo: "Ativacao",
          itens: [
            "Imediata: ativa no momento da criacao.",
            "Por Entrada: ativa quando criatura entra na area.",
          ],
        },
        {
          titulo: "Efeitos",
          itens: [
            "Contencao: Imobilizado.",
            "Restricao: -2 em ataques e -2 Defesa.",
            "Impacto: dano igual a graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "ouros-bolsao-dimensional",
    nome: "Bolsao Dimensional",
    naipe: "Ouros",
    tipo: "Conjuracao",
    acao: "Movimento",
    alcance: "Toque",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Armazena objetos em um espaco extradimensional seguro.",
    efeitoPrincipal:
      "Guarda e recupera itens com acao de movimento, respeitando volume por graduacao.",
    extras: [
      { nome: "Armazenamento Vivo", custo: "+1 por graduacao" },
      { nome: "Acesso Instantaneo", custo: "+1 fixo" },
      { nome: "Compartimento Organizado", custo: "+1 fixo" },
      { nome: "Acesso Compartilhado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado (Tipo de item)", custo: "-1 por graduacao" },
      { nome: "Acesso Lento", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Cria um compartimento extradimensional vinculado ao fluxo de Eter do usuario.",
      ],
      tabelas: [
        {
          titulo: "Bolsao Dimensional",
          colunas: ["Graduacao", "Volume Maximo"],
          linhas: [
            ["1", "1 m3"],
            ["2", "2 m3"],
            ["3", "3 m3"],
            ["4", "4 m3"],
            ["5", "5 m3"],
            ["6", "6 m3"],
            ["7", "8 m3"],
            ["8", "10 m3"],
            ["9", "12 m3"],
            ["10", "15 m3"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-calibrar",
    nome: "Calibrar",
    naipe: "Ouros",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Divide graduacao entre acerto e dano em ataques a distancia.",
    efeitoPrincipal:
      "Antes do ataque, distribui graduacao entre bonus de acerto e dano.",
    extras: [
      { nome: "Calibracao Avancada", custo: "+2 por graduacao" },
      { nome: "Foco Total", custo: "+1 por graduacao" },
      { nome: "Disparo Estavel", custo: "+1 por graduacao" },
      { nome: "Ajuste Fino", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Rigidez de Forma", custo: "-1 por graduacao" },
      { nome: "Lento", custo: "-1 por graduacao" },
      { nome: "Dependente de Foco", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Tecnica de precisao: converte graduacao em uma divisao tatica entre acerto e impacto.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Define a divisao antes da rolagem.",
            "Cada parte deve ter ao menos 1 ponto (salvo extras).",
            "Ao causar dano apos Resistencia, aplica -1 Defesa ate o inicio do proximo turno do alvo.",
          ],
        },
      ],
    },
  },
  {
    id: "ouros-campo-de-forca",
    nome: "Campo de Forca",
    naipe: "Ouros",
    tipo: "Defesa",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "+1",
    resumo: "Gera barreira de Eter que concede resistencia contra dano.",
    efeitoPrincipal:
      "Concede +1 Resistencia a cada 2 graduacoes (arredondado para cima) enquanto sustentado.",
    extras: [
      { nome: "Afeta Outros", custo: "+1 por graduacao" },
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Campo Direcionado", custo: "+1 por graduacao" },
      { nome: "Reforco Reativo", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Lento", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Dependente de Foco", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Barreira estrutural de Eter para interceptar impacto e reduzir dano recorrente.",
      ],
      secoes: [
        {
          titulo: "Sobrecarga",
          itens: [
            "Se um unico ataque superar a graduacao do poder, o campo entra em sobrecarga.",
            "Durante sobrecarga, nao concede Resistencia ate o inicio do proximo turno.",
          ],
        },
      ],
    },
  },
  {
    id: "ouros-construto",
    nome: "Construto",
    naipe: "Ouros",
    tipo: "Controle / Defesa",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "+1",
    resumo:
      "Cria estrutura funcional de Eter que atua como extensao do usuario.",
    efeitoPrincipal:
      "Construto pode operar em modos de Defesa, Controle ou Ataque sob comando direto.",
    extras: [
      { nome: "Construto Autonomo", custo: "+2 por graduacao" },
      { nome: "Modo Duplo", custo: "+1 por graduacao" },
      { nome: "Construto Movel", custo: "+1 por graduacao" },
      { nome: "Reforcado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Vinculo Rigido", custo: "-1 por graduacao" },
      { nome: "Estatico", custo: "-1 por graduacao" },
      { nome: "Estrutura Fragil", custo: "-1 por graduacao" },
      { nome: "Sobrecarga de Eter", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manifestacao estruturada de Eter para suporte tatico sem autonomia plena.",
      ],
      tabelas: [
        {
          titulo: "Configuracao de Construto",
          colunas: ["Graduacao", "Defesa", "Resistencia", "Vida"],
          linhas: [
            ["1", "11", "1", "6"],
            ["2", "11", "2", "10"],
            ["3", "12", "2", "14"],
            ["4", "12", "3", "18"],
            ["5", "13", "3", "24"],
            ["6", "13", "4", "30"],
            ["7", "14", "4", "36"],
            ["8", "14", "5", "44"],
            ["9", "15", "5", "52"],
            ["10", "16", "6", "60"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-criar",
    nome: "Criar",
    naipe: "Ouros",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Materializa estruturas de Eter para controle e bloqueio do ambiente.",
    efeitoPrincipal:
      "Cria uma estrutura por vez, com volume e resistencia escalando por graduacao.",
    extras: [
      { nome: "Preciso", custo: "+1 fixo" },
      { nome: "Area", custo: "+2 por graduacao" },
      { nome: "Instantaneo", custo: "+2 por graduacao" },
      { nome: "Projeteis", custo: "+1 por graduacao" },
      { nome: "Reforco Estrutural", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Forma especifica)", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Fragil", custo: "-1 por graduacao" },
      { nome: "Dispendioso", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Converte Eter em materia instavel temporaria para bloquear, sustentar e alterar espaco.",
      ],
      tabelas: [
        {
          titulo: "Configuracao de Estrutura",
          colunas: [
            "Graduacao",
            "Configuracao",
            "Volume Maximo",
            "Resistencia",
          ],
          linhas: [
            ["1", "Nucleo Simples", "0,5 m3", "1"],
            ["2", "Bloco Estruturado", "1 m3", "2"],
            ["3", "Massa Consolidada", "2 m3", "2"],
            ["4", "Barreira Linear", "3 m3", "3"],
            ["5", "Contencao Tatica", "5 m3", "3"],
            ["6", "Estrutura Reforcada", "8 m3", "4"],
            ["7", "Formacao Expandida", "12 m3", "4"],
            ["8", "Camara Compacta", "16 m3", "5"],
            ["9", "Camara Estruturada", "20 m3", "5"],
            ["10", "Construcao Completa", "25 m3", "6"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-cura",
    nome: "Cura",
    naipe: "Ouros",
    tipo: "Geral",
    acao: "Padrao",
    alcance: "Perto",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Restaura Vida e remove Machucados de aliados.",
    efeitoPrincipal:
      "Recupera Vida igual a graduacao; a cada 5 pontos restaurados remove 1 Machucado.",
    extras: [
      { nome: "A Distancia", custo: "+1 por graduacao" },
      { nome: "Cura em Area", custo: "+1 por graduacao" },
      { nome: "Purificacao", custo: "+1 por graduacao" },
      { nome: "Restauracao Vital", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Fisico)", custo: "-1 por graduacao" },
      { nome: "Exaustivo", custo: "-1 por graduacao" },
      { nome: "Canalizacao Lenta", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Reorganiza o fluxo vital de Eter para fechar dano e estabilizar aliados.",
      ],
      secoes: [
        {
          titulo: "Limites",
          itens: [
            "Cada alvo recebe Cura no maximo uma vez por turno.",
            "Nao ultrapassa Vida maxima.",
            "Nao remove estados, exceto Machucados pela progressao de cura.",
          ],
        },
      ],
    },
  },
  {
    id: "ouros-deflexao",
    nome: "Deflexao",
    naipe: "Ouros",
    tipo: "Defesa",
    acao: "Reacao",
    alcance: "A Distancia",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "+1",
    resumo: "Permite desviar ataques como reacao atraves de teste ativo.",
    efeitoPrincipal:
      "Quando um ataque acertaria, faz teste 1d20 + graduacao para negar o acerto.",
    extras: [
      { nome: "Reflexao", custo: "+1 por graduacao" },
      { nome: "Protecao Compartilhada", custo: "+1 por graduacao" },
      { nome: "Deflexao Precisa", custo: "+1 por graduacao" },
      { nome: "Intercepcao Parcial", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Tipo de ataque)", custo: "-1 por graduacao" },
      { nome: "Exigente", custo: "-1 por graduacao" },
      { nome: "Tempo de Reacao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Intercepcao pontual de ataque com resposta imediata de Eter.",
      ],
    },
  },
  {
    id: "ouros-deslocamento-de-imagem",
    nome: "Deslocamento de Imagem",
    naipe: "Ouros",
    tipo: "Defesa / Sensorial",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Distorce a posicao percebida, gerando chance de erro em ataques.",
    efeitoPrincipal:
      "Projeta imagem deslocada com chance de erro progressiva por graduacao.",
    extras: [
      { nome: "Imagem Reativa", custo: "+1 por graduacao" },
      { nome: "Sensorial Ampliado", custo: "+1 por graduacao" },
      { nome: "Distorcao Instavel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Dependente de Concentracao", custo: "-1 por graduacao" },
      { nome: "Efeito Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Deslocamento de Imagem",
          colunas: ["Graduacao", "Distancia", "Chance de erro"],
          linhas: [
            ["1", "1,5 m", "10%"],
            ["2", "3 m", "20%"],
            ["3", "4,5 m", "30%"],
            ["4", "6 m", "40%"],
            ["5", "7,5 m", "45%"],
            ["6", "9 m", "50%"],
            ["7", "10,5 m", "55%"],
            ["8", "12 m", "60%"],
            ["9", "13,5 m", "65%"],
            ["10", "15 m", "70%"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-dispositivo",
    nome: "Dispositivo",
    naipe: "Ouros",
    tipo: "Conjuracao",
    acao: "Nenhuma",
    alcance: "Pessoal",
    duracao: "Permanente",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Armazena poderes em um artefato utilizavel pelo usuario.",
    efeitoPrincipal:
      "Define capacidade total de PP armazenado e limite de graduacoes ativas simultaneamente.",
    extras: [
      { nome: "Indestrutivel", custo: "+1 por graduacao" },
      { nome: "Ligado ao Usuario", custo: "+1 fixo" },
      { nome: "Dispositivo Oculto", custo: "+1 fixo" },
      { nome: "Ativacao Rapida", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Removivel", custo: "-1 por graduacao" },
      { nome: "Dependencia", custo: "-1 por graduacao" },
      { nome: "Canal Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Dispositivo",
          colunas: ["Graduacao", "Capacidade (PP)"],
          linhas: [
            ["1", "5"],
            ["2", "10"],
            ["3", "15"],
            ["4", "20"],
            ["5", "25"],
            ["6", "30"],
            ["7", "35"],
            ["8", "40"],
            ["9", "45"],
            ["10", "50"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-invocar",
    nome: "Invocar",
    naipe: "Ouros",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "Perto",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "+1",
    resumo:
      "Cria entidade independente com turno proprio e comportamento definido.",
    efeitoPrincipal:
      "Invocacao possui turno proprio e escala de ataque/defesa/resistencia/vida por graduacao.",
    extras: [
      { nome: "Multiplas Invocacoes", custo: "+2 por graduacao" },
      { nome: "Invocacao Especializada", custo: "+1 fixo" },
      { nome: "Autonomia Avancada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Vinculo Doloroso", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Comportamento Rigido", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Configuracao de Invocado",
          colunas: ["Graduacao", "Ataque", "Defesa", "Resistencia", "Vida"],
          linhas: [
            ["1", "d4 +0", "10", "2", "8"],
            ["2", "d4 +1", "11", "3", "12"],
            ["3", "d6 +0", "11", "3", "16"],
            ["4", "d6 +1", "12", "4", "20"],
            ["5", "d8 +0", "12", "4", "26"],
            ["6", "d8 +1", "13", "5", "32"],
            ["7", "d10 +0", "13", "5", "38"],
            ["8", "d10 +1", "14", "6", "46"],
            ["9", "d12 +0", "14", "6", "54"],
            ["10", "d12 +1", "15", "6", "60"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-nausear",
    nome: "Nausear",
    naipe: "Ouros",
    tipo: "Ataque / Controle",
    acao: "Padrao",
    alcance: "Toque",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Aplica penalidades fisicas e funcionais por desestabilizacao interna.",
    efeitoPrincipal:
      "Distribui penalidades iguais a graduacao entre categorias do alvo apos falha em Constituicao.",
    extras: [
      { nome: "Drenagem Precisa", custo: "+1 por graduacao" },
      { nome: "Colapso Sistemico", custo: "+1 por graduacao" },
      { nome: "Drenagem Expandida", custo: "+1 por graduacao" },
      { nome: "Persistente", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Concentracao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Debuff estrutural de combate que afeta varios pilares (Constituicao, Resistencia, Vontade, Dano e Movimento).",
      ],
    },
  },
  {
    id: "ouros-nulificar",
    nome: "Nulificar",
    naipe: "Ouros",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+2",
    resumo: "Reduz ou impede o uso de um poder especifico do alvo.",
    efeitoPrincipal:
      "Diminui graduacao do poder escolhido em metade da graduacao de Nulificar (limite -3).",
    extras: [
      { nome: "Supressao Total", custo: "+1 por graduacao" },
      { nome: "Alvo Duplo", custo: "+1 por graduacao" },
      { nome: "Pressao Continua", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Tipo de poder)", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Canalizacao Exigente", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Supressao tecnica de habilidade inimiga por interferencia no fluxo de Eter.",
      ],
    },
  },
  {
    id: "ouros-paralisia",
    nome: "Paralisia",
    naipe: "Ouros",
    tipo: "Ataque / Controle",
    acao: "Padrao",
    alcance: "Toque",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Aplica controle progressivo ate imobilizacao total do alvo.",
    efeitoPrincipal:
      "Escala em niveis por falhas consecutivas de Vontade, avancando estado de incapacitacao.",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Duracao Estendida", custo: "+1 por graduacao" },
      { nome: "A Distancia", custo: "+1 por graduacao" },
      { nome: "Supressao Profunda", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Sentido", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Concentracao", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Paralisia",
          colunas: ["Nivel", "Efeito"],
          linhas: [
            ["1", "-1 ataque e defesa"],
            ["2", "movimento reduzido pela metade"],
            ["3", "acao limitada"],
            ["4", "-2 geral, sem acoes livres"],
            ["5", "perde acao de movimento"],
            ["6", "perde acao padrao"],
            ["7", "imobilizado parcial"],
            ["8", "incapaz de agir"],
            ["9", "indefeso (Defesa 7)"],
            ["10", "paralisia total"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-pasmar",
    nome: "Pasmar",
    naipe: "Ouros",
    tipo: "Ataque / Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Reduz desempenho do alvo via interferencia sensorial.",
    efeitoPrincipal:
      "Distribui penalidades iguais a graduacao entre ataque, defesa, percepcao, pericias e agilidade.",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Distribuicao Amplificada", custo: "+1 por graduacao" },
      { nome: "Supressao Neural", custo: "+1 por graduacao" },
      { nome: "Interferencia Direcionada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Categoria)", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Concentracao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Debuff sensorial direto sem alterar realidade, focado em degradar desempenho.",
      ],
    },
  },
  {
    id: "ouros-portal",
    nome: "Portal",
    naipe: "Ouros",
    tipo: "Controle / Movimento",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Conecta dois pontos do espaco permitindo deslocamento instantaneo.",
    efeitoPrincipal:
      "Abre passagem sustentada entre entrada e saida, com escala de alcance e diametro por graduacao.",
    extras: [
      { nome: "Fluxo Livre", custo: "+1 por graduacao" },
      { nome: "Portal Estavel", custo: "+1 por graduacao" },
      { nome: "Ancoragem Avancada", custo: "+1 por graduacao" },
      { nome: "Abertura Ampliada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado (Visao)", custo: "-1 por graduacao" },
      { nome: "Fluxo Restrito", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Portal",
          colunas: ["Graduacao", "Alcance Maximo", "Diametro"],
          linhas: [
            ["1", "10 m", "1 m"],
            ["2", "20 m", "1,5 m"],
            ["3", "30 m", "2 m"],
            ["4", "40 m", "2,5 m"],
            ["5", "50 m", "3 m"],
            ["6", "60 m", "3,5 m"],
            ["7", "70 m", "4 m"],
            ["8", "80 m", "4,5 m"],
            ["9", "90 m", "5 m"],
            ["10", "100 m", "5,5 m"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-potencializar",
    nome: "Potencializar",
    naipe: "Ouros",
    tipo: "Fortalecimento",
    acao: "Padrao",
    alcance: "Toque",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "+1",
    resumo: "Amplifica temporariamente capacidades de um alvo.",
    efeitoPrincipal:
      "Concede bonus igual a metade da graduacao (arredondado para cima), limitado a +3.",
    extras: [
      { nome: "Potencializacao Dupla", custo: "+1 por graduacao" },
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Alcance Estendido", custo: "+1 fixo" },
      { nome: "Fluxo Intensificado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Lento", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Canalizacao Compartilhada", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Fortalecimento tatico para ataque, defesa, canalizacao ou impacto, com ganho temporario sustentado.",
      ],
    },
  },
  {
    id: "ouros-projecao-astral",
    nome: "Projecao Astral",
    naipe: "Ouros",
    tipo: "Sensorial / Movimento",
    acao: "Movimento",
    alcance: "Graduacao",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "+2",
    resumo: "Permite separar consciencia do corpo e explorar o ambiente.",
    efeitoPrincipal:
      "Projeta forma astral com alcance, velocidade e nivel de interacao escalando por graduacao.",
    extras: [
      { nome: "Projecao Avancada", custo: "+1 por graduacao" },
      { nome: "Vinculo Estavel", custo: "+1 fixo" },
      { nome: "Percepcao Expandida", custo: "+1 por graduacao" },
      { nome: "Projecao Rapida", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Corpo Vulneravel", custo: "-1 por graduacao" },
      { nome: "Vinculo Fragil", custo: "-1 por graduacao" },
      { nome: "Alcance Limitado", custo: "-1 por graduacao" },
      { nome: "Dependencia de Concentracao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Projecao Astral",
          colunas: ["Graduacao", "Distancia", "Velocidade", "Interacao"],
          linhas: [
            ["1", "20 m", "10 m/turno", "observar"],
            ["2", "50 m", "12 m/turno", "observar"],
            ["3", "100 m", "15 m/turno", "observar"],
            ["4", "200 m", "20 m/turno", "observar"],
            ["5", "400 m", "25 m/turno", "observar"],
            ["6", "800 m", "30 m/turno", "observar"],
            ["7", "1,5 km", "35 m/turno", "observar"],
            ["8", "3 km", "40 m/turno", "leve"],
            ["9", "5 km", "50 m/turno", "eter"],
            ["10", "10 km", "60 m/turno", "avancada"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-selar",
    nome: "Selar",
    naipe: "Ouros",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+2",
    resumo: "Cria restricoes estaveis que prendem ou limitam alvos e areas.",
    efeitoPrincipal:
      "Aplica Contencao, Barreira ou Restricao Espiritual com tabela de resistencia, vida e CD por graduacao.",
    extras: [
      { nome: "Selo Persistente", custo: "+2 por graduacao" },
      { nome: "Selo Ampliado", custo: "+1 por graduacao" },
      { nome: "Selo Reforcado", custo: "+1 por graduacao" },
      { nome: "Ligacao Estavel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Preparacao Lenta", custo: "-1 por graduacao" },
      { nome: "Ancora Fixa", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    observacoes: "Alcance pode ser Perto ou A Distancia.",
    detalhes: {
      tabelas: [
        {
          titulo: "Selar",
          colunas: ["Graduacao", "Resistencia", "Vida", "CD"],
          linhas: [
            ["1", "1", "6", "11"],
            ["2", "2", "12", "12"],
            ["3", "2", "18", "13"],
            ["4", "3", "24", "14"],
            ["5", "3", "30", "15"],
            ["6", "4", "36", "16"],
            ["7", "4", "42", "17"],
            ["8", "5", "48", "18"],
            ["9", "5", "54", "19"],
            ["10", "6", "60", "20"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-sentido-remoto",
    nome: "Sentido Remoto",
    naipe: "Ouros",
    tipo: "Sensorial",
    acao: "Livre",
    alcance: "Graduacao",
    duracao: "Sustentado",
    custoPontosPorGraduacao: null,
    custoPontosTexto: "variavel (1 a 4 pontos por graduacao)",
    custoEterBase: "padrao",
    resumo:
      "Permite perceber locais distantes com diferentes niveis sensoriais.",
    efeitoPrincipal:
      "Projeta percepcao em ponto remoto com custo por tipo de sentido e escala de distancia por graduacao.",
    extras: [
      { nome: "Projecao Compartilhada", custo: "+1 por graduacao" },
      { nome: "Foco Preciso", custo: "+1 fixo" },
      { nome: "Ancoragem Estavel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Ponto Conhecido", custo: "-1 por graduacao" },
      { nome: "Vinculo Fragil", custo: "-1 por graduacao" },
      { nome: "Percepcao Limitada", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Custo por Sentido",
          colunas: ["Sentidos", "Custo por graduacao"],
          linhas: [
            ["Visao", "1"],
            ["Visao + Audicao", "2"],
            ["Visao + Audicao + Sensibilidade", "3"],
            ["Percepcao Completa", "4"],
          ],
        },
        {
          titulo: "Sentido Remoto",
          colunas: ["Graduacao", "Distancia Maxima"],
          linhas: [
            ["1", "10 m"],
            ["2", "20 m"],
            ["3", "40 m"],
            ["4", "80 m"],
            ["5", "160 m"],
            ["6", "320 m"],
            ["7", "640 m"],
            ["8", "1 km"],
            ["9", "2 km"],
            ["10", "4 km"],
          ],
        },
      ],
    },
  },
  {
    id: "ouros-teleporte",
    nome: "Teleporte",
    naipe: "Ouros",
    tipo: "Movimento",
    acao: "Movimento",
    alcance: "Pessoal",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "+1",
    resumo:
      "Desloca o proprio corpo instantaneamente entre dois pontos do espaco.",
    efeitoPrincipal:
      "Alcance base de 5 m por graduacao, respeitando espaco livre e linha de efeito.",
    extras: [
      { nome: "Teleporte Estendido", custo: "+1 por graduacao" },
      { nome: "Precisao Absoluta", custo: "+1 por graduacao" },
      { nome: "Teleporte Compartilhado", custo: "+1 por graduacao" },
      { nome: "Acao Rapida", custo: "+2 por graduacao" },
      { nome: "Salto Reativo", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Impreciso", custo: "-1 por graduacao" },
      { nome: "Exigente", custo: "-1 por graduacao" },
      { nome: "Canalizacao Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
    ],
    detalhes: {
      secoes: [
        {
          titulo: "Regras",
          itens: [
            "Nao atravessa bloqueios de espaco/Eter.",
            "Destino invalido consome a acao e falha o efeito.",
            "Nao gera acoes adicionais.",
          ],
        },
      ],
    },
  },
  {
    id: "ouros-transmutacao",
    nome: "Transmutacao",
    naipe: "Ouros",
    tipo: "Conjuracao / Alteracao",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+1",
    resumo: "Altera a composicao de materiais sem criar ou destruir materia.",
    efeitoPrincipal:
      "Converte materia para composicao equivalente, com volume maximo por graduacao.",
    extras: [
      { nome: "Transformacao Instantanea", custo: "+1 por graduacao" },
      { nome: "Transmutacao Avancada", custo: "+1 por graduacao" },
      { nome: "Afeta Criaturas", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Limitacao Material", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Lenta", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Transmutacao",
          colunas: ["Graduacao", "Volume Maximo"],
          linhas: [
            ["1", "0,5 m3"],
            ["2", "1 m3"],
            ["3", "1,5 m3"],
            ["4", "2 m3"],
            ["5", "3 m3"],
            ["6", "4 m3"],
            ["7", "6 m3"],
            ["8", "8 m3"],
            ["9", "10 m3"],
            ["10", "12 m3"],
          ],
        },
      ],
    },
  },
];
