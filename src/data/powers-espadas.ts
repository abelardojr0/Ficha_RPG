import type { PowerDefinition } from "./powers";

export const PODERES_ESPADAS: PowerDefinition[] = [
  {
    id: "espadas-absorcao",
    nome: "Absorcao",
    naipe: "Espadas",
    tipo: "Defesa / Fortalecimento",
    acao: "Reacao",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Converte parte do dano recebido em cargas para ataque ou dano corpo a corpo.",
    efeitoPrincipal:
      "A cada 2 graduacoes: reduz 1 dano e gera 1 carga (arredondado para baixo).",
    extras: [
      { nome: "Amplificacao", custo: "+1 fixo" },
      { nome: "Explosao", custo: "+1 por graduacao" },
      { nome: "Armazenamento Expandido", custo: "+1 por graduacao" },
      { nome: "Conversao Imediata", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Fisico)", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Exposicao Necessaria", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Absorcao redireciona o impacto recebido para gerar recurso ofensivo imediato.",
        "Em Espadas, sofrer dano tambem pode gerar vantagem tatica.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ativa ao sofrer dano, depois da aplicacao da Resistencia.",
            "Cada 2 graduacoes reduzem 1 dano e geram 1 Carga.",
            "Cargas geradas nao podem exceder o dano final recebido.",
          ],
        },
        {
          titulo: "Cargas",
          itens: [
            "Cada Carga concede +1 dano ou +1 ataque corpo a corpo.",
            "Limite maximo de Cargas armazenadas: igual a graduacao do poder.",
            "Duram ate uso ou fim da cena.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-aura",
    nome: "Aura",
    naipe: "Espadas",
    tipo: "Ataque / Controle",
    acao: "Reacao",
    alcance: "Area",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Campo reativo de 2 metros que pune aproximacao e contato corpo a corpo.",
    efeitoPrincipal:
      "Alvo testa Constituicao (CD 10 + graduacao): falha sofre dano e penalidade fisica.",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Repulsao", custo: "+1 por graduacao" },
      { nome: "Aura Continua", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Alcance Reduzido", custo: "-1 por graduacao" },
      { nome: "Consumo Elevado", custo: "-1 por graduacao" },
      { nome: "Sobrecarga", custo: "-1 por graduacao" },
    ],
    observacoes: "Alcance base do campo: 2 metros ao redor do usuario.",
    detalhes: {
      introducao: [
        "Aura transforma o espaco proximo em zona de risco constante.",
      ],
      secoes: [
        {
          titulo: "Ativacao",
          itens: [
            "Reage a inimigos que entram no alcance ou atacam corpo a corpo.",
            "Cada inimigo pode ser afetado apenas uma vez por turno.",
          ],
        },
        {
          titulo: "Efeito",
          itens: [
            "Falha: dano igual a metade da graduacao (para cima) e -1 em testes fisicos.",
            "Sucesso: metade do dano (para baixo), sem penalidade.",
            "Funciona apenas com usuario consciente.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-canalizar",
    nome: "Canalizar",
    naipe: "Espadas",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "Corpo a Corpo",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Concentra Eter no impacto fisico para aumentar dano de ataques corpo a corpo.",
    efeitoPrincipal:
      "No acerto, adiciona dano igual a graduacao; em margem alta, aplica -1 Defesa.",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Multi Ataque", custo: "+1 por graduacao" },
      { nome: "Impacto Devastador", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Desarmado)", custo: "-1 fixo" },
      { nome: "Limitado (Arma Especifica)", custo: "-1 por graduacao" },
      { nome: "Preparacao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Canalizar e a base ofensiva de Espadas para dano direto por contato.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Nao altera teste de ataque; so adiciona dano no acerto.",
            "Dano final: dano base + graduacao de Canalizar.",
            "Se causar dano e superar Defesa por 5+, alvo sofre -1 Defesa ate o inicio do proximo turno.",
          ],
        },
        {
          titulo: "Limites",
          itens: [
            "Nao acumula com multiplas ativacoes no mesmo ataque.",
            "Respeita limite de dano do sistema.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-caracteristica-aumentada",
    nome: "Caracteristica Aumentada",
    naipe: "Espadas",
    tipo: "Fortalecimento",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Amplifica um atributo fisico (Forca, Agilidade ou Constituicao) enquanto sustentado.",
    efeitoPrincipal:
      "A cada 2 graduacoes (para cima), concede bonus derivados do atributo escolhido.",
    extras: [
      { nome: "Aumento Massivo", custo: "+1 por graduacao" },
      { nome: "Explosao de Poder", custo: "+1 fixo" },
      { nome: "Sobrecarga Controlada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Atributo)", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Sobrecarga Fisica", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Caracteristica Aumentada representa controle corporal preciso atraves do Eter.",
      ],
      secoes: [
        {
          titulo: "Escolha de Atributo",
          itens: [
            "Forca: +1 dano base, +1 Forca e +1 carga por degrau.",
            "Agilidade: +1 Defesa, +1 Agilidade e +1 m de deslocamento por degrau.",
            "Constituicao: +1 Resistencia, +2 Vida maxima e +1 Constituicao por degrau.",
          ],
        },
        {
          titulo: "Regras",
          itens: [
            "Degarus em +1 a cada 2 graduacoes, arredondado para cima.",
            "Nao altera dado base de atributo.",
            "Nao acumula com varias ativacoes simultaneas.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-colapso",
    nome: "Colapso",
    naipe: "Espadas",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "Toque",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Golpe de precisao que ignora resistencia e aplica um efeito tecnico adicional.",
    efeitoPrincipal:
      "Causa dano igual a graduacao, ignora resistencia por escala e ativa um efeito de Colapso.",
    extras: [
      { nome: "Dupla Aplicacao", custo: "+2 por graduacao" },
      { nome: "Execucao Perfeita", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado (Seres Vivos)", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: ["Colapso e o ataque de ruptura pontual de Espadas."],
      secoes: [
        {
          titulo: "Base",
          itens: [
            "Ataque corpo a corpo por toque.",
            "Dano igual a graduacao.",
            "Ignora 1 Resistencia a cada 2 graduacoes (para cima).",
          ],
        },
        {
          titulo: "Efeitos Disponiveis",
          itens: [
            "Colapso Fisico: -1 em testes fisicos a cada 2 graduacoes.",
            "Ruptura Interna: +1 Machucado (+1 adicional a cada 4 graduacoes).",
            "Dreno de Eter: drena 1 Eter por 2 graduacoes e recupera metade para o usuario.",
            "Paralisia Parcial: teste de Constituicao para evitar penalidades/imobilizacao.",
            "Quebra de Defesa: -1 Resistencia a cada 3 graduacoes ate proximo turno.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-contra-ataque",
    nome: "Contra-Ataque",
    naipe: "Espadas",
    tipo: "Ataque",
    acao: "Reacao",
    alcance: "Corpo a Corpo",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Retaliacao reativa quando um inimigo falha ataque corpo a corpo contra voce.",
    efeitoPrincipal:
      "Ao erro inimigo, realiza contra-golpe (1d20 + CaC) com dano igual a graduacao.",
    extras: [
      { nome: "Reflexo Instintivo", custo: "+2 por graduacao" },
      { nome: "Retaliacao Violenta", custo: "+1 por graduacao" },
      { nome: "Campo Reativo", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Janela Restrita", custo: "-1 por graduacao" },
      { nome: "Exigente", custo: "-1 por graduacao" },
      { nome: "Consumo Elevado", custo: "-1 por graduacao" },
      { nome: "Resposta Limitada", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Contra-Ataque converte abertura defensiva inimiga em resposta imediata.",
      ],
      secoes: [
        {
          titulo: "Regras",
          itens: [
            "Ativa apenas uma vez por rodada.",
            "Consome a reacao do turno.",
            "Nao dispara novos Contra-Ataques em cadeia.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-corrosao",
    nome: "Corrosao",
    naipe: "Espadas",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "Toque",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Golpe de ruptura que causa alto dano e reduz temporariamente a resistencia do alvo.",
    efeitoPrincipal:
      "No acerto, recebe dano adicional igual a graduacao e aplica reducao de Resistencia.",
    extras: [
      { nome: "Area", custo: "+2 por graduacao" },
      { nome: "Seletivo", custo: "+1 por graduacao" },
      { nome: "Alcance", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Dependente de Precisao", custo: "-1 por graduacao" },
      { nome: "Efeito Colateral", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Corrosao combina precisao e explosao para abrir brechas defensivas no alvo.",
      ],
      secoes: [
        {
          titulo: "Efeito de Corrosao",
          itens: [
            "Reduz Resistencia em metade da graduacao (para cima).",
            "Reducao nao acumula e dura ate inicio do proximo turno do alvo.",
            "Nunca reduz abaixo de 0 de Resistencia.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-desgaste",
    nome: "Desgaste",
    naipe: "Espadas",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "Toque",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Interferencia progressiva que acumula niveis de penalidade fisica no alvo.",
    efeitoPrincipal:
      "No acerto, alvo testa Constituicao; falha aplica niveis de Desgaste cumulativos.",
    extras: [
      { nome: "Incuravel", custo: "+1 por graduacao" },
      { nome: "Reversivel", custo: "+1 fixo" },
      { nome: "Pressao Intensa", custo: "+1 por graduacao" },
      { nome: "Salvamento Alternativo", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Dependente de Condicao", custo: "-1 por graduacao" },
      { nome: "Concentracao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Desgaste nao causa dano direto; ele degrada desempenho ao longo da cena.",
      ],
      secoes: [
        {
          titulo: "Niveis",
          itens: [
            "Cada nivel impõe -1 em testes fisicos (Forca, Agilidade, ataque e Defesa).",
            "Acumula ate maximo de 3 niveis.",
            "No maximo, aplica -1 adicional em Defesa.",
          ],
        },
        {
          titulo: "Remocao",
          itens: [
            "No inicio do turno, alvo testa Constituicao (CD 10 + graduacao).",
            "Sucesso remove 1 nivel; falha critica aplica penalidade temporaria adicional.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-enfraquecer",
    nome: "Enfraquecer",
    naipe: "Espadas",
    tipo: "Ataque / Controle",
    acao: "Padrao",
    alcance: "Corpo a Corpo",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Reduz progressivamente Forca, Agilidade ou Constituicao do alvo sem dano direto.",
    efeitoPrincipal:
      "No acerto, alvo testa Constituicao; falha recebe penalidade na caracteristica escolhida.",
    extras: [
      { nome: "Drenagem Espiritual", custo: "+2 por graduacao" },
      { nome: "Enfraquecimento Duplo", custo: "+1 por graduacao" },
      { nome: "Golpe Incapacitante", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Fisico)", custo: "-1 por graduacao" },
      { nome: "Contato Preciso", custo: "-1 por graduacao" },
      { nome: "Efeito Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Enfraquecer pressiona o fluxo corporal do alvo para reduzir sua eficiencia.",
      ],
      secoes: [
        {
          titulo: "Escala",
          itens: [
            "Penalidade: -1 a cada 2 graduacoes (para cima).",
            "Limite por caracteristica: -3.",
            "Acumula com novas aplicacoes e renova duracao.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-imunidade",
    nome: "Imunidade",
    naipe: "Espadas",
    tipo: "Defesa",
    acao: "Nenhuma",
    alcance: "Pessoal",
    duracao: "Permanente",
    custoPontosPorGraduacao: null,
    custoPontosTexto: "variavel (por efeito)",
    custoEterBase: "padrao",
    resumo:
      "Anula completamente interacao com descritores especificos escolhidos.",
    efeitoPrincipal:
      "Cada imunidade e comprada separadamente por faixa de custo e ignora o efeito sem teste.",
    extras: [
      { nome: "Afeta Outros", custo: "+2 por efeito" },
      { nome: "Area", custo: "+3 por efeito" },
      { nome: "Seletivo", custo: "+1 fixo" },
      { nome: "Sustentado", custo: "-1 por efeito" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por efeito" },
      { nome: "Condicional", custo: "-1 por efeito" },
      { nome: "Ativacao", custo: "-1 fixo" },
    ],
    detalhes: {
      introducao: [
        "Imunidade representa adaptacao extrema: o corpo deixa de responder ao efeito escolhido.",
      ],
      secoes: [
        {
          titulo: "Regras",
          itens: [
            "Cada imunidade exige descritor claro e objetivo.",
            "Nao e possivel imunidade total a todo dano.",
            "Nao acumula com Resistencia: o efeito e simplesmente ignorado.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Imunidade por Escopo",
          colunas: ["Custo", "Escopo"],
          linhas: [
            ["2 PP", "efeitos muito especificos"],
            ["4 PP", "efeitos incomuns"],
            ["8 PP", "efeitos relevantes"],
            ["12 PP", "dano especifico"],
            ["16 PP", "descritor comum completo"],
          ],
        },
      ],
    },
  },
  {
    id: "espadas-pressao",
    nome: "Pressao",
    naipe: "Espadas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "Area",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Campo opressivo centrado no usuario que reduz mobilidade e desempenho inimigo.",
    efeitoPrincipal:
      "Alvos na area testam Vontade; falha aplica penalidades e reducao de deslocamento.",
    extras: [
      { nome: "Pressao Devastadora", custo: "+2 por graduacao" },
      { nome: "Foco Direcionado", custo: "+1 fixo" },
      { nome: "Campo Intenso", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Pressao Instavel", custo: "-1 por graduacao" },
      { nome: "Foco Necessario", custo: "-1 por graduacao" },
      { nome: "Alcance Reduzido", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Pressao e controle de area por opressao energetica continua.",
      ],
      secoes: [
        {
          titulo: "Penalidades",
          itens: [
            "A cada 2 graduacoes (para cima): -1 em testes fisicos e ataque.",
            "Reduz deslocamento em 1 metro por graduacao (minimo 1 metro).",
            "Se penalidade total atingir -4, pode causar Lento ou Imobilizado.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Raio de Pressao",
          colunas: ["Graduacao", "Raio"],
          linhas: [
            ["1", "2 m"],
            ["2", "4 m"],
            ["3", "6 m"],
            ["4", "8 m"],
            ["5", "10 m"],
            ["6", "12 m"],
            ["7", "15 m"],
            ["8", "18 m"],
            ["9", "22 m"],
            ["10", "25 m"],
          ],
        },
      ],
    },
  },
  {
    id: "espadas-protecao",
    nome: "Protecao",
    naipe: "Espadas",
    tipo: "Defesa",
    acao: "Nenhuma",
    alcance: "Pessoal",
    duracao: "Permanente",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "especial",
    resumo:
      "Reforco corporal passivo e permanente que dissipa impactos fisicos.",
    efeitoPrincipal: "Concede +1 Resistencia a cada 2 graduacoes (para cima).",
    extras: [
      { nome: "Protecao Adaptativa", custo: "+1 por graduacao" },
      { nome: "Camada Reforcada", custo: "+1 por graduacao" },
      { nome: "Nucleo Estavel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Fisico)", custo: "-1 por graduacao" },
      { nome: "Ativacao", custo: "-1 por graduacao" },
      { nome: "Rigidez Corporal", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Protecao fortalece o corpo por dentro, sem criar barreira externa.",
      ],
      secoes: [
        {
          titulo: "Custo Especial de Eter",
          itens: [
            "Sempre que Protecao reduzir dano efetivamente, consome 2 de Eter por ataque.",
            "Custo so ocorre quando ha reducao real de dano.",
            "Uma aplicacao por instancia de dano.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-rapidez",
    nome: "Rapidez",
    naipe: "Espadas",
    tipo: "Fortalecimento",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Acelera ritmo de combate, concedendo acoes adicionais e bonus de Agilidade.",
    efeitoPrincipal:
      "A cada 2 graduacoes (para cima): +1 Agilidade e desbloqueio de acoes extras por faixa.",
    extras: [
      { nome: "Acao Precisa", custo: "+2 por graduacao" },
      { nome: "Fluxo Continuo", custo: "+2 por graduacao" },
      { nome: "Reflexo Avancado", custo: "+1 por graduacao" },
      { nome: "Movimento Instantaneo", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Exaustivo", custo: "-1 por graduacao" },
      { nome: "Sobrecarga Neural", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Rapidez reduz o intervalo entre percepcao e acao, sem fortalecer o corpo diretamente.",
      ],
      secoes: [
        {
          titulo: "Acoes Adicionais",
          itens: [
            "Graduacao 3-6: 1 acao adicional.",
            "Graduacao 7-10: 2 acoes adicionais.",
            "Penalidades: -3 na primeira acao adicional, -5 na segunda.",
          ],
        },
        {
          titulo: "Limitacoes",
          itens: [
            "Nao permite poder com custo de Eter +2 ou maior nas acoes extras.",
            "Nao permite preparar acoes ou sustentar efeitos adicionais.",
            "Iniciativa por cartas: compra 2 cartas e escolhe 1 enquanto ativa.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-regeneracao",
    nome: "Regeneracao",
    naipe: "Espadas",
    tipo: "Defesa",
    acao: "Nenhuma",
    alcance: "Pessoal",
    duracao: "Permanente",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Recupera Vida automaticamente por turno atraves de fluxo de reconstrucao corporal.",
    efeitoPrincipal:
      "No inicio de cada turno, consome Eter padrao e recupera Vida igual a graduacao.",
    extras: [
      { nome: "Regeneracao Rapida", custo: "+1 por graduacao" },
      { nome: "Regeneracao de Membros", custo: "+2 por graduacao" },
      { nome: "Regeneracao Ativa", custo: "+2 por graduacao" },
      { nome: "Fluxo Ininterrupto", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Dano Massivo)", custo: "-2 por graduacao" },
      { nome: "Fluxo Instavel", custo: "-1 por graduacao" },
      { nome: "Regeneracao Lenta", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Regeneracao nao evita dano; ela reconstroi depois do impacto.",
      ],
      secoes: [
        {
          titulo: "Interacao com Estados",
          itens: [
            "A cada 5 Vida recuperada acumulada, remove 1 Machucado.",
            "Nao remove automaticamente Ferido, Gravemente Ferido ou condicoes especiais.",
            "Dano intenso pode reduzir a regeneracao do proximo turno pela metade.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-repelir",
    nome: "Repelir",
    naipe: "Espadas",
    tipo: "Ataque / Controle",
    acao: "Padrao",
    alcance: "Perto",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Onda cinetica que empurra alvos, causando controle de posicao e risco de colisao.",
    efeitoPrincipal:
      "No acerto, alvo testa Forca contra CD 10 + graduacao para reduzir deslocamento forcado.",
    extras: [
      { nome: "Impacto Massivo", custo: "+1 por graduacao" },
      { nome: "Repulsao Continua", custo: "+2 por graduacao" },
      { nome: "Impacto Brutal", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Somente Controle", custo: "-1 por graduacao" },
      { nome: "Direcional", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    observacoes: "Alcance funcional base: 3 metros.",
    detalhes: {
      introducao: [
        "Repelir e controle espacial direto por deslocamento forcado.",
      ],
      secoes: [
        {
          titulo: "Ambiente",
          itens: [
            "Colisao causa 1 dano a cada 4 metros restantes (minimo 1).",
            "Falha critica no teste de Forca deixa o alvo Caido.",
            "Nao atravessa barreiras solidas.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Distancia de Repelir",
          colunas: ["Graduacao", "Distancia"],
          linhas: [
            ["1", "2 m"],
            ["2", "4 m"],
            ["3", "6 m"],
            ["4", "8 m"],
            ["5", "10 m"],
            ["6", "12 m"],
            ["7", "14 m"],
            ["8", "16 m"],
            ["9", "18 m"],
            ["10", "20 m"],
          ],
        },
      ],
    },
  },
  {
    id: "espadas-salto",
    nome: "Salto",
    naipe: "Espadas",
    tipo: "Fortalecimento",
    acao: "Movimento",
    alcance: "Pessoal",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Impulso explosivo para deslocamento vertical e horizontal em um unico movimento.",
    efeitoPrincipal:
      "Substitui deslocamento do turno por salto escalonado de distancia e altura.",
    extras: [
      { nome: "Salto de Impacto", custo: "+1 por graduacao" },
      { nome: "Salto Direcionado", custo: "+1 fixo" },
      { nome: "Impulso Sequencial", custo: "+2 por graduacao" },
      { nome: "Salto Ofensivo", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Vertical)", custo: "-1 por graduacao" },
      { nome: "Trajetoria Rigida", custo: "-1 por graduacao" },
      { nome: "Exposicao Aerea", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Salto e reposicionamento tatio de alta precisao no naipe de Espadas.",
      ],
      tabelas: [
        {
          titulo: "Escala de Salto",
          colunas: ["Graduacao", "Distancia", "Altura"],
          linhas: [
            ["1", "4 m", "2 m"],
            ["2", "6 m", "3 m"],
            ["3", "8 m", "4 m"],
            ["4", "10 m", "5 m"],
            ["5", "12 m", "6 m"],
            ["6", "14 m", "7 m"],
            ["7", "16 m", "8 m"],
            ["8", "18 m", "9 m"],
            ["9", "20 m", "10 m"],
            ["10", "22 m", "12 m"],
          ],
        },
      ],
      secoes: [
        {
          titulo: "Interacao",
          itens: [
            "Ignora terreno dificil e obstaculos simples de ate 1 metro.",
            "Nao atravessa barreiras solidas.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-superforca",
    nome: "Superforca",
    naipe: "Espadas",
    tipo: "Fortalecimento",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Multiplica capacidade fisica e impacto de acoes baseadas em Forca.",
    efeitoPrincipal:
      "Escala multiplicador de carga, bonus de Forca e bonus de dano corpo a corpo.",
    extras: [
      { nome: "Arremesso Gigante", custo: "+1 por graduacao" },
      { nome: "Forca Aplicada", custo: "+1 fixo" },
      { nome: "Impacto Devastador", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Apenas Levantar)", custo: "-2 por graduacao" },
      { nome: "Descontrole", custo: "-1 por graduacao" },
      { nome: "Dependente de Postura", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Superforca transforma esforco bruto em ferramenta ofensiva e utilitaria.",
      ],
      secoes: [
        {
          titulo: "Escalonamento",
          itens: [
            "+1 em testes de Forca a cada 2 graduacoes (para cima).",
            "+1 de dano corpo a corpo a cada 3 graduacoes (para baixo).",
            "Acoes de precisao sofrem -2 no teste por padrao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Multiplicador de Superforca",
          colunas: ["Graduacao", "Multiplicador"],
          linhas: [
            ["1", "x2"],
            ["2", "x3"],
            ["3", "x4"],
            ["4", "x5"],
            ["5", "x6"],
            ["6", "x8"],
            ["7", "x10"],
            ["8", "x12"],
            ["9", "x15"],
            ["10", "x18"],
          ],
        },
      ],
    },
  },
  {
    id: "espadas-supervelocidade",
    nome: "Supervelocidade",
    naipe: "Espadas",
    tipo: "Movimento",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Multiplica deslocamento e permite corrida em sobrecarga para mobilidade extrema.",
    efeitoPrincipal:
      "Deslocamento recebe multiplicador por graduacao; em sobrecarga, dobra o multiplicador do segundo movimento.",
    extras: [
      { nome: "Arranque Explosivo", custo: "+1 fixo" },
      { nome: "Movimento Avancado", custo: "+1 por graduacao" },
      { nome: "Controle Absoluto", custo: "+1 fixo" },
      { nome: "Rastro de Impacto", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Dificil de Controlar", custo: "-1 por graduacao" },
      { nome: "Exaustivo", custo: "-1 por graduacao" },
      { nome: "Impulso Linear", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Supervelocidade e deslocamento puro: nao concede acoes extras por si.",
      ],
      secoes: [
        {
          titulo: "Sobrecarga",
          itens: [
            "Ao gastar acao padrao exclusivamente para mover, dobra multiplicador do segundo deslocamento.",
            "Durante sobrecarga, nao pode atacar nem usar tecnicas no turno.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Multiplicador de Supervelocidade",
          colunas: ["Graduacao", "Multiplicador"],
          linhas: [
            ["1", "x2"],
            ["2", "x3"],
            ["3", "x4"],
            ["4", "x5"],
            ["5", "x6"],
            ["6", "x7"],
            ["7", "x8"],
            ["8", "x10"],
            ["9", "x12"],
            ["10", "x15"],
          ],
        },
      ],
    },
  },
  {
    id: "espadas-surto-de-adrenalina",
    nome: "Surto de Adrenalina",
    naipe: "Espadas",
    tipo: "Fortalecimento",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Modo ofensivo extremo com grandes bonus de combate e penalidades defensivas.",
    efeitoPrincipal:
      "Concede bonus por faixa de graduacao em ataque, dano, Forca e deslocamento.",
    extras: [
      { nome: "Explosao de Combate", custo: "+2 fixo" },
      { nome: "Furia Incontrolavel", custo: "+1 por graduacao" },
      { nome: "Impacto Implacavel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Cansaco Extremo", custo: "-1 por graduacao" },
      { nome: "Dependente de Dano", custo: "-1 por graduacao" },
      { nome: "Perda de Controle", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Surto sacrifica controle e defesa para maximizar agressividade.",
      ],
      secoes: [
        {
          titulo: "Penalidades e Limites",
          itens: [
            "Enquanto ativo: -2 Defesa e -1 em testes de precisao/controle.",
            "Nao pode usar poderes que exijam precisao (exemplo: Disparo).",
            "Duracao recomendada: metade da graduacao (para cima) em turnos.",
            "Ao encerrar, sofre penalidade global e nao pode reativar na cena.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Escala de Surto de Adrenalina",
          colunas: [
            "Graduacao",
            "Ataque",
            "Dano",
            "Forca (testes)",
            "Deslocamento",
          ],
          linhas: [
            ["1-2", "+1", "+1", "-", "-"],
            ["3-4", "+2", "+1", "+1", "+1 m"],
            ["5-6", "+3", "+2", "+1", "+2 m"],
            ["7-8", "+4", "+3", "+2", "+2 m"],
            ["9-10", "+5", "+4", "+3", "+3 m"],
          ],
        },
      ],
    },
  },
];
