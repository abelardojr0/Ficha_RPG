import type { PowerDefinition } from "./powers";

export const PODERES_ESPADAS: PowerDefinition[] = [
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
      "Converte Eter em reforco fisico imediato no impacto corpo a corpo.",
    efeitoPrincipal:
      "O ataque recebe +graduacao no dano e, se causar dano apos resistencia, o alvo sofre -1 Defesa ate o inicio do proximo turno.",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Multi Ataque", custo: "+1 por graduacao" },
      { nome: "Impacto Devastador", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Desarmado)", custo: "-1 por graduacao" },
      { nome: "Limitado (Arma Especifica)", custo: "-1 por graduacao" },
      { nome: "Preparacao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Canalizar converte Eter em reforco fisico imediato no momento do impacto corpo a corpo.",
        "A tecnica amplia potencia sem alterar a forma base do ataque, servindo como referencia ofensiva de Espadas.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ao realizar ataque corpo a corpo, aplique Canalizar sem alterar o teste de acerto.",
            "Se acertar, soma bonus de dano igual a graduacao.",
            "Se houver dano apos mitigacao, alvo sofre -1 em Defesa ate o inicio do proximo turno dele.",
          ],
        },
        {
          titulo: "Regras",
          itens: [
            "Dano final: Dano Base + graduacao de Canalizar.",
            "Nao acumula multiplas ativacoes no mesmo ataque.",
            "Interage normalmente com criticos e respeita limite de dano do sistema.",
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
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "especial",
    resumo: "Camada invisivel de Eter que reforca o corpo continuamente.",
    efeitoPrincipal:
      "Concede +1 Resistencia por graduacao; quando reduzir dano (minimo 1), recebe +1 no proximo ataque contra o agressor.",
    extras: [
      { nome: "Protecao Adaptativa", custo: "+1 por graduacao" },
      { nome: "Camada Reforcada", custo: "+1 por graduacao" },
      { nome: "Nucleo Estavel", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Fisico)", custo: "-1 por graduacao" },
      { nome: "Ativacao", custo: "-2 fixo" },
      { nome: "Rigidez Corporal", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Protecao mantem circulacao continua de Eter pelo corpo para reduzir impacto direto.",
        "Diferente de barreira externa, reforca a estrutura corporal de forma passiva.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Sempre ativo, concede +1 Resistencia por graduacao.",
            "Quando reduzir dano efetivo (minimo 1), recebe +1 no proximo ataque contra o agressor.",
          ],
        },
        {
          titulo: "Custo de Eter",
          itens: [
            "Sempre que reduzir dano efetivo, consome graduacao/2 de Eter por instancia de dano.",
            "Se dano foi totalmente absorvido por atributos base, nao ha consumo.",
          ],
        },
      ],
    },
  },
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
    resumo: "Converte parte do impacto recebido em cargas de energia.",
    efeitoPrincipal:
      "A cada 2 graduacoes: reduz 1 dano e gera 1 carga; cargas podem virar bonus de dano ou acerto em ataques corpo a corpo.",
    extras: [
      { nome: "Amplificacao", custo: "+1 por graduacao" },
      { nome: "Explosao", custo: "+2 por graduacao" },
      { nome: "Armazenamento Expandido", custo: "+1 por graduacao" },
      { nome: "Conversao Imediata", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Fisico)", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Exposicao Necessaria", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Absorcao redireciona parte do impacto recebido para gerar cargas de energia.",
        "A tecnica transforma pressao sofrida em vantagem tatico-ofensiva.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Apos calcular dano e Resistencia, pode ativar Absorcao como reacao.",
            "Cada 2 graduacoes: reduz 1 dano e gera 1 carga (arredondado para baixo).",
            "Se gerar ao menos 1 carga, proximo ataque corpo a corpo contra o mesmo alvo recebe +1 no teste.",
          ],
        },
        {
          titulo: "Cargas",
          itens: [
            "Limite maximo de cargas igual a graduacao do poder.",
            "Cargas duram ate uso ou fim da cena.",
            "Cada carga pode virar +1 dano ou +1 no teste de ataque corpo a corpo.",
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
    resumo: "Recuperacao continua de Vida por fluxo constante de Eter.",
    efeitoPrincipal:
      "No inicio do turno, consome Eter padrao e recupera 1 Vida por graduacao se estiver consciente.",
    extras: [
      { nome: "Regeneracao Rapida", custo: "+1 por graduacao" },
      { nome: "Regeneracao de Membros", custo: "+2 por graduacao" },
      { nome: "Regeneracao Ativa", custo: "+1 por graduacao" },
      { nome: "Fluxo Ininterrupto", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Ferimentos graves)", custo: "-1 por graduacao" },
      { nome: "Dependente de Eter", custo: "-1 por graduacao" },
      { nome: "Regeneracao Lenta", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Regeneracao representa reconstrucao corporal continua via fluxo de Eter.",
        "Nao impede dano, mas sustenta recuperacao constante em combate prolongado.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "No inicio de cada turno, consome Eter padrao e recupera 1 Vida por graduacao.",
            "A recuperacao e automatica, sem acao, e requer usuario consciente.",
            "Sem Eter suficiente, nao regenera naquele turno.",
          ],
        },
        {
          titulo: "Interacoes",
          itens: [
            "A cada 5 Vida recuperada acumulada, remove 1 Machucado.",
            "Nao remove automaticamente Ferimentos, mutilacoes ou condicoes especiais.",
            "Apos dano massivo unico, a regeneracao do proximo turno e reduzida pela metade.",
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
    duracao: "Temporaria",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Aplica niveis progressivos de penalidade fisica por contato.",
    efeitoPrincipal:
      "Falha no teste de Constituicao aplica Desgaste; cada nivel causa -1 em testes fisicos e acumula ate o limite do poder.",
    extras: [
      { nome: "Incuravel", custo: "+1 por graduacao" },
      { nome: "Reversivel", custo: "+1 fixo" },
      { nome: "Pressao Intensa", custo: "+1 por graduacao" },
      { nome: "Salvamento Alternativo", custo: "+0" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Dependente de Condicao", custo: "-1 por graduacao" },
      { nome: "Concentracao", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Desgaste injeta Eter por contato para deteriorar progressivamente desempenho fisico.",
        "A tecnica acumula pressao e enfraquece o alvo ao longo dos turnos.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ataque corpo a corpo seguido de teste do alvo: 1d20 + Constituicao vs CD 10 + graduacao.",
            "Falha aplica 1 nivel de Desgaste; falha critica aplica 2 niveis.",
            "Cada nivel aplica -1 em testes fisicos, ataque e defesa.",
          ],
        },
        {
          titulo: "Acumulo e Duracao",
          itens: [
            "Niveis acumulam ate graduacao/2 (arredondado para cima).",
            "No maximo, alvo sofre -1 adicional em Defesa.",
            "Cada aplicacao dura graduacao/2 turnos e renova duracao.",
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
    custoEterBase: "padrao +2",
    resumo:
      "Golpe de ruptura que reduz temporariamente a Resistencia na area atingida.",
    efeitoPrincipal:
      "Causa dano com bonus igual a graduacao e reduz Resistencia da area atingida em metade da graduacao (para cima).",
    extras: [
      { nome: "Area", custo: "+2 por graduacao" },
      { nome: "Seletivo", custo: "+1 por graduacao" },
      { nome: "Alcance", custo: "+2 por graduacao" },
      { nome: "Ruptura Prolongada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Dependente de Precisao", custo: "-1 por graduacao" },
      { nome: "Efeito Colateral", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Corrosao concentra Eter em ponto especifico para abrir brecha defensiva momentanea.",
        "Combina dano alto com ruptura localizada de Resistencia.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Em acerto corpo a corpo, causa dano normal + bonus igual a graduacao.",
            "Aplica reducao de Resistencia na area atingida: metade da graduacao (para cima).",
            "A reducao vale no proprio ataque que a gerou.",
          ],
        },
        {
          titulo: "Regras",
          itens: [
            "Duracao da reducao: ate inicio do proximo turno do alvo.",
            "Aplicacoes nao acumulam, mantem apenas maior valor.",
            "Se margem de acerto for menor que 2, reducao de Resistencia cai pela metade (para baixo).",
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
    alcance: "Perto",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "padrao +2",
    resumo: "Campo reativo que pune aproximacao hostil automaticamente.",
    efeitoPrincipal:
      "Alvos proximos testam Constituicao; falha sofre dano (metade da graduacao, para cima) e -1 em testes fisicos ate o fim do turno.",
    extras: [
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Repulsao", custo: "+1 por graduacao" },
      { nome: "Penetrante", custo: "+1 por graduacao" },
      { nome: "Aura Continua", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Visivel", custo: "-1 fixo" },
      { nome: "Consome Energia", custo: "-1 por graduacao" },
      { nome: "Contato Direto", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Aura cria campo instavel de Eter que reage automaticamente a aproximacao hostil.",
        "Transforma proximidade em risco continuo para inimigos.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ativa contra quem entra em corpo a corpo ou realiza ataque fisico contra o usuario.",
            "Cada inimigo pode ser afetado uma vez por turno.",
            "Alvo testa Constituicao (CD 10 + graduacao).",
          ],
        },
        {
          titulo: "Efeito",
          itens: [
            "Falha: dano igual a metade da graduacao (para cima) e -1 em testes fisicos ate fim do turno.",
            "Sucesso: metade do dano (para baixo), sem penalidade.",
            "Funciona apenas com usuario consciente.",
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
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Amplifica temporariamente Forca, Constituicao ou Agilidade.",
    efeitoPrincipal:
      "Concede +1 por graduacao em testes do atributo escolhido enquanto ativo.",
    extras: [
      { nome: "Aumento Massivo", custo: "+1 por graduacao" },
      { nome: "Explosao de Poder", custo: "+1 fixo" },
      { nome: "Sobrecarga Controlada", custo: "+1 por graduacao" },
      { nome: "Conversao em Dado", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Somente Combate)", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Sobrecarga Fisica", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Caracteristica Aumentada direciona Eter para amplificar atributo fisico especifico.",
        "Permite ajuste dinamico de desempenho conforme situacao.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Escolha Forca, Constituicao ou Agilidade ao ativar.",
            "Concede +1 por graduacao em testes do atributo escolhido.",
            "Afeta apenas um atributo por vez.",
          ],
        },
        {
          titulo: "Regras",
          itens: [
            "Nao altera dado base de atributo, apenas bonus numerico.",
            "Nao afeta dano base, Defesa passiva ou Vida diretamente.",
            "Nao acumula com multiplas ativacoes simultaneas do mesmo poder.",
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
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Acelera reflexos e execucao para multiplicar o ritmo de combate.",
    efeitoPrincipal:
      "A cada 2 graduacoes: +1 Agilidade; graduacoes altas liberam acoes adicionais com penalidades especificas.",
    extras: [
      { nome: "Acao Perfeita", custo: "+2 por graduacao" },
      { nome: "Fluxo Continuo", custo: "+2 por graduacao" },
      { nome: "Reflexo Antecipado", custo: "+1 por graduacao" },
      { nome: "Movimento Instantaneo", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Exaustivo", custo: "-1 por graduacao" },
      { nome: "Sobrecarga Neural", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Rapidez acelera impulsos corporais e mentais para abrir janelas extras de acao.",
        "O foco e multiplicar ritmo de combate, nao apenas deslocamento.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Consome Eter igual a metade da graduacao (para cima) por turno enquanto ativo.",
            "A cada 2 graduacoes: +1 em testes de Agilidade (acoes ativas).",
            "Graduacoes maiores liberam acoes adicionais com penalidades (-4 na primeira, -6 na segunda).",
          ],
        },
        {
          titulo: "Regras",
          itens: [
            "Acoes adicionais nao repetem a mesma acao no turno sem Extra adequado.",
            "Nao permitem poderes com custo de Eter +2 ou maior.",
            "Enquanto ativa, na iniciativa por cartas compra 2 e escolhe 1.",
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
    duracao: "Temporaria",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Degrada caracteristicas do alvo por contato com Eter focado.",
    efeitoPrincipal:
      "Falha no teste de Constituicao aplica penalidade na caracteristica escolhida: -1 a cada 2 graduacoes (maximo acumulado -4).",
    extras: [
      { nome: "Drenagem Espiritual", custo: "+1 por graduacao" },
      { nome: "Enfraquecimento Total", custo: "+1 por graduacao" },
      { nome: "Golpe Incapacitante", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Somente fisico)", custo: "-1 por graduacao" },
      { nome: "Contato Preciso", custo: "-1 por graduacao" },
      { nome: "Efeito Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Enfraquecer aplica Eter no ponto de impacto para degradar desempenho do alvo.",
        "A tecnica prioriza controle progressivo em vez de dano imediato.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Ao acertar corpo a corpo, escolhe uma caracteristica do alvo.",
            "Alvo testa Constituicao contra CD 10 + graduacao.",
            "Falha aplica penalidade de -1 por 2 graduacoes (para cima).",
          ],
        },
        {
          titulo: "Duracao e Limites",
          itens: [
            "Duracao: metade da graduacao em turnos (para cima).",
            "Aplicacoes acumulam ate maximo de -4 por caracteristica.",
            "Novas aplicacoes renovam duracao.",
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
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Torna o usuario completamente indiferente a efeitos escolhidos.",
    efeitoPrincipal:
      "Efeitos cobertos pela imunidade sao ignorados sem teste; cada descritor exige graduacoes conforme abrangencia.",
    extras: [
      { nome: "Afeta Outros", custo: "+1 por graduacao" },
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Seletivo", custo: "+1 fixo" },
      { nome: "Sustentado", custo: "+0" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Condicional", custo: "-1 por graduacao" },
      { nome: "Ativacao", custo: "-1 fixo" },
    ],
    detalhes: {
      introducao: [
        "Imunidade reforca corpo e fluxo interno para ignorar efeitos de descritores definidos.",
        "Nao reduz: simplesmente torna o usuario indiferente ao efeito coberto.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Cada imunidade e comprada por faixas de graduacao conforme abrangencia do efeito.",
            "Quando atingido por efeito coberto, ele e ignorado automaticamente sem teste.",
          ],
        },
        {
          titulo: "Regras",
          itens: [
            "Descritor deve ser claro e delimitado.",
            "Nao acumula com resistencia porque o efeito nao chega a ocorrer.",
            "Nao se aplica a efeitos fora do escopo definido.",
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
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Retaliacao instantanea quando um ataque corpo a corpo falha contra voce.",
    efeitoPrincipal:
      "Apos falha inimiga em corpo a corpo, realiza contra-golpe (1d20 + CaC) e causa dano igual a graduacao.",
    extras: [
      { nome: "Reflexo Instintivo", custo: "+1 por graduacao" },
      { nome: "Retaliacao Violenta", custo: "+1 por graduacao" },
      { nome: "Campo Reativo", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Desarmado)", custo: "-1 por graduacao" },
      { nome: "Resposta Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Contra-Ataque e resposta automatica do Eter a agressao corpo a corpo malsucedida.",
        "Converte erro ofensivo do inimigo em abertura imediata de retaliacao.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Dispara quando inimigo falha ataque corpo a corpo contra sua Defesa.",
            "Consome Eter padrao para ativar.",
            "Realiza ataque 1d20 + CaC; acerto causa dano igual a graduacao.",
          ],
        },
        {
          titulo: "Regras",
          itens: [
            "Dano nao soma Forca ou arma por padrao.",
            "Cada ataque inimigo falho pode gerar uma ativacao separada.",
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
      "Impulso de Eter para reposicionamento extremo no campo de batalha.",
    efeitoPrincipal:
      "Substitui deslocamento normal por salto com distancia/altura escaladas por graduacao.",
    extras: [
      { nome: "Salto de Impacto", custo: "+1 por graduacao" },
      { nome: "Salto Direcionado", custo: "+1 fixo" },
      { nome: "Impulso Sequencial", custo: "+2 por graduacao" },
      { nome: "Salto Ofensivo", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Apenas vertical)", custo: "-1 por graduacao" },
      { nome: "Impulso Rigido", custo: "-1 por graduacao" },
      { nome: "Exposicao Aerea", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Salto concentra Eter nas pernas para deslocamento explosivo e reposicionamento tatico.",
        "Transforma mobilidade em controle de espaco e angulo de combate.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Usa acao de movimento para salto impulsionado, com custo de Eter padrao.",
            "Substitui deslocamento normal e ignora terreno dificil simples.",
            "Nao atravessa barreiras solidas ou efeitos que bloqueiem movimento.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Salto",
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
    resumo: "Multiplica deslocamento e habilita corrida em sobrecarga.",
    efeitoPrincipal:
      "Movimento recebe multiplicador por graduacao; se gastar acao padrao para mover de novo, dobra o multiplicador desse segundo deslocamento.",
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
        "Supervelocidade acelera continuamente o corpo para deslocamentos extremos.",
        "Com foco total em corrida, dobra desempenho do segundo deslocamento no turno.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Enquanto ativo, deslocamento recebe multiplicador por graduacao e consome Eter padrao por turno.",
            "Se gastar acao padrao apenas para mover, o segundo deslocamento dobra o multiplicador.",
            "Nao concede acoes adicionais nem permite uso de tecnicas durante sobrecarga.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Supervelocidade",
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
    id: "espadas-superforça",
    nome: "Superforca",
    naipe: "Espadas",
    tipo: "Fortalecimento",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Amplia brutalmente a forca aplicada e a capacidade de carga.",
    efeitoPrincipal:
      "Multiplica a forca por graduacao; concede bonus em dano corpo a corpo e testes de Forca conforme escala.",
    extras: [
      { nome: "Arremesso Gigante", custo: "+1 por graduacao" },
      { nome: "Impacto Devastador", custo: "+1 por graduacao" },
      { nome: "Forca Aplicada", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Limitado (Apenas levantar)", custo: "-2 por graduacao" },
      { nome: "Descontrole", custo: "-1 por graduacao" },
      { nome: "Dependente de Postura", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Superforca reforca estrutura muscular via Eter para esforcos muito acima do natural.",
        "Nao melhora precisao, mas amplia brutalmente impacto fisico.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Enquanto ativo, multiplica capacidade de carga e consome Eter padrao por turno.",
            "Dano corpo a corpo recebe +1 a cada 3 graduacoes.",
            "Testes de Forca recebem +1 a cada 2 graduacoes.",
          ],
        },
      ],
      tabelas: [
        {
          titulo: "Superforca",
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
    id: "espadas-pressao",
    nome: "Pressao",
    naipe: "Espadas",
    tipo: "Controle",
    acao: "Padrao",
    alcance: "Area",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao +2",
    resumo: "Campo opressivo que reduz deslocamento e eficiencia de combate.",
    efeitoPrincipal:
      "Inimigos na area testam Vontade; falha aplica penalidades em testes e reduz movimento por graduacao.",
    extras: [
      { nome: "Pressao Devastadora", custo: "+2 por graduacao" },
      { nome: "Foco Direcionado", custo: "+1 fixo" },
      { nome: "Campo Intenso", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado (Alvos mais fracos)", custo: "-1 por graduacao" },
      { nome: "Area Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Pressao libera Eter massivo no ambiente para oprimir movimento e reacao inimiga.",
        "Campo acompanha o usuario e cria controle de area continuo.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Inimigos que entram ou iniciam turno na area testam Vontade (CD 10 + graduacao).",
            "Falha aplica penalidade de -1 por 2 graduacoes (para cima) em testes fisicos e de ataque.",
            "Tambem reduz deslocamento em 1 metro por graduacao.",
          ],
        },
        {
          titulo: "Escalonamento",
          itens: [
            "Ao atingir penalidade total de -4, alvo testa novamente Vontade.",
            "Falha: fica Lento; falha critica: Imobilizado por 1 turno.",
            "Usuario pode reduzir raio livremente e efeito cessa fora da area.",
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
    resumo: "Onda cinetica que empurra alvos e cria colisoes taticas.",
    efeitoPrincipal:
      "Ao acertar, alvo testa Forca; falha e empurrado distancia total da graduacao, com risco de queda/colisao.",
    extras: [
      { nome: "Impacto Massivo", custo: "+1 por graduacao" },
      { nome: "Repulsao Continua", custo: "+1 por graduacao" },
      { nome: "Impacto Brutal", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Somente Controle", custo: "-1 por graduacao" },
      { nome: "Direcional", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Repelir projeta onda cinetica de Eter para deslocamento forcado agressivo.",
        "E uma ferramenta de posicionamento e abertura por colisao/queda.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Realiza ataque 1d20 + CaC; no acerto, alvo testa Forca contra CD 10 + graduacao.",
            "Sucesso: empurra metade da distancia; falha: distancia total; falha critica: distancia total + Caido.",
          ],
        },
        {
          titulo: "Interacao com Ambiente",
          itens: [
            "Em colisao, sofre 1 dano a cada 4 metros restantes do deslocamento.",
            "Quedas aplicam dano normal de queda.",
            "Nao causa dano direto por padrao sem extras.",
          ],
        },
      ],
    },
  },
  {
    id: "espadas-surto-adrenalina",
    nome: "Surto de Adrenalina",
    naipe: "Espadas",
    tipo: "Fortalecimento",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao +2",
    resumo: "Modo agressivo extremo com alto ganho ofensivo e custo defensivo.",
    efeitoPrincipal:
      "Concede bonus progressivos de ataque, dano, testes de Forca e deslocamento; em troca sofre penalidades de Defesa e controle.",
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
        "Surto de Adrenalina eleva o corpo a estado agressivo maximo, trocando defesa por ofensiva.",
        "Prioriza pressao de combate direto e dominio fisico continuo.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "Consome Eter padrao +2 por turno enquanto ativo.",
            "Concede bonus progressivos em ataque, dano, testes de Forca e deslocamento por faixa de graduacao.",
            "Aplica penalidades de -2 Defesa e -1 em testes de precisao/controle.",
          ],
        },
        {
          titulo: "Duracao e Risco",
          itens: [
            "Mantem por metade da graduacao em turnos (para cima).",
            "Acima do limite, sofre -2 cumulativo em todos os testes por turno.",
            "Ao encerrar, sofre penalidade global e nao pode reativar ate recuperar.",
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
    custoEterBase: "padrao +2",
    resumo:
      "Impacto localizado que ignora resistencia e aplica efeitos criticos.",
    efeitoPrincipal:
      "Causa dano igual a graduacao, ignora 1 Resistencia por 2 graduacoes e aplica um efeito de Colapso escolhido.",
    extras: [
      { nome: "Dupla Aplicacao", custo: "+2 por graduacao" },
      { nome: "Execucao Perfeita", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado (Seres vivos)", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Colapso concentra Eter em contato direto para dano localizado com efeito tecnico.",
        "E uma das tecnicas de maior precisao e letalidade em Espadas.",
      ],
      secoes: [
        {
          titulo: "Funcionamento",
          itens: [
            "No acerto corpo a corpo, causa dano igual a graduacao.",
            "Ignora 1 ponto de Resistencia a cada 2 graduacoes (para cima).",
            "Apos o dano, escolhe um efeito: Colapso Fisico, Ruptura Interna, Dreno de Eter, Paralisia Parcial ou Quebra de Defesa.",
          ],
        },
        {
          titulo: "Regras",
          itens: [
            "Afeta um unico alvo por uso e exige toque direto.",
            "Nao pode ser usado a distancia.",
            "Quebra de Defesa ja influencia o proprio ataque quando aplicavel.",
          ],
        },
      ],
    },
  },
];

