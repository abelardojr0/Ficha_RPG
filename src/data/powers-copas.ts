import type { PowerDefinition } from "./powers";

export const PODERES_COPAS: PowerDefinition[] = [
  {
    id: "copas-projecao",
    nome: "Projecao",
    naipe: "Copas",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Ataque energetico basico e confavel.",
    efeitoPrincipal:
      "Causa dano igual a graduacao com bonus de +1 no ataque; sem efeitos secundarios.",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Disparo Multiplo", custo: "+1 por graduacao" },
      { nome: "Rastreaval", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Carga", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Visivel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Projecao e a forma mais basica e fundamental de manifestacao do Eter, permitindo ao usuario converter seu Eter em um fluxo direto e estavel de energia ofensiva.",
        "Ao ativar a tecnica, o usuario condensa esse fluxo e o projeta contra um alvo a distancia, gerando um impacto imediato. Diferente de outras manifestacoes, a Projecao nao altera a natureza do Eter nem assume propriedades especificas, sendo expressa em sua forma mais pura e controlada.",
        "Por nao possuir efeitos secundarios ou variacoes adicionais, essa tecnica representa o padrao de ataque a distancia do sistema, servindo como referencia direta para comparacao de eficiencia entre poderes.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ao utilizar Projecao, o usuario realiza um teste de ataque a distancia (1d20 + Disparo +1), comparando o resultado com a Defesa do alvo.",
            "Em caso de acerto, o alvo sofre dano energetico direto igual a graduacao da tecnica.",
            "O bonus de +1 no teste de ataque e inerente a Projecao, representando a estabilidade e precisao da emissao de Eter puro.",
          ],
        },
        {
          titulo: "Dano",
          itens: [
            "O dano da Projecao e igual a sua graduacao e representa uma conversao direta de Eter em impacto ofensivo.",
            "Esse dano nao e afetado por atributos fisicos, nao interage com Dano Base e nao recebe modificadores externos que alterem sua natureza, sendo sempre tratado como dano de Eter puro.",
            "A reducao do dano segue as regras normais do sistema, sendo afetada pela Resistencia do alvo.",
          ],
        },
        {
          titulo: "Interacao com o Sistema",
          itens: [
            "A Projecao exige linha de visao ate o alvo e pode ser afetada por cobertura normalmente.",
            "Por se tratar de um ataque a distancia baseado em energia, nao sofre penalidades por combate corpo a corpo.",
            "O teste de ataque utiliza Disparo como base e a tecnica nao aplica estados nem efeitos secundarios por padrao.",
          ],
        },
        {
          titulo: "Escala",
          itens: [
            "A progressao da Projecao e linear e direta: cada graduacao concede +1 de dano, sem alteracoes adicionais na mecanica.",
            "Por nao possuir efeitos complementares, sua eficiencia esta diretamente ligada ao valor de graduacao adquirido, funcionando como uma referencia estaval de dano dentro do sistema.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area: permite aplicar dano em area, seguindo as regras gerais de efeitos em area do sistema. +1 por graduacao.",
            "Disparo Multiplo: permite dividir o dano da tecnica entre multiplos alvos, realizando um teste de ataque separado para cada um. +1 por graduacao.",
            "Rastreavel: recebe +1 no teste de ataque e ignora penalidades leves de cobertura. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Carga: exige uma acao padrao para preparacao; o disparo ocorre no turno seguinte. -1 por graduacao.",
            "Instavel: em caso de falha no ataque, sofre -1 no proximo teste de ataque. -1 por graduacao.",
            "Visivel: o alvo recebe +2 na Defesa contra este ataque. -1 por graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "copas-conversao",
    nome: "Conversao",
    naipe: "Copas",
    tipo: "Defesa / Alteracao",
    acao: "Reacao",
    alcance: "Pessoal",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+2",
    resumo: "Reduz dano e converte parte em Eter.",
    efeitoPrincipal:
      "Apos calcular dano final, metade (arredondado para cima) reduz dano e metade (arredondado para baixo) recupera Eter com penalidade de -1.",
    extras: [
      { nome: "Absorcao Eficiente", custo: "+1 por graduacao" },
      { nome: "Conversao Direcionada", custo: "+1 por graduacao" },
      { nome: "Protecao Reativa", custo: "+1 por graduacao" },
      { nome: "Redistribuicao", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Conversao Ineficiente", custo: "-1 por graduacao" },
      { nome: "Sobrecarga", custo: "-1 por graduacao" },
      { nome: "Foco Instavel", custo: "-1 por graduacao" },
      { nome: "Canalizacao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Conversao permite ao usuario converter seu Eter em um fluxo reativo que interage diretamente com o impacto recebido, transformando parte do dano em energia utilizavel.",
        "Ao sofrer um ataque, o usuario ajusta esse fluxo no instante do impacto, absorvendo parcialmente a energia recebida e redirecionando-a como Eter. Esse processo reduz o dano sofrido enquanto mantem sua capacidade de atuacao sob pressao.",
        "Diferente de uma defesa passiva, a tecnica representa um dominio ativo sobre o resultado do dano, manipulando o fluxo energetico apos todas as etapas normais de mitigacao.",
      ],
      secoes: [
        {
          titulo: "Gatilho",
          itens: [
            "Conversao pode ser utilizada imediatamente apos o usuario sofrer dano de um ataque.",
          ],
        },
        {
          titulo: "Funcionamento",
          itens: [
            "Apos o calculo do dano final â€” ja considerando Resistencia e quaisquer outras reducoes â€” o usuario aplica Conversao sobre o valor restante.",
            "A graduacao do poder e dividida em duas partes: a metade arredondada para cima e utilizada como reducao de dano; a metade arredondada para baixo e convertida em recuperacao de Eter, sofrendo uma penalidade de -1.",
            "O total de conversao aplicado (reducao de dano + recuperacao de Eter) nao pode exceder o dano recebido. Caso exceda, o valor e automaticamente ajustado ate esse limite.",
          ],
        },
        {
          titulo: "Efeito",
          itens: [
            "Conversao altera diretamente o resultado do dano recebido, reduzindo o impacto final e gerando recuperacao imediata de Eter.",
            "A recuperacao ocorre no momento do dano e nao pode ultrapassar o limite maximo de Eter do usuario. Qualquer valor excedente e perdido.",
          ],
        },
        {
          titulo: "Interacao com o Sistema",
          itens: [
            "Conversao e aplicada apos Resistencia e nao substitui esse atributo, nem e considerada uma forma adicional de mitigacao base.",
            "A reducao de dano gerada pela tecnica respeita os limites do sistema. Caso o personagem ja tenha atingido o limite maximo combinado de Defesa + Resistencia, Conversao nao pode reduzir dano adicional. Nessa situacao, apenas a parte de recuperacao de Eter e aplicada.",
            "A tecnica nunca reduz o dano abaixo de 0 e nao permite converter valores alem do dano efetivamente recebido.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Absorcao Eficiente: a recuperacao de Eter nao sofre a penalidade de -1. +1 por graduacao.",
            "Conversao Direcionada: permite converter toda a energia em reducao de dano ou em recuperacao de Eter, a escolha do usuario ao ativar. +1 por graduacao.",
            "Protecao Reativa: recebe +1 na reducao de dano, sem alterar a recuperacao de Eter. +1 por graduacao.",
            "Redistribuicao: permite transferir o Eter recuperado para um aliado em ate 6 metros. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Conversao Ineficiente: a reducao de dano utiliza arredondamento para baixo. -1 por graduacao.",
            "Sobrecarga: se recuperar 3 ou mais de Eter em um turno, sofre -1 geral no proximo turno. -1 por graduacao.",
            "Foco Instavel: se possuir 1 ou mais Ferimentos, sofre -1 na reducao de dano. -1 por graduacao.",
            "Canalizacao: so pode ser utilizada se nao tiver realizado acao padrao no turno anterior. -1 por graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "copas-telecinese",
    nome: "Telecinese",
    naipe: "Copas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Move, prende e arremessa a distancia.",
    efeitoPrincipal:
      "Testa Vontade (CD 10 + grad); falha aplica efeitos progressivos de restricao de deslocamento e acoes fisicas.",
    extras: [
      { nome: "Controle Preciso", custo: "+1 fixo" },
      { nome: "Impulso", custo: "+1 por graduacao" },
      { nome: "Pressao Focada", custo: "+1 por graduacao" },
      { nome: "Suspensao", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Concentracao", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Resistencia Fisica", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Telecinese permite ao usuario converter seu Eter em um fluxo de forca que interage diretamente com o mundo fisico, possibilitando manipular objetos e criaturas a distancia com precisao.",
        "Ao ativar o poder, o usuario projeta esse fluxo, que se manifesta como uma pressao invisivel capaz de mover, conter ou redirecionar alvos dentro de seu alcance.",
        "Diferente de outras tecnicas de controle, a telecinese atua de forma focalizada, afetando alvos especificos em vez de areas amplas.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ao ativar o poder, o usuario escolhe um alvo dentro do alcance.",
            "Quando o alvo e uma criatura, ela deve realizar um teste de resistencia (1d20 + Vontade) contra CD 10 + graduacao.",
            "Sucesso: o efeito e ignorado.",
            "Falha: o alvo sofre o efeito correspondente a graduacao.",
            "Falha critica: o efeito aplicado e aumentado em +1 nivel.",
          ],
        },
        {
          titulo: "Escala â€” Controle Telecinetico",
          itens: [
            "1â€“2: -1 no deslocamento.",
            "3â€“4: -1 em acoes fisicas.",
            "5â€“6: deslocamento reduzido pela metade.",
            "7â€“8: deslocamento 0.",
            "9â€“10: deslocamento 0 e -2 em acoes fisicas.",
          ],
        },
        {
          titulo: "Movimento Telecinetico",
          itens: [
            "Quando uma criatura esta sob efeito da Telecinese, o usuario pode move-la em ate 3 metros por turno.",
            "Esse movimento nao permite manobras complexas nem concede vantagens adicionais.",
          ],
        },
        {
          titulo: "Manipulacao de Objetos",
          itens: [
            "1â€“2: ate 50 kg.",
            "3â€“4: ate 100 kg.",
            "5â€“6: ate 200 kg.",
            "7â€“8: ate 400 kg.",
            "9â€“10: ate 800 kg.",
          ],
        },
        {
          titulo: "Arremesso Telecinetico",
          itens: [
            "Realiza teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Dano base igual a metade da graduacao (arredondado para baixo).",
            "BÃ´nus por peso: ate 50 kg +1 dano; ate 100 kg +2/-1 ataque; ate 200 kg +3/-2; ate 400 kg +4/-3; ate 800 kg +5/-5.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Controle Preciso: remove a penalidade de manipulacao fina. +1 fixo.",
            "Impulso: o movimento telecinetico passa a ser de ate 6 metros por turno. +1 por graduacao.",
            "Pressao Focada: aplica -1 adicional em acoes fisicas ao alvo. +1 por graduacao.",
            "Suspensao: o alvo permanece suspenso no ar enquanto o efeito durar. +2 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Concentracao: ao sofrer dano, deve realizar teste de Vontade (CD 10) ou o efeito e encerrado. -1 por graduacao.",
            "Limitado: a capacidade de carga e reduzida pela metade. -1 por graduacao.",
            "Resistencia Fisica: o teste de resistencia passa a utilizar Constituicao em vez de Vontade. -1 por graduacao.",
            "Instavel: em caso de falha do alvo, o efeito aplicado e reduzido em 1 nivel. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Controle Telecinetico",
          colunas: ["Graduacao", "Efeito"],
          linhas: [
            ["1â€“2", "-1 no deslocamento"],
            ["3â€“4", "-1 em acoes fisicas"],
            ["5â€“6", "deslocamento reduzido pela metade"],
            ["7â€“8", "deslocamento 0"],
            ["9â€“10", "deslocamento 0 e -2 em acoes fisicas"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-leitura-mental",
    nome: "Leitura Mental",
    naipe: "Copas",
    tipo: "Sensorial / Controle",
    acao: "Padrao",
    alcance: "Percepcao",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Le pensamentos, intencoes e memorias.",
    efeitoPrincipal:
      "Testa Vontade (CD 10 + grad); falha aplica estado Lido: usuario recebe +1 e alvo sofre -1 em testes mutuos.",
    extras: [
      { nome: "Leitura Profunda", custo: "+1 por graduacao" },
      { nome: "Leitura Instantanea", custo: "+1 por graduacao" },
      { nome: "Mente Aberta", custo: "+1 por graduacao" },
      { nome: "Foco Analitico", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Contato Visual", custo: "-1 por graduacao" },
      { nome: "Intrusiva", custo: "-1 fixo" },
      { nome: "Ruido Mental", custo: "-1 por graduacao" },
      { nome: "Mente Resistente", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Leitura Mental permite ao usuario converter seu Eter em um fluxo psiquico sensorial, estabelecendo uma conexao direta com a mente de um alvo.",
        "Ao ativar o poder, o usuario projeta esse fluxo ate o alvo, criando um vinculo mental temporario atraves do qual o Eter interage com pensamentos, emocoes e memorias.",
        "A habilidade nao interfere diretamente nas acoes do alvo, mas revela intencoes, padroes mentais e informacoes ocultas.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo realiza um teste de resistencia (1d20 + Vontade) contra CD 10 + graduacao.",
            "Sucesso: a leitura e bloqueada e nenhuma informacao e obtida.",
            "Falha: o usuario acessa informacoes conforme sua graduacao e o alvo passa a ser considerado Lido.",
            "Falha critica: alem de ser Lido, o alvo nao percebe a invasao mental.",
          ],
        },
        {
          titulo: "Estado â€” Lido",
          itens: [
            "O usuario recebe +1 em testes contra o alvo.",
            "O alvo sofre -1 em testes contra o usuario.",
            "Esse efeito permanece enquanto o poder for sustentado.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Leitura Profunda: permite acessar memorias protegidas ou reprimidas sem restricoes narrativas. +1 por graduacao.",
            "Leitura Instantanea: permite realizar a leitura em uma unica acao, sem necessidade de sustentar; nao aplica o estado Lido. +1 por graduacao.",
            "Mente Aberta: permite manter a leitura em ate 2 alvos simultaneamente. +1 por graduacao.",
            "Foco Analitico: o bonus contra o alvo passa a ser +2 em vez de +1. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Contato Visual: requer visao direta do alvo. -1 por graduacao.",
            "Intrusiva: o alvo sempre percebe a tentativa, mesmo em caso de falha. -1 fixo.",
            "Ruido Mental: sofre -2 no teste de ativacao em ambientes caoticos. -1 por graduacao.",
            "Mente Resistente: alvos que obtÃ©m sucesso recebem +2 contra novas tentativas ate o fim da cena. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Profundidade da Leitura",
          colunas: ["Graduacao", "Profundidade"],
          linhas: [
            ["1", "pensamentos superficiais (emocoes e reacoes imediatas)"],
            ["2", "intencoes imediatas"],
            ["3", "pensamentos ativos"],
            ["4", "memorias recentes (ultimas horas)"],
            ["5", "memorias relevantes (ultimos dias)"],
            ["6", "informacoes ocultas conscientes"],
            ["7", "leitura emocional completa"],
            ["8", "memorias profundas"],
            ["9", "traumas e motivacoes centrais"],
            ["10", "acesso quase completo a mente"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-emocional",
    nome: "Manipulacao Emocional",
    naipe: "Copas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "Percepcao",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Altera emocoes para buffar ou enfraquecer.",
    efeitoPrincipal:
      "Testa Vontade (CD 10 + grad); falha aplica estado Afetado com modificadores conforme a emocao escolhida.",
    extras: [
      { nome: "Emocao Intensa", custo: "+1 por graduacao" },
      { nome: "Vinculo Emocional", custo: "+1 fixo" },
      { nome: "Area Emocional", custo: "+2 por graduacao" },
      { nome: "Influencia Sutil", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Instabilidade Emocional", custo: "-1 por graduacao" },
      { nome: "Dependencia", custo: "-1 por graduacao" },
      { nome: "Resistencia Emocional", custo: "-1 por graduacao" },
      { nome: "Visivel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao Emocional permite ao usuario converter seu Eter em um fluxo psiquico capaz de interagir diretamente com os estados emocionais de outras criaturas.",
        "Em vez de impor acoes especificas, o Eter altera a forma como o alvo percebe e reage as situacoes, conduzindo suas decisoes atraves de emocoes intensificadas.",
        "Pode ser usada tanto de forma ofensiva quanto estrategica.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario escolhe um alvo e define qual emocao sera aplicada.",
            "O alvo realiza um teste de resistencia (1d20 + Vontade) contra CD 10 + graduacao.",
            "Sucesso: o efeito e ignorado.",
            "Falha: o alvo passa a ser considerado Afetado.",
            "Falha critica: o efeito e intensificado com modificador adicional de +1 ou -1.",
          ],
        },
        {
          titulo: "Tipos de Emocao",
          itens: [
            "Medo: o alvo sofre penalidade em ataques e evita se aproximar voluntariamente do usuario.",
            "Raiva: recebe bonus de dano, mas sofre penalidade na Defesa.",
            "Calma: reduz o dano causado, mas concede bonus em Resistencia.",
            "Tristeza: sofre penalidade em iniciativa e em testes gerais leves.",
            "Coragem (aliados): recebe bonus contra medo e em acoes ofensivas.",
            "Confianca (aliados): ignora penalidades leves temporarias.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Emocao Intensa: aumenta o bonus ou penalidade em +1 adicional, respeitando o limite maximo de Â±3. +1 por graduacao.",
            "Vinculo Emocional: permite alterar a emocao do alvo sem necessidade de reativar o poder. +1 fixo.",
            "Area Emocional: permite afetar ate 3 alvos dentro de uma mesma area. +2 por graduacao.",
            "Influencia Sutil: o alvo nao percebe automaticamente a manipulacao. +1 fixo.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Instabilidade Emocional: em caso de falha critica, o efeito se aplica ao proprio usuario. -1 por graduacao.",
            "Dependencia: nao pode ser utilizada no mesmo alvo em turnos consecutivos. -1 por graduacao.",
            "Resistencia Emocional: alvos que resistem recebem +2 contra novas tentativas ate o fim da cena. -1 por graduacao.",
            "Visivel: o alvo percebe automaticamente a tentativa. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Intensidade Emocional",
          colunas: ["Graduacao", "Intensidade", "Impacto Mecanico"],
          linhas: [
            ["1â€“2", "leve", "-1 ou +1 em testes especificos"],
            ["3â€“4", "moderado", "-2 ou +2 em testes especificos"],
            ["5â€“6", "forte", "-2 ou +2 geral"],
            ["7â€“8", "intenso", "-3 ou +3 em testes principais"],
            ["9â€“10", "extremo", "-3 ou +3 geral"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-controle-mental",
    nome: "Controle Mental",
    naipe: "Copas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "Percepcao",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "+2",
    resumo: "Assume o comando direto das acoes do alvo.",
    efeitoPrincipal:
      "Testa Vontade (CD 10 + grad); falha aplica estado Dominado conforme escala; exige custo de manutencao por turno.",
    extras: [
      { nome: "Controle Total", custo: "+1 por graduacao" },
      { nome: "Comando Instantaneo", custo: "+1 por graduacao" },
      { nome: "Vinculo Profundo", custo: "+1 por graduacao" },
      { nome: "Dominio Estavel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Contato Visual", custo: "-1 por graduacao" },
      { nome: "Influencia Limitada", custo: "-1 por graduacao" },
      { nome: "Resistencia Ativa", custo: "-1 por graduacao" },
      { nome: "Sobrecarga Mental", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Controle Mental permite ao usuario converter seu Eter em um fluxo psiquico dominante, capaz de sobrepor sua vontade diretamente a mente de outra criatura.",
        "Diferente de outras manifestacoes mentais, Controle Mental nao influencia â€” ele impoe.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo realiza um teste de resistencia (1d20 + Vontade) contra CD 10 + graduacao.",
            "Sucesso: o efeito e ignorado.",
            "Falha: o alvo fica Dominado conforme o nivel da escala.",
            "Falha critica: o alvo e Dominado e nao percebe que esta sendo controlado.",
          ],
        },
        {
          titulo: "Manutencao",
          itens: [
            "A cada turno em que mantem o efeito, o usuario deve escolher entre: perder sua acao padrao ou sofrer -4 em todos os testes ate o proximo turno.",
          ],
        },
        {
          titulo: "Resistencia Continua",
          itens: [
            "O alvo pode tentar se libertar no inicio de cada turno realizando um teste de Vontade contra a mesma CD.",
            "Cada tentativa concede um bonus cumulativo de +1.",
            "Tentativas adicionais podem ocorrer ao sofrer dano ou ao receber comandos extremos.",
          ],
        },
        {
          titulo: "Limites",
          itens: [
            "Controle Mental nao concede acesso a memorias.",
            "Nao permite utilizar habilidades que o alvo nao possua.",
            "O usuario nao pode forcar o alvo a executar acoes impossÃ­veis ou suicidas.",
            "Comandos que envolvam risco evidente, dano ao proprio alvo ou aliados concedem imediatamente um novo teste com vantagem.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Controle Total: permite dividir a graduacao entre multiplos alvos controlados simultaneamente. +1 por graduacao.",
            "Comando Instantaneo: permite impor um comando imediato sem sustentacao (limitado a efeitos ate graduacao 4). +1 por graduacao.",
            "Vinculo Profundo: o alvo nao percebe que esta sendo controlado. +1 por graduacao.",
            "Dominio Estavel: reduz pela metade (arredondado para baixo) o bonus cumulativo de resistencia do alvo. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Contato Visual: requer visao direta do alvo. -1 por graduacao.",
            "Influencia Limitada: os efeitos sao limitados ate graduacao 5. -1 por graduacao.",
            "Resistencia Ativa: o alvo realiza teste de resistencia adicional no final de cada turno. -1 por graduacao.",
            "Sobrecarga Mental: sofre -2 em testes de Vontade enquanto mantem o poder ativo. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Escala de Controle Mental",
          colunas: ["Graduacao", "Nivel", "Efeito"],
          linhas: [
            ["1", "impulso", "forca uma acao simples imediata fora de combate"],
            ["2", "comando leve", "forca uma acao simples sem risco direto"],
            ["3", "interferencia", "sofre -1 em todos os testes"],
            ["4", "comando tatico", "forca uma acao simples em combate"],
            ["5", "controle leve", "forca uma acao padrao simples"],
            ["6", "controle", "o alvo so pode realizar acao ou movimento"],
            [
              "7",
              "controle forte",
              "o usuario escolhe a acao; o alvo mantem movimento",
            ],
            [
              "8",
              "dominio parcial",
              "o usuario controla a acao padrao do alvo",
            ],
            ["9", "dominio", "o usuario controla a acao padrao ou o movimento"],
            [
              "10",
              "controle absoluto",
              "o usuario controla completamente o turno do alvo",
            ],
          ],
        },
      ],
    },
  },
  {
    id: "copas-sono",
    nome: "Sono",
    naipe: "Copas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Induz sonolencia ate apagar o alvo.",
    efeitoPrincipal:
      "Testa Vontade (CD 10 + grad); falha aplica Sonolento nivel 1, evoluindo progressivamente ate Dormindo.",
    extras: [
      { nome: "Inducao Rapida", custo: "+1 por graduacao" },
      { nome: "Sono Profundo", custo: "+1 por graduacao" },
      { nome: "Area Sonifera", custo: "+2 por graduacao" },
      { nome: "Sonolencia Persistente", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Calma", custo: "-1 por graduacao" },
      { nome: "Contato Visual", custo: "-1 por graduacao" },
      { nome: "Sono Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Sono permite ao usuario converter seu Eter em um fluxo psiquico calmante, capaz de induzir relaxamento profundo e reduzir progressivamente o estado de alerta de um alvo.",
        "Diferente de efeitos abruptos, Sono atua de forma progressiva, exigindo resistencia continua ate que o alvo perca completamente a capacidade de se manter desperto.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo realiza um teste de resistencia (1d20 + Vontade) contra CD 10 + graduacao.",
            "Sucesso: o efeito e ignorado.",
            "Falha: o alvo entra em Sonolento (nivel 1).",
            "Falha critica: o alvo entra em Sonolento (nivel 2).",
          ],
        },
        {
          titulo: "Progressao",
          itens: [
            "Enquanto o poder estiver ativo, no inicio de cada turno o alvo realiza um novo teste de Vontade contra a mesma CD.",
            "Falha: o nivel de Sonolencia aumenta em +1.",
            "Sucesso: o nivel e reduzido em -1.",
          ],
        },
        {
          titulo: "Sono Profundo",
          itens: [
            "Ao atingir o nivel 5, o alvo entra em estado Dormindo.",
            "Nao pode realizar acoes, nao possui reacoes, falha automaticamente em testes fisicos.",
            "Recebe +2 em testes de ataque contra ele.",
          ],
        },
        {
          titulo: "Despertar",
          itens: [
            "O estado Dormindo e encerrado se o alvo sofrer dano, for alvo de acao direta que o desperte ou obtiver sucesso em teste de Vontade.",
            "Apos despertar, o alvo retorna ao nivel 2 de Sonolencia.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Inducao Rapida: em caso de falha, o alvo inicia em nivel 2. +1 por graduacao.",
            "Sono Profundo: alvos Dormindo nao despertam automaticamente ao sofrer dano leve (ate metade da graduacao). +1 por graduacao.",
            "Area Sonifera: permite afetar ate 3 alvos em uma area. +2 por graduacao.",
            "Sonolencia Persistente: em caso de sucesso no teste de resistencia, o nivel nao e reduzido. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Calma: falha automaticamente contra alvos em combate intenso ou sob efeitos de adrenalina. -1 por graduacao.",
            "Contato Visual: requer visao direta do alvo. -1 por graduacao.",
            "Sono Instavel: em caso de falha critica do usuario, ele sofre -1 geral por 1 turno. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Estado Sonolento",
          colunas: ["Nivel", "Efeito"],
          linhas: [
            ["1", "-1 em testes gerais"],
            ["2", "-2 em Percepcao e reacoes"],
            ["3", "-2 geral"],
            ["4", "so pode realizar acao OU movimento"],
            ["5", "cai Dormindo"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-sufocamento",
    nome: "Sufocamento",
    naipe: "Copas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+2",
    resumo: "Pressiona a respiracao ate travar acoes.",
    efeitoPrincipal:
      "Testa Constituicao (CD 10 + grad); falha aplica Sufocado nivel 1, evoluindo ate Colapso Respiratorio.",
    extras: [
      { nome: "Pressao Massiva", custo: "+1 por graduacao" },
      { nome: "Asfixia Rapida", custo: "+1 por graduacao" },
      { nome: "Supressao Total", custo: "+1 por graduacao" },
      { nome: "Pressao Persistente", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Proximidade", custo: "-1 por graduacao" },
      { nome: "Canalizacao", custo: "-1 por graduacao" },
      { nome: "Limitado (Respiracao)", custo: "-1 fixo" },
      { nome: "Fluxo Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Sufocamento permite ao usuario converter seu Eter em um fluxo de pressao vital, capaz de interferir diretamente nos processos respiratorios de um alvo.",
        "Esse efeito nao causa dano imediato, mas impoe uma pressao continua que se intensifica ao longo do tempo.",
        "Diferente de outros poderes de controle, Sufocamento nao atua sobre a mente ou decisoes, mas sobre a capacidade fisica do alvo de sustentar sua propria existencia.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo realiza um teste de resistencia (1d20 + Constituicao) contra CD 10 + graduacao.",
            "Sucesso: o efeito e ignorado.",
            "Falha: o alvo entra no estado Sufocado (nivel 1).",
            "Falha critica: o alvo entra diretamente em Sufocado (nivel 2).",
          ],
        },
        {
          titulo: "Progressao",
          itens: [
            "No inicio de cada turno, o alvo realiza um novo teste de Constituicao contra a mesma CD.",
            "Falha: o nivel de Sufocamento aumenta em +1.",
            "Sucesso: o nivel e reduzido em -1.",
          ],
        },
        {
          titulo: "Colapso Respiratorio",
          itens: [
            "Se o alvo estiver no nivel 5 e falhar novamente, entra em Colapso Respiratorio.",
            "A cada nova falha, sofre 1 de dano direto por turno e recebe -3 geral adicional cumulativo.",
            "Esse dano nao e reduzido por Resistencia.",
            "Se o alvo obtiver sucesso em um teste, o nivel e reduzido e o colapso e encerrado imediatamente.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Pressao Massiva: permite afetar ate 2 alvos simultaneamente, dividindo a graduacao entre eles. +1 por graduacao.",
            "Asfixia Rapida: o alvo inicia em nivel 2 em caso de falha. +1 por graduacao.",
            "Supressao Total: o alvo nao pode falar nem utilizar habilidades que dependam de fala. +1 por graduacao.",
            "Pressao Persistente: em caso de sucesso, o nivel de Sufocamento nao e reduzido. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Proximidade: requer contato direto com o alvo para manter o efeito. -1 por graduacao.",
            "Canalizacao: ao sofrer dano, deve realizar teste de Constituicao (CD 10) ou o efeito e encerrado. -1 por graduacao.",
            "Limitado (Respiracao): nao afeta criaturas que nao respiram. -1 fixo.",
            "Fluxo Instavel: em caso de falha critica do usuario, o nivel de Sufocamento e reduzido em 1. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Estado Sufocado",
          colunas: ["Nivel", "Efeito"],
          linhas: [
            ["1", "-1 em testes fisicos"],
            ["2", "-2 em testes fisicos"],
            ["3", "-1 geral"],
            ["4", "-2 geral"],
            ["5", "nao pode realizar acoes padrao"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-voo",
    nome: "Voo",
    naipe: "Copas",
    tipo: "Movimento",
    acao: "Movimento",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Concede deslocamento aereo sustentado.",
    efeitoPrincipal:
      "Substitui o deslocamento terrestre por aereo; velocidade e controle aumentam conforme a graduacao.",
    extras: [
      { nome: "Aceleracao", custo: "+1 por graduacao" },
      { nome: "Manobra Avancada", custo: "+1 fixo" },
      { nome: "Voo Sustentado", custo: "+2 fixo" },
      { nome: "Deslocamento Agil", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Concentracao", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Peso Elevado", custo: "-1 por graduacao" },
      { nome: "Voo Visivel", custo: "-1 fixo" },
    ],
    detalhes: {
      introducao: [
        "Voo permite ao usuario converter seu Eter em um fluxo continuo de sustentacao e propulsao, capaz de interagir diretamente com seu proprio corpo e com o espaco ao redor.",
        "O voo e uma manifestacao puramente mecanica do Eter, voltada exclusivamente para deslocamento.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ao utilizar Voo, o deslocamento terrestre do personagem e substituido por deslocamento aereo enquanto o poder estiver ativo.",
            "O usuario pode se mover livremente em qualquer direcao durante seu turno, incluindo deslocamento horizontal, ascensao e descida.",
          ],
        },
        {
          titulo: "Controle de Manobra",
          itens: [
            "Instavel: sofre -2 em testes ao realizar acoes em voo.",
            "Basico: movimentacao aerea sem penalidades.",
            "Moderado: pode alterar direcao livremente durante o deslocamento.",
            "Avancado: pode realizar acoes complexas sem penalidade.",
            "Preciso: recebe +1 em testes de mobilidade e esquiva em voo.",
          ],
        },
        {
          titulo: "Estabilidade e Queda",
          itens: [
            "Se o usuario sofrer dano enquanto estiver voando, deve realizar um teste de Agilidade (CD 10) para manter o controle.",
            "Em caso de falha, perde estabilidade, descendo ou perdendo altitude imediatamente.",
            "Se o efeito for interrompido, o personagem cai normalmente.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Aceleracao: aumenta em +1 nivel a velocidade na tabela de Voo. +1 por graduacao.",
            "Manobra Avancada: ignora penalidades de controle de manobra. +1 fixo.",
            "Voo Sustentado: nao consome Eter por turno para manutencao. +2 fixo.",
            "Deslocamento Agil: recebe +1 em testes de esquiva em voo. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Concentracao: ao sofrer dano, deve realizar teste de Agilidade (CD 10) ou o efeito e encerrado. -1 por graduacao.",
            "Instavel: sempre tratado como um nivel abaixo na tabela de controle. -1 por graduacao.",
            "Peso Elevado: nao pode transportar outras criaturas; carga adicional reduz a velocidade em um nivel. -1 por graduacao.",
            "Voo Visivel: o deslocamento deixa sinais visuais evidentes. -1 fixo.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Tabela de Voo",
          colunas: ["Graduacao", "Velocidade", "Controle"],
          linhas: [
            ["1â€“2", "deslocamento base", "instavel"],
            ["3â€“4", "+50%", "basico"],
            ["5â€“6", "x2", "moderado"],
            ["7â€“8", "x3", "avancado"],
            ["9â€“10", "x4", "preciso"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-confusao",
    nome: "Confusao",
    naipe: "Copas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Desorganiza decisoes e gera comportamento caotico.",
    efeitoPrincipal:
      "Testa Vontade (CD 10 + grad); falha aplica estado Confuso com comportamento aleatorio por turno via 1d20.",
    extras: [
      { nome: "Confusao Intensificada", custo: "+1 por graduacao" },
      { nome: "Contagioso", custo: "+1 por graduacao" },
      { nome: "Salvamento Alternativo", custo: "+0" },
      { nome: "Incuravel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Sentido", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Imprevisto", custo: "-1 por graduacao" },
      { nome: "Alcance Reduzido", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Confusao permite ao usuario converter seu Eter em um fluxo psiquico instavel, capaz de interferir diretamente nos processos cognitivos de um alvo.",
        "Em vez de impor comandos, o Eter altera a forma como o alvo interpreta informacoes e reage ao ambiente, levando a comportamentos inconsistentes e respostas imprevisiveis.",
        "Diferente de controle mental direto, Confusao nao determina acoes especificas, mas distorce o processo que leva a decisao.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo realiza um teste de resistencia (1d20 + Vontade) contra CD 10 + graduacao.",
            "Sucesso: o efeito e ignorado.",
            "Falha: o alvo fica Confuso enquanto o poder for mantido.",
            "Falha critica: o alvo fica Confuso e nao pode realizar o teste de resistencia no turno seguinte.",
          ],
        },
        {
          titulo: "Estado â€” Confuso",
          itens: [
            "No inicio de cada turno do alvo, role 1d20 para determinar seu comportamento naquele turno.",
            "1â€“2: sofre -1 geral e desvantagem em uma categoria de acao.",
            "3â€“4: sofre -1 geral no turno.",
            "5â€“6: pode realizar apenas acao ou movimento.",
            "7â€“8: sofre -2 em testes de ataque.",
            "9â€“10: deve escolher um alvo aleatorio valido.",
            "11â€“12: sofre -2 em Defesa ate o proximo turno.",
            "13â€“14: sofre -2 em Percepcao e reacoes.",
            "15â€“16: realiza a acao com -1 geral.",
            "17â€“18: age normalmente.",
            "19: age normalmente e recebe +1 em todos os testes no turno.",
            "20: age normalmente e recebe +2 no proximo teste de resistencia contra Confusao.",
          ],
        },
        {
          titulo: "Manutencao",
          itens: [
            "O alvo pode tentar se libertar no inicio de cada turno realizando um novo teste de Vontade contra a mesma CD.",
            "Cada tentativa concede um bonus cumulativo de +1 nesse teste.",
            "Apos 3 turnos consecutivos sob efeito, o alvo passa a realizar esses testes com vantagem.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Confusao Intensificada: rola 2d20 e utiliza o pior resultado na tabela (limitado a resultados ate 14). +1 por graduacao.",
            "Contagioso: ao aplicar o efeito, um segundo alvo adjacente tambem realiza o teste com +2 na CD de resistencia. +1 por graduacao.",
            "Salvamento Alternativo: o teste de resistencia passa a utilizar Constituicao em vez de Vontade. +0.",
            "Incuravel: o efeito nao pode ser removido por meios externos. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Sentido: requer condicao especifica para funcionar. -1 por graduacao.",
            "Limitado: afeta apenas um tipo especifico de alvo. -1 por graduacao.",
            "Imprevisto: em caso de falha critica na ativacao, o usuario fica Confuso por 1 turno. -1 por graduacao.",
            "Alcance Reduzido: requer maior proximidade para ser utilizado. -1 por graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "copas-onda-psiquica",
    nome: "Onda Psiquica",
    naipe: "Copas",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "Percepcao",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Ataca a mente com dano psiquico direto.",
    efeitoPrincipal:
      "Testa Vontade (CD 10 + grad); dano mental igual a metade da graduacao, nao reduzido por Resistencia; aplica estado Desestabilizado.",
    extras: [
      { nome: "Onda Devastadora", custo: "+1 por graduacao" },
      { nome: "Impacto Mental", custo: "+1 por graduacao" },
      { nome: "Influencia Sutil", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Foco Necessario", custo: "-1 por graduacao" },
      { nome: "Repercussao", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Mente Resistente", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Onda Psiquica permite ao usuario converter seu Eter em um fluxo mental agressivo, projetando uma descarga direta contra a mente de um alvo.",
        "Por se tratar de uma aplicacao puramente psiquica do Eter, o efeito ignora barreiras fisicas que nao bloqueiem percepcao.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo realiza um teste de resistencia (1d20 + Vontade) contra CD 10 + graduacao.",
            "Sucesso: o alvo sofre metade do dano (arredondado para baixo) e nao recebe efeitos adicionais.",
            "Falha: o alvo sofre dano total e passa a ficar Desestabilizado.",
            "Falha critica: alem do dano total, o estado aplicado e intensificado em +1 nivel.",
          ],
        },
        {
          titulo: "Dano",
          itens: [
            "O dano da Onda Psiquica e igual a metade da graduacao (arredondado para baixo).",
            "Esse dano nao soma com Dano Base, e tratado como dano mental e nao e reduzido por Resistencia.",
          ],
        },
        {
          titulo: "Estado â€” Desestabilizado",
          itens: [
            "1â€“2: -1 em testes de Vontade.",
            "3â€“4: -1 em Vontade e Percepcao.",
            "5â€“6: -2 em Vontade.",
            "7â€“8: -2 em Vontade e Percepcao.",
            "9â€“10: -3 em Vontade e -2 em Percepcao.",
            "Os efeitos nao se acumulam. O estado dura ate o final do proximo turno do alvo.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Onda Devastadora: recebe +1 de dano. +1 por graduacao.",
            "Impacto Mental: aumenta o efeito aplicado em +1 nivel na tabela. +1 por graduacao.",
            "Influencia Sutil: o alvo nao percebe automaticamente a origem do ataque. +1 fixo.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Foco Necessario: sofre -2 no teste de ativacao. -1 por graduacao.",
            "Repercussao: apos usar o poder, sofre -1 em testes de Vontade ate o proximo turno. -1 por graduacao.",
            "Limitado: nao afeta criaturas sem mente ou consciencia. -1 por graduacao.",
            "Mente Resistente: alvos que resistem recebem +2 contra novas tentativas ate o fim da cena. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Onda Psiquica â€” Estado Desestabilizado",
          colunas: ["Graduacao", "Intensidade", "Efeito"],
          linhas: [
            ["1â€“2", "leve", "-1 em testes de Vontade"],
            ["3â€“4", "leve", "-1 em Vontade e Percepcao"],
            ["5â€“6", "moderado", "-2 em Vontade"],
            ["7â€“8", "forte", "-2 em Vontade e Percepcao"],
            ["9â€“10", "intenso", "-3 em Vontade e -2 em Percepcao"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-comunicacao-mental",
    nome: "Comunicacao Mental",
    naipe: "Copas",
    tipo: "Sensorial",
    acao: "Livre",
    alcance: "Graduacao",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 1,
    custoPontosTexto: "1 ponto por graduacao",
    custoEterBase: "padrao",
    resumo: "Liga mentes para comunicacao instantanea.",
    efeitoPrincipal:
      "Estabelece vinculo mental com alvos conscientes dentro do alcance; comunicacao silenciosa em ambas as direcoes.",
    extras: [
      { nome: "Transmissao Sensorial", custo: "+1 por graduacao" },
      { nome: "Canal Ampliado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Contato Conhecido", custo: "-1 por graduacao" },
      { nome: "Alcance Reduzido", custo: "-1 por graduacao" },
      { nome: "Ruido Mental", custo: "-1 por graduacao" },
      { nome: "Canal Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Comunicacao Mental permite ao usuario converter seu Eter em um fluxo psiquico estavel, estabelecendo vinculos diretos entre mentes.",
        "A comunicacao e silenciosa, instantanea e independe de linha de visao, desde que o alvo esteja dentro do alcance da tecnica.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario escolhe um ou mais alvos dentro do alcance permitido pela graduacao.",
            "Enquanto o poder estiver ativo, a comunicacao ocorre de forma instantanea e em ambas as direcoes.",
            "A conexao exige que os alvos possuam mente consciente e sejam capazes de participar voluntariamente do vinculo.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Transmissao Sensorial: permite compartilhar imagens, sons e sensacoes entre os participantes. +1 por graduacao.",
            "Canal Ampliado: aumenta em +2 o numero de alvos simultaneos conectados. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Contato Conhecido: requer que o usuario conheca previamente o alvo. -1 por graduacao.",
            "Alcance Reduzido: a distancia maxima e reduzida pela metade. -1 por graduacao.",
            "Ruido Mental: sofre -2 ao estabelecer a conexao em ambientes caoticos. -1 por graduacao.",
            "Canal Instavel: ao sofrer dano, deve realizar teste de Vontade (CD 10) ou a conexao e interrompida. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Escala de Comunicacao Mental",
          colunas: ["Graduacao", "Distancia Maxima", "Alvos Simultaneos"],
          linhas: [
            ["1â€“2", "ate 10 m", "1"],
            ["3â€“4", "ate 100 m", "2"],
            ["5â€“6", "ate 1 km", "3"],
            ["7â€“8", "ate 10 km", "5"],
            ["9â€“10", "ate 100 km", "8"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-ilusao",
    nome: "Ilusao",
    naipe: "Copas",
    tipo: "Sensorial / Controle",
    acao: "Padrao",
    alcance: "Percepcao",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Cria estimulos falsos que enganam os sentidos.",
    efeitoPrincipal:
      "Cria uma ilusao sensorial na area; alvos testam Vontade apenas ao interagir; falha aplica estado Enganado.",
    extras: [
      { nome: "Seletivo", custo: "+1 por graduacao" },
      { nome: "Duracao Estendida", custo: "+1 por graduacao" },
      { nome: "Ilusao Persistente", custo: "+1 por graduacao" },
      { nome: "Ilusao Convincente", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Alcance Reduzido", custo: "-1 por graduacao" },
      { nome: "Retroalimentacao", custo: "-1 por graduacao" },
      { nome: "Fragilidade Sensorial", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Ilusao permite ao usuario converter seu Eter em um fluxo sensorial capaz de simular estimulos e alterar a percepcao da realidade dentro de uma area.",
        "A ilusao nao possui existencia fisica, manifestando-se como uma interferencia direta na forma como o ambiente e percebido.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ao utilizar Ilusao, o usuario define uma area dentro do alcance e determina a forma, comportamento e natureza sensorial da ilusao criada.",
            "Os alvos nao realizam testes imediatamente. Um teste de resistencia so e exigido quando o alvo interage com a ilusao, desconfia dela ou recebe evidencia contraditoria.",
            "Sucesso: a ilusao e reconhecida como falsa.",
            "Falha: o alvo passa a ser considerado Enganado.",
            "Falha critica: o alvo aceita a ilusao como completamente realista.",
          ],
        },
        {
          titulo: "Estado â€” Enganado",
          itens: [
            "Sofre -2 em testes de Percepcao.",
            "Sofre -1 em testes de ataque contra alvos que nao percebe corretamente.",
            "Sofre -1 em testes de Vontade contra efeitos do usuario.",
            "O estado termina quando o alvo identifica a ilusao, recebe evidencia clara de inconsistencia ou o poder deixa de ser sustentado.",
          ],
        },
        {
          titulo: "Area e Complexidade",
          itens: [
            "Area base de 2 metros de raio, aumentando em +1 metro a cada 2 graduacoes.",
            "Graduacao 1: estimulo simples. Grad 3: movimento basico. Grad 5: comportamento convincente. Grad 7: cena dinamica. Grad 9: altamente realista. Grad 10: imersao sensorial completa.",
            "Visao conta como 2 sentidos para o limite de sentidos afetados (grad 1-2: 1 sentido; grad 3-4: 2; grad 5-6: 3; grad 7-8: 4; grad 9-10: todos).",
          ],
        },
        {
          titulo: "Regras Importantes",
          itens: [
            "Ilusoes nao possuem massa e nao interagem fisicamente com o ambiente.",
            "Nao bloqueiam ataques nem concedem cobertura real.",
            "Nao causam dano direto.",
            "Quando um alvo identifica a ilusao como falsa, outros alvos recebem +2 no teste de resistencia contra o mesmo efeito.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Seletivo: permite escolher quais alvos sao afetados pela ilusao. +1 por graduacao.",
            "Duracao Estendida: a ilusao nao exige concentracao e permanece ativa por ate 3 turnos. +1 por graduacao.",
            "Ilusao Persistente: a ilusao continua ativa mesmo fora do alcance do usuario. +1 por graduacao.",
            "Ilusao Convincente: recebe +2 na CD para perceber a ilusao. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Limitado: afeta apenas um alvo. -1 por graduacao.",
            "Alcance Reduzido: requer proximidade para ser utilizada. -1 por graduacao.",
            "Retroalimentacao: se a ilusao for descoberta, o usuario sofre -1 geral por 1 turno. -1 por graduacao.",
            "Fragilidade Sensorial: interacoes fisicas concedem +5 no teste de resistencia. -1 por graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "copas-drenar",
    nome: "Drenar",
    naipe: "Copas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "+2",
    resumo: "Retira Eter do alvo e pode recuperar o seu.",
    efeitoPrincipal:
      "Testa Vontade (CD 10 + grad); falha drena Eter do alvo conforme graduacao; pode converter drenagem em recuperacao propria.",
    extras: [
      { nome: "Drenagem Amplificada", custo: "+1 por graduacao" },
      { nome: "Drenagem em Area", custo: "+1 por graduacao" },
      { nome: "Drenagem Persistente", custo: "+1 por graduacao" },
      { nome: "Ruptura Energetica", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Contato Fisico", custo: "-1 por graduacao" },
      { nome: "Somente Drenagem", custo: "-1 por graduacao" },
      { nome: "Dependente de Conexao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Drenar permite ao usuario converter seu Eter em um fluxo de absorcao, capaz de se conectar diretamente ao Eter de outra criatura e extrair parte de sua energia.",
        "O Eter drenado pode ser dissipado ou redirecionado pelo usuario, dependendo de sua escolha no momento da ativacao.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo realiza um teste de resistencia (1d20 + Vontade) contra CD 10 + graduacao.",
            "Sucesso: a drenagem e reduzida a metade (arredondado para baixo).",
            "Falha: o alvo sofre a drenagem total.",
            "Falha critica: a drenagem e aumentada em +1.",
          ],
        },
        {
          titulo: "Conversao de Energia",
          itens: [
            "O usuario pode optar por converter o Eter drenado em recuperacao propria, restaurando uma quantidade igual ao valor efetivamente drenado.",
            "A recuperacao nao pode ultrapassar o valor maximo de Eter do usuario.",
          ],
        },
        {
          titulo: "Efeitos sobre o Alvo",
          itens: [
            "Se o alvo atingir 0 de Eter, nao pode utilizar habilidades que consumam esse recurso.",
            "Todos os efeitos sustentados sao encerrados imediatamente.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Drenagem Amplificada: aumenta a drenagem em +1. +1 por graduacao.",
            "Drenagem em Area: permite afetar multiplos alvos, dividindo o valor drenado entre eles. +1 por graduacao.",
            "Drenagem Persistente: no inicio do proximo turno do alvo, sofre metade da drenagem aplicada. +1 por graduacao.",
            "Ruptura Energetica: se o alvo atingir 0 de Eter, sofre -2 geral por 1 turno. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Contato Fisico: o alcance passa a ser Toque. -1 por graduacao.",
            "Somente Drenagem: o Eter extraido nao pode ser convertido para o usuario. -1 por graduacao.",
            "Dependente de Conexao: nao afeta alvos protegidos por efeitos que bloqueiem fluxo energetico. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Drenagem de Eter",
          colunas: ["Graduacao", "Eter Drenado"],
          linhas: [
            ["1â€“2", "1"],
            ["3â€“4", "2"],
            ["5â€“6", "3"],
            ["7â€“8", "4"],
            ["9â€“10", "5"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-compreensao",
    nome: "Compreensao",
    naipe: "Copas",
    tipo: "Sensorial",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Continuo",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Traduz linguagens e sinais automaticamente.",
    efeitoPrincipal:
      "Interpreta automaticamente qualquer forma de comunicacao compativel com a graduacao; sem testes necessarios.",
    extras: [
      { nome: "Comunicacao Assistida", custo: "+1 por graduacao" },
      { nome: "Compartilhamento", custo: "+1 por graduacao" },
      { nome: "Leitura Residual", custo: "+1 por graduacao" },
      { nome: "Interpretacao Avancada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Restrito", custo: "-2 por graduacao" },
      { nome: "Concentracao", custo: "-1 por graduacao" },
      { nome: "Ruido Interpretativo", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Compreensao permite ao usuario converter seu Eter em um fluxo sensorial interpretativo, capaz de decodificar sinais, padroes e formas de comunicacao.",
        "A tecnica nao cria conteudo nem altera o comportamento do alvo, limitando-se ao entendimento daquilo que e efetivamente comunicado.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Compreensao e um efeito continuo e nao exige testes.",
            "Enquanto ativo, o usuario interpreta automaticamente qualquer linguagem ou sistema de comunicacao compativel com sua graduacao.",
            "Quando aplicavel, tambem pode se expressar nesse mesmo sistema.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Comunicacao Assistida: permite se expressar com clareza total em qualquer sistema compreendido. +1 por graduacao.",
            "Compartilhamento: permite estender o efeito a aliados proximos. +1 por graduacao.",
            "Leitura Residual: permite interpretar vestigios de informacao presentes em objetos. +1 por graduacao.",
            "Interpretacao Avancada: reduz ambiguidades na informacao recebida. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Limitado: funciona apenas para uma categoria especifica de comunicacao. -1 por graduacao.",
            "Restrito: funciona apenas para um subconjunto especifico dentro da categoria. -2 por graduacao.",
            "Concentracao: requer foco ativo para funcionar. -1 por graduacao.",
            "Ruido Interpretativo: as informacoes podem ser parciais ou distorcidas. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Nivel de Compreensao",
          colunas: ["Graduacao", "Capacidade"],
          linhas: [
            ["1â€“2", "formas simples (sons, gestos, padroes basicos)"],
            ["3â€“4", "linguagem estruturada (idiomas, codigos simples)"],
            [
              "5â€“6",
              "sistemas complexos (linguagens escritas, cifradas, tecnicas)",
            ],
            [
              "7â€“8",
              "sistemas nao convencionais (maquinas, entidades, padroes abstratos)",
            ],
            [
              "9â€“10",
              "qualquer forma de linguagem ou consciencia compreensivel",
            ],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-fogo",
    nome: "Manipulacao de Fogo",
    naipe: "Copas",
    tipo: "Ataque / Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Aplica chamas, dano continuo e pressao.",
    efeitoPrincipal:
      "Ataca com dano igual a graduacao; alvo atingido entra em Ignicao com dano continuo; intensificacao progressiva se reatingido.",
    extras: [
      { nome: "Area Ofensiva", custo: "+1 por graduacao" },
      { nome: "Propagacao Acelerada", custo: "+1 por graduacao" },
      { nome: "Combustao Inicial", custo: "+1 por graduacao" },
      { nome: "Calor Opressivo", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Dependente do Ambiente", custo: "-1 por graduacao" },
      { nome: "Consumo Excessivo", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Fogo permite ao usuario converter seu Eter em um fluxo termico instavel, manifestando chamas que podem ser projetadas, sustentadas e controladas no campo de batalha.",
        "O fogo nao se limita ao impacto inicial. Ele permanece ativo no ambiente, criando zonas perigosas e impondo pressao continua sobre alvos expostos.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Acerto: o alvo sofre dano igual a graduacao e entra em estado de Ignicao.",
          ],
        },
        {
          titulo: "Passiva â€” Ignicao",
          itens: [
            "Todo alvo atingido entra automaticamente em estado de Ignicao.",
            "Um alvo sob Ignicao sofre dano continuo no inicio de cada um de seus turnos, conforme indicado na tabela.",
            "Esse dano e reduzido normalmente pela Resistencia.",
            "A Ignicao pode ser removida por: gasto de acao para apagar as chamas, uso de agua ou efeito equivalente, ou acao narrativa coerente.",
            "No inicio de cada turno, o alvo pode realizar um teste de Constituicao (CD 10 + graduacao): Sucesso: reduz a Ignicao em 1 (minimo 0); Sucesso critico: remove completamente.",
          ],
        },
        {
          titulo: "Intensificacao",
          itens: [
            "Se um alvo que ja esteja sob Ignicao for novamente atingido, o efeito se torna Intensificado.",
            "Enquanto estiver Intensificado: o dano continuo aumenta em +1 a cada 2 turnos consecutivos.",
            "O bonus acumulado nao pode ultrapassar metade da graduacao (arredondado para baixo).",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area Ofensiva: permite aplicar dano em area, seguindo as regras gerais do sistema. +1 por graduacao.",
            "Propagacao Acelerada: aumenta a area maxima da tecnica em 50%. +1 por graduacao.",
            "Combustao Inicial: a Ignicao aplicada ja conta como estando em Intensificacao. +1 por graduacao.",
            "Calor Opressivo: alvos sob Ignicao sofrem -1 em testes que exigem concentracao. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Instavel: o fogo pode se expandir alem do controle. -1 por graduacao.",
            "Dependente do Ambiente: ambientes desfavoraveis reduzem a area maxima em 25%. -1 por graduacao.",
            "Consumo Excessivo: sofre -1 em testes enquanto sustenta o poder ativo. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Escala de Manipulacao de Fogo",
          colunas: ["Graduacao", "Ignicao", "Area", "Escala"],
          linhas: [
            ["1â€“2", "1", "1,5 m", "contato com chamas"],
            ["3â€“4", "2", "3 m", "criacao de area"],
            ["5â€“6", "3", "6 m", "fogo persistente"],
            ["7â€“8", "4", "9 m", "controle avancado"],
            ["9â€“10", "5", "15 m", "dominio de area"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-agua",
    nome: "Manipulacao de Agua",
    naipe: "Copas",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Reposiciona alvos com fluxo e pressao.",
    efeitoPrincipal:
      "Ataca com dano igual a graduacao e aplica Fluxo (deslocamento forcado); pode usar apenas controle sem dano.",
    extras: [
      { nome: "Area Ofensiva", custo: "+1 por graduacao" },
      { nome: "Criacao de Agua", custo: "+1 por graduacao" },
      { nome: "Pressao Hidraulica", custo: "+1 por graduacao" },
      { nome: "Fluxo Aprimorado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Ambiente", custo: "-1 por graduacao" },
      { nome: "Dispersao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Agua permite ao usuario converter seu Eter em um fluxo liquido dinamico, capaz de interagir com agua existente ou gerada, controlando sua forma, direcao e pressao.",
        "O poder nao se destaca pelo impacto bruto, mas pela capacidade de reposicionar, redirecionar e desorganizar continuamente o campo de batalha.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Acerto: o alvo sofre dano igual a graduacao e o efeito de Fluxo e aplicado.",
            "O usuario pode optar por nao causar dano e apenas aplicar controle.",
          ],
        },
        {
          titulo: "Mecanica Central â€” Fluxo",
          itens: [
            "Ao aplicar Fluxo, o usuario escolhe uma direcao: empurrar, puxar ou deslocar lateralmente.",
            "O alvo e movido em ate 1 metro a cada 2 graduacoes.",
            "Esse deslocamento nao provoca ataques de oportunidade e pode ser aplicado uma vez por turno por alvo.",
            "Se um alvo colidir com um obstaculo solido, sofre +1 de dano a cada 2 graduacoes.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area Ofensiva: permite aplicar dano em area, seguindo as regras gerais do sistema. +1 por graduacao.",
            "Criacao de Agua: permite gerar agua potavel. +1 por graduacao.",
            "Pressao Hidraulica: recebe +1 de dano em ataques diretos. +1 por graduacao.",
            "Fluxo Aprimorado: aumenta o deslocamento do Fluxo em +1 metro. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Ambiente: requer presenca de agua para funcionar. -1 por graduacao.",
            "Dispersao: se nao for sustentado, o efeito se dissipa imediatamente. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Escala de Manipulacao de Agua",
          colunas: ["Graduacao", "Deslocamento", "Area", "Escala"],
          linhas: [
            ["1â€“2", "1 m", "1,5 m", "fluxo basico"],
            ["3â€“4", "2 m", "3 m", "controle estavel"],
            ["5â€“6", "3 m", "6 m", "reposicionamento"],
            ["7â€“8", "4 m", "9 m", "controle em area"],
            ["9â€“10", "5â€“6 m", "15 m", "dominio de campo"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-vento",
    nome: "Manipulacao de Vento",
    naipe: "Copas",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Derruba, desestabiliza e pressiona a distancia.",
    efeitoPrincipal:
      "Ataca com dano igual a graduacao; alvo testa Agilidade (CD 10 + grad): falha cai; sucesso sofre -1 em ataques.",
    extras: [
      { nome: "Area Ofensiva", custo: "+1 por graduacao" },
      { nome: "Controle Preciso", custo: "+1 fixo" },
      { nome: "Laminas de Vento", custo: "+1 por graduacao" },
      { nome: "Escudo de Vento", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Ambiente Fechado", custo: "-1 por graduacao" },
      { nome: "Dependente de Ar", custo: "-1 por graduacao" },
      { nome: "Disperso", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Vento permite ao usuario converter seu Eter em um fluxo de pressao atmosferica, projetando rajadas e turbulencias que interferem diretamente na estabilidade e no controle corporal dos alvos.",
        "O vento nao causa dano continuo nem mantem controle prolongado â€” sua funcao e desestabilizar instantaneamente.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Acerto: o alvo sofre dano igual a graduacao e deve realizar um teste de Agilidade (CD 10 + graduacao).",
            "Falha no teste de Agilidade: o alvo fica Caido.",
            "Sucesso no teste de Agilidade: o alvo sofre -1 em testes de ataque ate o final do proximo turno.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area Ofensiva: permite aplicar dano em area, seguindo as regras gerais do sistema. +1 por graduacao.",
            "Controle Preciso: nao afeta aliados. +1 fixo.",
            "Laminas de Vento: o dano passa a ser considerado cortante e recebe +1 de dano. +1 por graduacao.",
            "Escudo de Vento: concede -1 em ataques a distancia contra o usuario. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Ambiente Fechado: reduz a eficacia do poder em espacos confinados. -1 por graduacao.",
            "Dependente de Ar: nao funciona na ausencia de atmosfera. -1 por graduacao.",
            "Disperso: dificuldade em manter a precisao do fluxo de vento. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Area de Manipulacao de Vento",
          colunas: ["Graduacao", "Area", "Escala"],
          linhas: [
            ["1â€“2", "1,5 m", "impacto leve"],
            ["3â€“4", "3 m", "instabilidade basica"],
            ["5â€“6", "6 m", "pressao consistente"],
            ["7â€“8", "9 m", "turbulencia"],
            ["9â€“10", "15 m", "dominio do fluxo"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-eletricidade",
    nome: "Manipulacao de Eletricidade",
    naipe: "Copas",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Causa choque rapido com propagacao em cadeia.",
    efeitoPrincipal:
      "Ataca com dano igual a graduacao; alvo testa Constituicao (CD 10 + grad): falha fica Atordoado; descarga propaga para alvos proximos.",
    extras: [
      { nome: "Area Ofensiva", custo: "+1 por graduacao" },
      { nome: "Corrente Aprimorada", custo: "+1 por graduacao" },
      { nome: "Sobrecarga", custo: "+1 por graduacao" },
      { nome: "Descarga Precisa", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Conducao", custo: "-1 por graduacao" },
      { nome: "Isolado", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Eletricidade permite ao usuario converter seu Eter em descargas energeticas de alta intensidade, capazes de percorrer rapidamente entre alvos e interferir diretamente em seus impulsos nervosos.",
        "Diferente de outros elementos, a eletricidade nao atua de forma continua â€” seu efeito e imediato, rapido e capaz de se propagar entre alvos proximos.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Acerto: o alvo sofre dano igual a graduacao e realiza o teste de Choque.",
            "Falha no teste de Constituicao (CD 10 + grad): o alvo fica Atordoado.",
            "Sucesso no teste: sofre apenas o dano.",
          ],
        },
        {
          titulo: "Propagacao",
          itens: [
            "Sempre que um alvo falhar no teste de Choque, a descarga pode se propagar para outro alvo proxximo (ate 3 metros).",
            "O novo alvo realiza o teste de Choque normalmente.",
            "A cada salto, o alvo recebe +1 cumulativo no teste de resistencia.",
            "A propagacao nao causa dano, so pode atingir cada alvo uma vez e deve respeitar o alcance da tecnica.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area Ofensiva: permite aplicar dano em area, seguindo as regras gerais do sistema. +1 por graduacao.",
            "Corrente Aprimorada: aumenta o numero maximo de alvos afetados em +1. +1 por graduacao.",
            "Sobrecarga: aumenta o dano em +1. +1 por graduacao.",
            "Descarga Precisa: recebe +1 no teste de ataque. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Conducao: requer proximidade ou meio condutor para propagacao. -1 por graduacao.",
            "Isolado: menos eficaz contra alvos protegidos eletricamente. -1 por graduacao.",
            "Instavel: a descarga pode atingir alvos proximos nao intencionais. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Escala de Manipulacao de Eletricidade",
          colunas: ["Graduacao", "Area", "Propagacao", "Escala"],
          linhas: [
            ["1â€“2", "1,5 m", "1", "impacto leve"],
            ["3â€“4", "3 m", "2", "descarga inicial"],
            ["5â€“6", "6 m", "3", "corrente eletrica"],
            ["7â€“8", "9 m", "4", "sobrecarga"],
            ["9â€“10", "15 m", "5â€“6", "dominio eletrico"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-terra",
    nome: "Manipulacao de Terra",
    naipe: "Copas",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Molda solo e pedra para controlar o campo.",
    efeitoPrincipal:
      "Ataca com dano igual a graduacao; alvo testa Forca (CD 10 + grad): falha reduz deslocamento; falha critica Imobiliza.",
    extras: [
      { nome: "Area Ofensiva", custo: "+1 por graduacao" },
      { nome: "Criacao de Terra", custo: "+1 por graduacao" },
      { nome: "Fixacao Intensa", custo: "+1 por graduacao" },
      { nome: "Dominio do Terreno", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Solo", custo: "-1 por graduacao" },
      { nome: "Lento", custo: "-1 por graduacao" },
      { nome: "Rigidez", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Terra permite ao usuario converter seu Eter em materia solida, controlando solo, rocha e minerais como uma extensao direta de sua vontade.",
        "A terra nao atua com velocidade nem com efeitos agressivos imediatos, mas com estabilidade e imposicao fisica, restringindo movimento e dominando espaco.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Acerto: o alvo sofre dano igual a graduacao e deve realizar o teste de Fixacao.",
            "Falha no teste de Forca (CD 10 + grad): deslocamento reduzido pela metade ate o final do proximo turno.",
            "Falha critica: fica Imobilizado ate o final do proximo turno.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area Ofensiva: permite aplicar dano em area, seguindo as regras gerais do sistema. +1 por graduacao.",
            "Criacao de Terra: permite gerar terra ou rocha sem fonte existente. +1 por graduacao.",
            "Fixacao Intensa: falhas aplicam Imobilizado em vez de reducao de movimento. +1 por graduacao.",
            "Dominio do Terreno: alvos afetados sofrem -1 em testes de movimento enquanto estiverem na area. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Solo: requer terra ou rocha para funcionar. -1 por graduacao.",
            "Lento: o ataque concede +1 na Defesa do alvo. -1 por graduacao.",
            "Rigidez: nao pode realizar manipulacoes precisas ou delicadas. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Escala de Manipulacao de Terra",
          colunas: ["Graduacao", "Area", "Escala"],
          linhas: [
            ["1â€“2", "1,5 m", "contato com solo"],
            ["3â€“4", "3 m", "controle basico"],
            ["5â€“6", "6 m", "terreno alterado"],
            ["7â€“8", "9 m", "contencao"],
            ["9â€“10", "15 m", "dominio do terreno"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-gelo",
    nome: "Manipulacao de Gelo",
    naipe: "Copas",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Acumula congelamento e reduz mobilidade.",
    efeitoPrincipal:
      "Ataca com dano igual a graduacao; cada acerto aplica 1 nivel de Congelamento; progressao ate Imobilizado.",
    extras: [
      { nome: "Congelamento Intensificado", custo: "+1 por graduacao" },
      { nome: "Area Ofensiva", custo: "+1 por graduacao" },
      { nome: "Congelamento Profundo", custo: "+1 por graduacao" },
      { nome: "Gelo Reforcado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Umidade", custo: "-1 por graduacao" },
      { nome: "Sensivel ao Calor", custo: "-1 por graduacao" },
      { nome: "Lento", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Gelo permite ao usuario converter seu Eter em um fluxo termico negativo, reduzindo rapidamente a temperatura do ambiente e solidificando a umidade presente.",
        "Diferente de outros elementos, o gelo nao atua por impacto imediato, mas por acumulo continuo, tornando-se mais perigoso quanto mais tempo permanece ativo.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Acerto: o alvo sofre dano igual a graduacao e recebe 1 nivel de Congelamento.",
            "Um mesmo alvo so pode receber 1 nivel de Congelamento por turno por fonte.",
          ],
        },
        {
          titulo: "Acumulo e Reducao",
          itens: [
            "O Congelamento se acumula a cada nova aplicacao, ate o limite definido pela graduacao da tecnica.",
            "No inicio de cada turno, o alvo pode realizar um teste de Constituicao (CD 10 + graduacao).",
            "Sucesso: reduz 1 nivel de Congelamento. Sucesso critico: reduz 2 niveis. Falha: mantem o nivel atual.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Congelamento Intensificado: alvos afetados sofrem -1 no proximo teste para remover Congelamento. +1 por graduacao.",
            "Area Ofensiva: permite aplicar dano em area, seguindo as regras gerais do sistema. +1 por graduacao.",
            "Congelamento Profundo: em caso de falha critica do alvo, aplica +1 nivel adicional de Congelamento. +1 por graduacao.",
            "Gelo Reforcado: alvos com 3 ou mais niveis de Congelamento sofrem -1 adicional em testes fisicos. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Umidade: requer presenca de agua no ambiente. -1 por graduacao.",
            "Sensivel ao Calor: ambientes quentes reduzem a eficacia do poder. -1 por graduacao.",
            "Lento: o ataque concede +1 na Defesa do alvo. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Estado Congelamento",
          colunas: ["Nivel", "Efeito"],
          linhas: [
            ["1", "deslocamento reduzido pela metade"],
            ["2", "deslocamento reduzido e -1 em testes fisicos"],
            ["3", "deslocamento 0"],
            ["4", "Imobilizado"],
            ["5", "Imobilizado e -1 adicional em testes fisicos"],
            ["6", "Imobilizado e -2 em testes fisicos"],
          ],
        },
        {
          titulo: "Limite de Congelamento",
          colunas: ["Graduacao", "Limite", "Area", "Escala"],
          linhas: [
            ["1â€“2", "2", "1,5 m", "frio superficial"],
            ["3â€“4", "3", "3 m", "lentidao"],
            ["5â€“6", "4", "6 m", "rigidez"],
            ["7â€“8", "5", "9 m", "travamento"],
            ["9â€“10", "6", "15 m", "congelamento total"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-plantas",
    nome: "Manipulacao de Plantas",
    naipe: "Copas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Enrosca, restringe e controla vegetacao.",
    efeitoPrincipal:
      "Cada acerto aplica 1 nivel de Enroscado; penalidades crescentes ate estado Contido.",
    extras: [
      { nome: "Enroscamento Acelerado", custo: "+1 por graduacao" },
      { nome: "Area Ofensiva", custo: "+1 por graduacao" },
      { nome: "Crescimento Acelerado", custo: "+1 por graduacao" },
      { nome: "Enraizamento Total", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Vegetacao", custo: "-1 por graduacao" },
      { nome: "Fragil", custo: "-1 por graduacao" },
      { nome: "Lento", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Plantas permite ao usuario converter seu Eter em um fluxo vital que estimula o crescimento e movimento da vegetacao.",
        "CipÃ³s, raizes e estruturas vegetais se acumulam ao redor do alvo, tornando-se mais opressivos quanto mais o alvo falha em resistir.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Acerto: o alvo recebe 1 nivel de Enroscado.",
            "O usuario pode manter o efeito para continuar pressionando o alvo em turnos seguintes.",
          ],
        },
        {
          titulo: "Reducao",
          itens: [
            "No inicio de cada turno, o alvo pode realizar um teste de Forca (CD 10 + graduacao).",
            "Sucesso: reduz 1 nivel de Enroscado.",
            "Falha: o efeito permanece.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Enroscamento Acelerado: aplica +1 nivel adicional ao atingir. +1 por graduacao.",
            "Area Ofensiva: permite aplicar o efeito em area, seguindo as regras gerais do sistema. +1 por graduacao.",
            "Crescimento Acelerado: permite gerar vegetacao sem fonte existente. +1 por graduacao.",
            "Enraizamento Total: falhas criticas aplicam Imobilizado independentemente do nivel atual. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Vegetacao: requer presenca de plantas no ambiente. -1 por graduacao.",
            "Fragil: o efeito pode ser removido com acoes fisicas simples. -1 por graduacao.",
            "Lento: o ataque concede +1 na Defesa do alvo. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Estado Enroscado",
          colunas: ["Nivel", "Efeito"],
          linhas: [
            ["1", "-1 em testes fisicos"],
            ["2", "-1 em todos os testes"],
            ["3", "-2 em todos os testes"],
            ["4", "-2 em todos os testes e deslocamento reduzido pela metade"],
            ["5", "-3 em todos os testes"],
            ["6", "Contido e -2 em todos os testes"],
          ],
        },
        {
          titulo: "Limite de Enroscado",
          colunas: ["Graduacao", "Limite", "Area"],
          linhas: [
            ["1â€“2", "2", "1,5 m"],
            ["3â€“4", "3", "3 m"],
            ["5â€“6", "4", "6 m"],
            ["7â€“8", "5", "9 m"],
            ["9â€“10", "6", "15 m"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-probabilidade",
    nome: "Manipulacao de Probabilidade",
    naipe: "Copas",
    tipo: "Alteracao",
    acao: "Reacao",
    alcance: "Pessoal",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Favorece resultados com bonus sortudos.",
    efeitoPrincipal:
      "Apos uma rolagem propria, rola um dado de Probabilidade conforme a graduacao e aplica obrigatoriamente o efeito resultante.",
    extras: [
      { nome: "Fortuna", custo: "+1 por graduacao" },
      { nome: "Pe Frio", custo: "+1 por graduacao" },
      { nome: "Reacao Aprimorada", custo: "+1 por graduacao" },
      { nome: "Controle Parcial", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Efeito Colateral", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Canalizacao Lenta", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Probabilidade permite ao usuario interferir diretamente no fluxo do acaso, inclinando eventos ao seu favor por meio da manipulacao sutil do Eter.",
        "O poder nao garante sucesso, mas aumenta significativamente a qualidade dos resultados obtidos.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Apos realizar uma rolagem, o usuario pode ativar o poder como reacao antes da resolucao final.",
            "Ao ativar: rola um dado de Probabilidade conforme sua graduacao e aplica obrigatoriamente o efeito correspondente.",
            "O poder so pode ser utilizado em rolagens do proprio usuario. Limite: 1 uso por rodada.",
          ],
        },
        {
          titulo: "Regras Importantes",
          itens: [
            "O efeito do dado de Probabilidade e obrigatorio.",
            "O poder nao pode alterar resultados naturais de 1 ou 20.",
            "Nao pode ser combinado com outras formas de manipulacao de rolagem.",
            "Cada rolagem so pode ser afetada uma unica vez.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Fortuna: permite aplicar o efeito em um aliado dentro do alcance de Percepcao. +1 por graduacao.",
            "Pe Frio: permite aplicar o efeito em um inimigo, convertendo bonus em penalidades equivalentes. +1 por graduacao.",
            "Reacao Aprimorada: permite usar o poder 2 vezes por rodada, mas nunca na mesma rolagem. +1 por graduacao.",
            "Controle Parcial: permite rolar dois dados de Probabilidade e escolher qual resultado aplicar. +2 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Efeito Colateral: apos utilizar o poder, sofre -1 na proxima rolagem. -1 por graduacao.",
            "Instavel: se o resultado do dado de Probabilidade for 1, sofre -3 em vez de -2. -1 por graduacao.",
            "Canalizacao Lenta: nao pode utilizar o poder em turnos consecutivos. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Dado de Probabilidade",
          colunas: ["Graduacao", "Dado"],
          linhas: [
            ["1â€“2", "d4"],
            ["3â€“4", "d6"],
            ["5â€“6", "d8"],
            ["7â€“8", "d10"],
            ["9â€“10", "d12"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-som",
    nome: "Manipulacao de Som",
    naipe: "Copas",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Usa ondas sonoras para impacto e ruido.",
    efeitoPrincipal:
      "Ataca com dano igual a graduacao; alvo testa Constituicao (CD 10 + grad): falha aplica niveis de Ressonante reduzindo Resistencia.",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Frequencia Desestabilizadora", custo: "+1 por graduacao" },
      { nome: "Pulso Continuo", custo: "+1 por graduacao" },
      { nome: "Som Direcionado", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Dependente de Meio", custo: "-1 por graduacao" },
      { nome: "Audivel", custo: "-1 fixo" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Som (tambem chamada Manipulacao Sonica) permite ao usuario converter seu Eter em vibraÃ§Ãµes instÃ¡veis que se propagam atravÃ©s de um meio, penetrando o corpo do alvo e desestabilizando sua estrutura interna.",
        "O som atua como um vetor de desgaste, tornando o alvo cada vez mais vulneravel conforme permanece sob efeito das vibracoes.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) ou ataque de area contra a Defesa do(s) alvo(s).",
            "Acerto: o alvo sofre dano igual a graduacao e deve realizar um teste de Constituicao (CD 10 + graduacao).",
            "Falha: o alvo recebe 1 nivel de Ressonante.",
            "Falha critica: recebe 2 niveis.",
          ],
        },
        {
          titulo: "Estado â€” Ressonante",
          itens: [
            "Nivel 1: -1 em Resistencia.",
            "Nivel 2: -2 em Resistencia.",
            "Nivel 3: -3 em Resistencia.",
            "Nivel 4: -3 em Resistencia e -1 geral.",
            "Nivel 5: -4 em Resistencia e -1 geral.",
            "Os acumulos de reducao de Resistencia de Ressonante so se aplicam a dano sonico.",
            "No inicio de cada turno, o alvo pode testar Constituicao contra o mesmo CD: sucesso reduz 1 nivel.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area: permite afetar multiplos alvos, seguindo as regras gerais de efeitos em area. +1 por graduacao.",
            "Frequencia Desestabilizadora: aumenta o limite maximo de Ressonante em +1. +1 por graduacao.",
            "Pulso Continuo: aplica 1 nivel de Ressonante automaticamente no inicio do turno dos alvos afetados. +1 por graduacao.",
            "Som Direcionado: ignora penalidades leves de cobertura. +1 fixo.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Meio: nao funciona na ausencia de um meio de propagacao adequado. -1 por graduacao.",
            "Audivel: o uso da tecnica e sempre perceptivel. -1 fixo.",
            "Instavel: em caso de falha critica, o usuario recebe 1 nivel de Ressonante. -1 por graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-sonhos",
    nome: "Manipulacao de Sonhos",
    naipe: "Copas",
    tipo: "Sensorial / Alteracao",
    acao: "Padrao",
    alcance: "Percepcao",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Entra em sonhos e influencia a mente.",
    efeitoPrincipal:
      "Em alvo adormecido, testa Vontade (CD 10 + grad); falha implanta Marca Onirica que influencia decisoes ao despertar.",
    extras: [
      { nome: "Sonho Compartilhado", custo: "+1 por graduacao" },
      { nome: "Marca Profunda", custo: "+1 por graduacao" },
      { nome: "Memoria Estruturada", custo: "+1 por graduacao" },
      { nome: "Latente", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Sono", custo: "-1 por graduacao" },
      { nome: "Vinculo Fragil", custo: "-1 por graduacao" },
      { nome: "Impreciso", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Sonhos permite ao usuario infiltrar seu Eter no subconsciente de criaturas adormecidas, moldando seus sonhos e implantando experiencias que sao interpretadas como reais ao despertar.",
        "Essa tecnica nao impoe controle direto, mas redefine a forma como o alvo percebe o mundo.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo deve estar dormindo.",
            "Ao ativar o poder, o usuario tenta inserir uma Marca Onirica (1d20 + Vontade, CD 10 + graduacao).",
            "Sucesso: o alvo resiste.",
            "Falha: recebe a Marca.",
            "Falha critica: a Marca se torna mais profunda e dificil de ser quebrada.",
            "A Marca so se manifesta quando o alvo acorda.",
          ],
        },
        {
          titulo: "Tipos de Marca",
          itens: [
            "Medo: evita algo, alguem ou situacao.",
            "Confianca: passa a confiar ou baixar a guarda.",
            "Desejo: sente necessidade de agir em determinada direcao.",
            "Duvida: questiona certezas ou aliados.",
            "Memoria: acredita em uma lembranca plausivel.",
            "Impulso: tende a tomar uma acao simples.",
          ],
        },
        {
          titulo: "Quebra da Marca",
          itens: [
            "O alvo pode tentar resistir quando confrontado diretamente com algo que contradiga a Marca.",
            "Teste de Vontade vs CD do poder: Sucesso: a Marca enfraquece ou se dissipa. Falha: a influencia persiste.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Sonho Compartilhado: o usuario pode afetar multiplos alvos durante o mesmo periodo de descanso (ate graduacao). +1 por graduacao.",
            "Marca Profunda: alvos afetados sofrem -2 em testes de Vontade para resistir ou quebrar a Marca. +1 por graduacao.",
            "Memoria Estruturada: quando a Marca for do tipo Memoria, o alvo nao realiza teste imediato para questionar a veracidade ao acordar. +1 por graduacao.",
            "Latente: o usuario define uma condicao de ativacao; enquanto nao atendida, a Marca permanece inativa. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Sono: o poder so pode ser utilizado em alvos em sono natural ou induzido. -1 por graduacao.",
            "Vinculo Fragil: se o alvo despertar antes da conclusao da aplicacao, o efeito falha completamente. -1 por graduacao.",
            "Impreciso: ao aplicar a Marca, o mestre pode alterar levemente o efeito para algo semelhante. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Profundidade da Marca",
          colunas: ["Graduacao", "Intensidade"],
          linhas: [
            ["1â€“2", "sensacao leve, facilmente ignoravel"],
            ["3â€“4", "influencia perceptivel nas decisoes"],
            ["5â€“6", "comportamento afetado de forma consistente"],
            ["7â€“8", "forte inclinacao comportamental"],
            ["9â€“10", "condicionamento psicologico significativo"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-sonica",
    nome: "Manipulacao Sonica",
    naipe: "Copas",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Vibra e rompe a estabilidade do alvo.",
    efeitoPrincipal:
      "Testa Forca (CD 10 + grad); falha aplica estado Instavel com penalidades em testes de ataque progressivas.",
    extras: [
      { nome: "Faseamento", custo: "+1 por graduacao" },
      { nome: "Ressonancia Destrutiva", custo: "+1 por graduacao" },
      { nome: "Impacto Vibracional", custo: "+1 por graduacao" },
      { nome: "Area", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Contato", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Vibracao (Manipulacao Sonica) permite ao usuario converter seu Eter em oscilacoes que alteram a frequencia vibracional da materia, tornando corpos, superficies e estruturas instaveis.",
        "Diferente da Manipulacao de Som, que enfraquece a resistencia interna, a vibracao atua sobre a precisao e controle fisico.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O alvo deve realizar um teste de resistencia (1d20 + Forca, CD 10 + graduacao).",
            "Sucesso: sofre apenas -1 em testes de ataque ate o fim do turno.",
            "Falha: o alvo se torna Instavel conforme a escala da tecnica.",
            "Falha critica: o efeito e aplicado como se estivesse um nivel acima.",
          ],
        },
        {
          titulo: "Estado â€” Instavel",
          itens: [
            "1â€“2: -1 em testes de ataque.",
            "3â€“4: -2 em testes de ataque.",
            "5â€“6: -3 em testes de ataque.",
            "7â€“8: -3 em testes de ataque e -1 em testes fisicos.",
            "9â€“10: -4 em testes de ataque e -1 geral fisico.",
            "O estado nao se acumula. Aplica-se sempre o efeito correspondente a maior graduacao ativa.",
            "O alvo permanece instavel ate o inicio do proximo turno do usuario, quando pode realizar novo teste de Forca.",
          ],
        },
        {
          titulo: "Interacao com Estruturas",
          itens: [
            "Estruturas afetadas sofrem desgaste progressivo enquanto o efeito e mantido.",
            "Recebem dano adicional igual a metade da graduacao (arredondado para baixo) a cada turno.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Faseamento: permite ao usuario vibrar o proprio corpo para atravessar superficies solidas de forma limitada. +1 por graduacao.",
            "Ressonancia Destrutiva: aumenta o dano causado a estruturas. +1 por graduacao.",
            "Impacto Vibracional: permite causar dano direto igual a graduacao. +1 por graduacao.",
            "Area: permite afetar multiplos alvos, seguindo as regras gerais de efeitos em area. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Contato: alguns efeitos exigem contato direto com o alvo ou superficie. -1 por graduacao.",
            "Instavel: a vibracao pode se espalhar para areas nao desejadas. -1 por graduacao.",
            "Limitado: nao afeta materiais nao solidos. -1 por graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-gravitacional",
    nome: "Manipulacao de Gravidade",
    naipe: "Copas",
    tipo: "Alteracao",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Aumenta ou reduz peso e pressao.",
    efeitoPrincipal:
      "Testa Constituicao (CD 10 + grad); falha aplica Desalinhado em modo Gravidade Aumentada (-Defesa/-deslocamento) ou Reduzida (-ataques).",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Eixo Alterado", custo: "+1 por graduacao" },
      { nome: "Gravidade Intensa", custo: "+1 por graduacao" },
      { nome: "Flutuacao", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Area Limitada", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Dependente de Foco", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao Gravitacional permite ao usuario converter seu Eter em campos que alteram a intensidade da gravidade sobre alvos ou areas, modificando diretamente seu peso e sua estabilidade.",
        "O usuario pode aumentar a gravidade, tornando o corpo do alvo pesado e dificil de mover, ou reduzi-la, fazendo com que o alvo perca firmeza e controle sobre seus proprios movimentos.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario escolhe um modo de aplicacao: Gravidade Aumentada ou Gravidade Reduzida.",
            "O alvo realiza um teste de resistencia (1d20 + Constituicao, CD 10 + graduacao).",
            "Sucesso: o alvo resiste ao efeito.",
            "Falha: torna-se Desalinhado conforme o modo escolhido.",
            "Falha critica: o efeito e aplicado como se estivesse um nivel acima.",
          ],
        },
        {
          titulo: "Gravidade Aumentada",
          itens: [
            "1â€“2: -1 na Defesa.",
            "3â€“4: -1 na Defesa e deslocamento reduzido pela metade.",
            "5â€“6: -2 na Defesa e deslocamento reduzido pela metade.",
            "7â€“8: -2 na Defesa e deve escolher entre acao ou movimento.",
            "9â€“10: -3 na Defesa, deslocamento minimo e deve escolher entre acao ou movimento.",
          ],
        },
        {
          titulo: "Gravidade Reduzida",
          itens: [
            "1â€“2: -1 em testes de ataque.",
            "3â€“4: -2 em testes de ataque.",
            "5â€“6: -2 em testes de ataque e deslocamento impreciso.",
            "7â€“8: -3 em testes de ataque e dificuldade de manter posicao.",
            "9â€“10: -3 em testes de ataque e -1 na Defesa.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area: permite afetar multiplos alvos, seguindo as regras gerais de efeitos em area. +1 por graduacao.",
            "Eixo Alterado: permite aplicar a gravidade em direcoes nao naturais. +1 por graduacao.",
            "Gravidade Intensa: aumenta as penalidades aplicadas em -1 adicional. +1 por graduacao.",
            "Flutuacao: permite ao usuario aplicar Gravidade Reduzida em si mesmo para se manter suspenso no ar. +1 fixo.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Area Limitada: a area de efeito e reduzida. -1 por graduacao.",
            "Instavel: a intensidade da gravidade oscila levemente. -1 por graduacao.",
            "Dependente de Foco: perder a concentracao encerra o efeito. -1 por graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-luz",
    nome: "Manipulacao de Luz",
    naipe: "Copas",
    tipo: "Alteracao",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Ofusca, revela e manipula claridade.",
    efeitoPrincipal:
      "Testa Constituicao (CD 10 + grad); falha aplica niveis de Ofuscamento progressivos que ativam estados como Atordoado, Desestabilizado e Exposto.",
    extras: [
      { nome: "Area Ampliada", custo: "+1 por graduacao" },
      { nome: "Laser Concentrado", custo: "+1 por graduacao" },
      { nome: "Luz Direcionada", custo: "+1 fixo" },
      { nome: "Visao Perfeita", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Dependente de Fonte", custo: "-1 por graduacao" },
      { nome: "Ofuscamento Proprio", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Luz permite ao usuario converter seu Eter em emissao luminosa intensa, alterando a visibilidade do ambiente e sobrecarregando a percepcao visual dos alvos.",
        "A luz nao interfere fisicamente nem distorce a realidade â€” ela expoe e satura, fazendo com que o proprio ato de enxergar se torne um problema.",
      ],
      secoes: [
        {
          titulo: "Funcionamento â€” Ofuscamento",
          itens: [
            "Sempre que um alvo e afetado pela Manipulacao de Luz, deve realizar um teste (1d20 + Constituicao, CD 10 + graduacao).",
            "Sucesso: o alvo resiste ao efeito.",
            "Falha: o alvo recebe 1 nivel de Ofuscamento.",
            "Falha critica: o alvo recebe 2 niveis de Ofuscamento.",
          ],
        },
        {
          titulo: "Estado â€” Ofuscamento",
          itens: [
            "Nivel 1: fica Atordoado.",
            "Nivel 2: -1 em testes de ataque.",
            "Nivel 3: fica Desestabilizado.",
            "Nivel 4: -1 na Defesa.",
            "Nivel 5: fica Exposto.",
            "Nivel 6: fica Exposto + Desestabilizado.",
            "No inicio do turno, o alvo pode testar (CD do poder): sucesso reduz 1 nivel.",
          ],
        },
        {
          titulo: "Interacao com Luz e Escuridao",
          itens: [
            "A Manipulacao de Luz remove efeitos de escuridao de menor graduacao dentro da area afetada.",
            "Em conflito, prevalece o maior valor de graduacao.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area Ampliada: aumenta a area afetada pela luz. +1 por graduacao.",
            "Laser Concentrado: permite causar dano direto igual a graduacao. +1 por graduacao.",
            "Luz Direcionada: permite afetar apenas alvos escolhidos dentro da area. +1 fixo.",
            "Visao Perfeita: o usuario ignora penalidades visuais. +1 fixo.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Fonte: requer presenca minima de luz no ambiente. -1 por graduacao.",
            "Ofuscamento Proprio: o usuario tambem sofre os efeitos do poder. -1 por graduacao.",
            "Instavel: a intensidade da luz varia em Â±1 nivel. -1 por graduacao.",
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-escuridao",
    nome: "Manipulacao de Escuridao",
    naipe: "Copas",
    tipo: "Controle / Area",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Cria sombra para ocultar e atrapalhar.",
    efeitoPrincipal:
      "Todos na area testam Percepcao por turno (CD 10 + grad); falhas acumulam niveis de Obscuridade com penalidades em ataques e visao.",
    extras: [
      { nome: "Area Seletiva", custo: "+1 por graduacao" },
      { nome: "Escuridao Persistente", custo: "+1 por graduacao" },
      { nome: "Sombras Profundas", custo: "+1 por graduacao" },
      { nome: "Visao nas Sombras", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Dependente de Escuridao", custo: "-1 por graduacao" },
      { nome: "Afeta Aliados", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Escuridao permite ao usuario converter seu Eter em um fluxo de ausencia de luz, criando zonas onde a informacao visual e suprimida e a percepcao se torna falha.",
        "A escuridao nao engana â€” ela remove referencias, fazendo com que os alvos percam precisao, timing e controle do que acontece ao redor.",
      ],
      secoes: [
        {
          titulo: "Funcionamento â€” Obscuridade",
          itens: [
            "Sempre que um alvo estiver dentro da area afetada, deve realizar um teste a cada turno (1d20 + Percepcao, CD 10 + graduacao).",
            "Sucesso: o alvo resiste naquele turno.",
            "Falha: recebe 1 nivel de Obscuridade.",
            "Falha critica: recebe 2 niveis.",
            "A cada nova falha enquanto permanecer na area, o nivel aumenta em +1.",
          ],
        },
        {
          titulo: "Estado â€” Obscuridade",
          itens: [
            "Nivel 1: -2 em testes de Percepcao.",
            "Nivel 2: perde Reacao.",
            "Nivel 3: -1 em ataques.",
            "Nivel 4: -1 em ataque e Defesa.",
            "Nivel 5: ataques rolam 2d20 e usam o pior resultado.",
            "Nivel 6: ataques com resultado 1â€“5 falham ou atingem alvo incorreto.",
            "No inicio do turno, o alvo pode testar: sucesso reduz -1 nivel.",
          ],
        },
        {
          titulo: "Interacao com Luz",
          itens: [
            "Fontes de luz reduzem o nivel de Obscuridade em -1.",
            "Em conflito direto, prevalece o maior nivel de graduacao.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Area Seletiva: permite excluir aliados da area. +1 por graduacao.",
            "Escuridao Persistente: o efeito permanece por 1 turno apos sair da area. +1 por graduacao.",
            "Sombras Profundas: aumenta o limite maximo de Obscuridade em +1 nivel. +1 por graduacao.",
            "Visao nas Sombras: o usuario ignora os efeitos da propria escuridao. +1 fixo.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Escuridao: ambientes muito iluminados reduzem a area em 50%. -1 por graduacao.",
            "Afeta Aliados: o usuario tambem sofre os efeitos. -1 por graduacao.",
            "Instavel: a area oscila em Â±1 metro por turno. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Area de Manipulacao de Escuridao",
          colunas: ["Graduacao", "Area", "Escala"],
          linhas: [
            ["1â€“2", "1,5 m", "obscurecimento leve"],
            ["3â€“4", "3 m", "perda de referencia"],
            ["5â€“6", "6 m", "desorientacao"],
            ["7â€“8", "9 m", "combate prejudicado"],
            ["9â€“10", "15 m", "dominio de escuridao"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-magnetica",
    nome: "Manipulacao Magnetica",
    naipe: "Copas",
    tipo: "Controle / Ataque",
    acao: "Padrao",
    alcance: "A Distancia",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Controla metais e blinda aliados.",
    efeitoPrincipal:
      "Ataca com dano igual a graduacao; alvos equipados com metal realizam o teste com desvantagem; pode criar barreira metalica para aliados.",
    extras: [
      { nome: "Atracao Magnetica", custo: "+1 por graduacao" },
      { nome: "Escudo Metalico", custo: "+1 por graduacao" },
      { nome: "Sobrecarga Magnetica", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Metal", custo: "-1 por graduacao" },
      { nome: "Interferencia", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao Magnetica permite ao usuario converter seu Eter em campos eletromagneticos, controlando estruturas metalicas como uma extensao de sua vontade.",
        "O poder se destaca pela versatilidade: pode ser usado para atacar, repelir, segurar e proteger, dependendo de como o usuario dirige o campo.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "O usuario realiza um teste de ataque a distancia (1d20 + Disparo) contra a Defesa do alvo.",
            "Acerto: o alvo sofre dano igual a graduacao.",
            "Alvos equipados com armaduras ou armas metalicas realizam o teste de esquiva com desvantagem.",
          ],
        },
        {
          titulo: "Defensiva â€” Barreira Metalica",
          itens: [
            "O usuario pode criar uma barreira metalica ao redor de aliados, concedendo bonus de Defesa ate o inicio do proximo turno.",
            "Fabricar a barreira consome a acao de Padrao do turno inteiro.",
            "1â€“2: +1 Defesa; 3â€“4: +2 Defesa; 5â€“6: +3 Defesa; 7â€“8: +4 Defesa; 9â€“10: +5 Defesa.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Atracao Magnetica: permite puxar alvos metalicos em sua direcao. +1 por graduacao.",
            "Escudo Metalico: aumenta o bonus de Defesa da barreira em +1. +1 por graduacao.",
            "Sobrecarga Magnetica: pode tentar desarmar alvos com armas metalicas. +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Dependente de Metal: requer presenca de metal para funcionar. -1 por graduacao.",
            "Interferencia: o campo magnetico pode afetar equipamentos eletronicos proximos. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Escala de Manipulacao Magnetica",
          colunas: ["Graduacao", "Dano", "Bonus de Defesa", "Area"],
          linhas: [
            ["1â€“2", "1", "+1", "1,5 m"],
            ["3â€“4", "2", "+2", "3 m"],
            ["5â€“6", "3", "+3", "6 m"],
            ["7â€“8", "4", "+4", "9 m"],
            ["9â€“10", "5", "+5", "15 m"],
          ],
        },
      ],
    },
  },
  {
    id: "copas-manipulacao-de-acido",
    nome: "Manipulacao de Acido",
    naipe: "Copas",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "Toque",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Corroi e enfraquece alvos com ataque acido.",
    efeitoPrincipal:
      "Dano igual a graduacao ignorando parte da Resistencia conforme tabela; reduz Resistencia apenas para esse ataque.",
    extras: [
      { nome: "Projecao Acida", custo: "+1 por graduacao" },
      { nome: "Corrosao Total", custo: "+1 por graduacao" },
      { nome: "Impacto Concentrado", custo: "+1 por graduacao" },
      { nome: "Area", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Contato Prolongado", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Manipulacao de Acido permite ao usuario converter seu Eter em uma substancia corrosiva altamente instavel, capaz de dissolver materia no instante do contato.",
        "O acido nao busca controle ou desgaste prolongado, mas sim garantir que o impacto seja efetivo, mesmo contra alvos resistentes.",
      ],
      secoes: [
        {
          titulo: "Funcionamento â€” Corrosao Direta",
          itens: [
            "Ao atingir um alvo, a Resistencia do alvo e reduzida apenas para esse ataque, conforme a graduacao.",
            "O alvo realiza o teste de resistencia normalmente (1d20 + Resistencia, CD 10 + graduacao).",
            "Sucesso: sofre dano reduzido (metade).",
            "Falha: sofre dano completo.",
            "Falha critica: sofre dano completo +1.",
            "A Resistencia nunca pode ser reduzida abaixo de 0.",
          ],
        },
        {
          titulo: "Dano",
          itens: [
            "O dano causado e igual a graduacao.",
            "A Manipulacao de Acido nao possui efeitos continuos, nao aplica estados e nao se acumula.",
          ],
        },
        {
          titulo: "Extras",
          itens: [
            "Projecao Acida: o alcance passa de Toque para curto alcance (ate 3m); o dano e reduzido em -1 (minimo 1). +1 por graduacao.",
            "Corrosao Total: a reducao de Resistencia aumenta em +1 adicional. +1 por graduacao.",
            "Impacto Concentrado: quando o alvo obtem falha critica, o dano adicional passa de +1 para +2. +1 por graduacao.",
            "Area: afeta todos os alvos dentro de uma area (raio base 1,5m, +1,5m a cada 2 graduacoes). +1 por graduacao.",
          ],
        },
        {
          titulo: "Falhas",
          itens: [
            "Instavel: em caso de falha critica do usuario na rolagem de ataque, o dano causado e reduzido pela metade. -1 por graduacao.",
            "Limitado: o poder afeta apenas um tipo de alvo (apenas organico ou apenas inorganico). -1 por graduacao.",
            "Contato Prolongado: apos atingir, o usuario sofre -1 na Defesa ate o inicio do proximo turno. -1 por graduacao.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Reducao de Resistencia",
          colunas: ["Graduacao", "Reducao de Resistencia", "Escala"],
          linhas: [
            ["1â€“2", "ignora 1", "corrosao leve"],
            ["3â€“4", "ignora 2", "penetracao"],
            ["5â€“6", "ignora 3", "corrosao eficaz"],
            ["7â€“8", "ignora 4", "degradacao intensa"],
            ["9â€“10", "ignora 5", "dissolucao"],
          ],
        },
      ],
    },
  },
];

