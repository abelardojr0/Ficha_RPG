import type { PowerDefinition } from "./powers";

export const PODERES_PAUS: PowerDefinition[] = [
  {
    id: "paus-adaptacao-corporal",
    nome: "Adaptacao Corporal",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Adapta o corpo para ignorar penalidades ambientais e condicoes adversas especificas.",
    efeitoPrincipal:
      "Cada graduacao concede 1 adaptacao ativa; pode trocar 1 por turno.",
    extras: [
      { nome: "Adaptacao Instantanea", custo: "+1 por graduacao" },
      { nome: "Adaptacao Reativa", custo: "+1 por graduacao" },
      { nome: "Adaptacao Persistente", custo: "+1 fixo" },
      { nome: "Resposta Aprimorada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Adaptacao Lenta", custo: "-1 por graduacao" },
      { nome: "Dependente de Estimulo", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
    ],
    detalhes: {
      introducao: [
        "Paus representa evolucao corporal situacional: sobreviver e operar sem perder eficiencia.",
      ],
      secoes: [
        {
          titulo: "Lista de Adaptacoes",
          itens: [
            "Respiracao Adaptada, Isolamento Termico, Pressao Estavel, Adaptacao Ambiental.",
            "Visao Adaptada, Deteccao Especifica, Foco Sensorial, Aderencia.",
            "Locomocao Adaptada, Movimento Aquatico, Flexibilidade Corporal, Filtro Biologico.",
            "Eficiencia Fisica, Equilibrio Adaptativo.",
          ],
        },
        {
          titulo: "Limites",
          itens: [
            "Nao concede bonus numerico direto de ataque/dano/defesa.",
            "Nao substitui voo, intangibilidade ou resistencia direta.",
          ],
        },
      ],
    },
  },
  {
    id: "paus-armamento-organico",
    nome: "Armamento Organico",
    naipe: "Paus",
    tipo: "Ataque / Alteracao",
    acao: "Padrao",
    alcance: "Corpo a Corpo",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Transforma o corpo em armas naturais adaptativas de corte, perfuracao ou impacto.",
    efeitoPrincipal:
      "Dano base igual a graduacao, com propriedade ofensiva escolhida na ativacao.",
    extras: [
      { nome: "Projecao Corporal", custo: "+1 por graduacao" },
      { nome: "Alcance Estendido", custo: "+1 por graduacao" },
      { nome: "Forma Versatil", custo: "+1 por graduacao" },
      { nome: "Ataque Fracionado", custo: "+1 por graduacao" },
      { nome: "Penetracao Adaptativa", custo: "+2 por graduacao" },
      { nome: "Carapaca Organica", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Exposto", custo: "-1 por graduacao" },
      { nome: "Forma Fixa", custo: "-1 por graduacao" },
      { nome: "Consumo Elevado", custo: "-1 por graduacao" },
    ],
    detalhes: {
      secoes: [
        {
          titulo: "Propriedades",
          itens: [
            "Corte Preciso: +1 no teste de ataque.",
            "Perfuracao: ignora +1 de Resistencia.",
            "Impacto Brutal: em margem de 5+, causa +2 dano em vez de +1.",
          ],
        },
      ],
    },
  },
  {
    id: "paus-blindagem",
    nome: "Blindagem",
    naipe: "Paus",
    tipo: "Alteracao / Defesa",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo: "Defesa adaptativa que melhora contra dano repetido do mesmo tipo.",
    efeitoPrincipal:
      "Base de +1 Resistencia por 2 graduacoes, com adaptacao progressiva ate +2.",
    extras: [
      { nome: "Adaptacao Instantanea", custo: "+1 por graduacao" },
      { nome: "Memoria Adaptativa", custo: "+1 por graduacao" },
      { nome: "Especializacao Adaptativa", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Adaptacao Lenta", custo: "-1 por graduacao" },
      { nome: "Resposta Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
    ],
    detalhes: {
      secoes: [
        {
          titulo: "Adaptação",
          itens: [
            "Mesmo tipo de dano: +1 adaptacao, maximo +2.",
            "Troca de tipo, 1 turno sem dano ou desativacao remove adaptacao.",
          ],
        },
      ],
    },
  },
  {
    id: "paus-corpo-elemental",
    nome: "Corpo Elemental",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Movimento",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "2 por turno",
    resumo:
      "Converte o corpo em forma elemental com vantagens e limitacoes especializadas.",
    efeitoPrincipal:
      "Escolhe tipo elemental (solido, fluido/particulado ou energetico) e aplica regras proprias.",
    extras: [
      { nome: "Forma Adaptativa", custo: "+1 por graduacao" },
      { nome: "Corpo Expandido", custo: "+1 por graduacao" },
      { nome: "Essencia Intensificada", custo: "+1 por graduacao" },
      { nome: "Forma Persistente", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Vulnerabilidade Elemental", custo: "-1 por graduacao" },
      { nome: "Forma Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Interacao Restrita", custo: "-1 por graduacao" },
    ],
    detalhes: {
      secoes: [
        {
          titulo: "Tipos",
          itens: [
            "Solido: +1 Resistencia por 2 graduacoes, -1 deslocamento por 2 graduacoes.",
            "Fluido/Particulado: atravessa aberturas de ate 10 cm, +2 para escapar de agarrar.",
            "Energetico: dano de contato (1 por 2 graduacoes), -1 Resistencia.",
          ],
        },
      ],
    },
  },
  {
    id: "paus-crescimento",
    nome: "Crescimento",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Expande o corpo para ganhar forca, dano e alcance com penalidade defensiva.",
    efeitoPrincipal:
      "Por graduacao: +1 Forca, +1 dano CaC, +1 m alcance, -1 Defesa, -1 Agilidade.",
    extras: [
      { nome: "Dominio de Massa", custo: "+1 por graduacao" },
      { nome: "Passo Devastador", custo: "+2 por graduacao" },
      { nome: "Alcance Dominante", custo: "+2 por graduacao" },
      { nome: "Corpo Colossal", custo: "+1 por graduacao" },
      { nome: "Impacto Ampliado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Alvo Gigante", custo: "-1 por graduacao" },
      { nome: "Movimento Pesado", custo: "-1 por graduacao" },
      { nome: "Inercia Corporal", custo: "-1 por graduacao" },
      { nome: "Descontrole de Massa", custo: "-1 por graduacao" },
      { nome: "Espaco Limitado", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Crescimento",
          colunas: [
            "Graduacao",
            "Tamanho",
            "Altura",
            "Alcance",
            "Forca",
            "Dano",
            "Defesa",
          ],
          linhas: [
            ["1", "Grande", "3 m", "+1 m", "+1", "+1", "-1"],
            ["2", "Enorme", "4 m", "+2 m", "+2", "+2", "-2"],
            ["3", "Gigante", "6 m", "+3 m", "+3", "+3", "-3"],
            ["4", "Colossal", "8 m", "+4 m", "+4", "+4", "-4"],
            ["5", "Titanico", "12 m", "+5 m", "+5", "+5", "-5"],
            ["6", "Monstruoso", "16 m", "+6 m", "+6", "+6", "-6"],
            ["7", "Colosso", "20 m", "+7 m", "+7", "+7", "-7"],
            ["8", "Mega Colosso", "25 m", "+8 m", "+8", "+8", "-8"],
            ["9", "Kaiju", "30 m", "+9 m", "+9", "+9", "-9"],
            ["10", "Supremo", "40 m", "+10 m", "+10", "+10", "-10"],
          ],
        },
      ],
    },
  },
  {
    id: "paus-densidade",
    nome: "Densidade",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "1 por turno",
    resumo:
      "Compacta o corpo para ganhar forca e resistencia com perda de mobilidade.",
    efeitoPrincipal:
      "+1 Forca por graduacao, +1 Resistencia por 2 graduacoes e penalidades de deslocamento/agilidade.",
    extras: [
      { nome: "Impacto Concentrado", custo: "+1 por graduacao" },
      { nome: "Corpo Estavel", custo: "+1 por graduacao" },
      { nome: "Peso Esmagador", custo: "+1 por graduacao" },
      { nome: "Inercia Controlada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Pesado", custo: "-1 por graduacao" },
      { nome: "Rigidez", custo: "-1 por graduacao" },
      { nome: "Incontrolavel", custo: "-1 por graduacao" },
      { nome: "Exaustivo", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-elasticidade",
    nome: "Elasticidade",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Corpo maleavel que aumenta alcance e reduz impactos de queda/colisao.",
    efeitoPrincipal:
      "Cada graduacao concede +1 m alcance CaC e mitigacao de impacto ambiental.",
    extras: [
      { nome: "Elasticidade Extrema", custo: "+1 por graduacao" },
      { nome: "Corpo Disforme", custo: "+1 por graduacao" },
      { nome: "Alongamento Rapido", custo: "+1 por graduacao" },
      { nome: "Mobilidade Elastica", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Corpo Instavel", custo: "-1 por graduacao" },
      { nome: "Elasticidade Limitada", custo: "-1 por graduacao" },
      { nome: "Recuperacao Lenta", custo: "-1 por graduacao" },
      { nome: "Deformacao Exposta", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-encolhimento",
    nome: "Encolhimento",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Reduz o corpo para ganhar furtividade/defesa e perder capacidade ofensiva.",
    efeitoPrincipal:
      "Por graduacao: +1 Furtividade, -1 Forca, -1 dano CaC, -1 m alcance; Defesa sobe por degraus.",
    extras: [
      { nome: "Presenca Imperceptivel", custo: "+1 por graduacao" },
      { nome: "Movimento Fluido", custo: "+1 por graduacao" },
      { nome: "Desaparecimento Total", custo: "+1 fixo" },
      { nome: "Evasao Instintiva", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Extremamente Fragil", custo: "-1 por graduacao" },
      { nome: "Dependente de Cobertura", custo: "-1 por graduacao" },
      { nome: "Mobilidade Limitada", custo: "-1 por graduacao" },
      { nome: "Impacto Nulo", custo: "-1 por graduacao" },
    ],
    detalhes: {
      tabelas: [
        {
          titulo: "Encolhimento",
          colunas: [
            "Graduacao",
            "Tamanho",
            "Altura",
            "Furtividade",
            "Defesa",
            "Forca",
            "Dano",
            "Alcance",
          ],
          linhas: [
            ["1", "Pequeno", "1 m", "+1", "0", "-1", "-1", "-1 m"],
            ["2", "Muito Pequeno", "60 cm", "+2", "+1", "-2", "-2", "-2 m"],
            ["3", "Minusculo", "30 cm", "+3", "+1", "-3", "-3", "-3 m"],
            ["4", "Diminuto", "15 cm", "+4", "+2", "-4", "-4", "-4 m"],
            ["5", "Miniatura", "7 cm", "+5", "+2", "-5", "-5", "-5 m"],
            ["6", "Inseto", "3 cm", "+6", "+3", "-6", "-6", "-6 m"],
            ["7", "Grao", "1 cm", "+7", "+3", "-7", "-7", "-7 m"],
            ["8", "Particula", "5 mm", "+8", "+4", "-8", "-8", "-8 m"],
            ["9", "Poeira", "1 mm", "+9", "+4", "-9", "-9", "-9 m"],
            ["10", "Microscopico", "<1 mm", "+10", "+5", "-10", "-10", "-10 m"],
          ],
        },
      ],
    },
  },
  {
    id: "paus-fator-de-cura",
    nome: "Fator de Cura",
    naipe: "Paus",
    tipo: "Defesa / Alteracao",
    acao: "Nenhuma",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "1 por turno",
    resumo:
      "Converte dano recebido em pontos reativos para cura ou mitigacao no turno.",
    efeitoPrincipal:
      "Ganha 1 ponto por ataque sofrido; gasta em cura (1:1) ou reducao de dano.",
    extras: [
      { nome: "Evolucao Imediata", custo: "+1 por graduacao" },
      { nome: "Resposta Intensificada", custo: "+1 por graduacao" },
      { nome: "Conversao Biologica", custo: "+1 por graduacao" },
      { nome: "Adaptacao Especifica", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Dependente de Dano", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Sobrecarga", custo: "-1 por graduacao" },
      { nome: "Recuperacao Ineficiente", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-forma-animal",
    nome: "Forma Animal",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Movimento",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Assume formas animais com focos especificos de combate, mobilidade e infiltracao.",
    efeitoPrincipal:
      "Cada graduacao adiciona formas conhecidas; apenas uma forma ativa por vez.",
    extras: [
      { nome: "Troca Reativa", custo: "+1 por graduacao" },
      { nome: "Instinto Predatorio", custo: "+1 por graduacao" },
      { nome: "Continuidade Biologica", custo: "+1 por graduacao" },
      { nome: "Especializacao Evolutiva", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Transicao Vulneravel", custo: "-1 por graduacao" },
      { nome: "Instinto Primitivo", custo: "-1 por graduacao" },
      { nome: "Adaptacao Incompleta", custo: "-1 por graduacao" },
      { nome: "Rigidez Biologica", custo: "-1 por graduacao" },
    ],
    detalhes: {
      secoes: [
        {
          titulo: "Categorias de Forma",
          itens: [
            "Terrestre, Pesada, Agil, Aerea, Aquatica, Pequena, Mini, Venenosa, Docil, Escaladora.",
            "Cada categoria aplica bonus e penalidades especificos.",
          ],
        },
      ],
    },
  },
  {
    id: "paus-imitacao",
    nome: "Imitacao",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Movimento",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "+1",
    resumo:
      "Copia temporariamente poderes observados, com limites de custo, graduacao e estabilidade.",
    efeitoPrincipal:
      "Copia 1 poder observado e aplica penalidade de copia, salvo extras.",
    extras: [
      { nome: "Memoria Expandida", custo: "+1 por graduacao" },
      { nome: "Imitacao Rapida", custo: "+1 por graduacao" },
      { nome: "Imitacao Refinada", custo: "+2 por graduacao" },
      { nome: "Adaptacao Especializada", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Exige Observacao Direta", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Imitacao Limitada", custo: "-1 por graduacao" },
      { nome: "Copia Imperfeita", custo: "-1 por graduacao" },
    ],
    detalhes: {
      secoes: [
        {
          titulo: "Limites",
          itens: [
            "Graduacao copiada maxima = graduacao de Imitacao.",
            "Custo maximo do poder copiado = graduacao de Imitacao x 2.",
            "Nao copia poderes permanentes passivos, mentais ou narrativos.",
          ],
        },
        {
          titulo: "Slots",
          itens: [
            "1 slot a cada 3 graduacoes (3, 6, 9).",
            "Troca entre slots como acao de movimento.",
          ],
        },
      ],
    },
  },
  {
    id: "paus-imovel",
    nome: "Imovel",
    naipe: "Paus",
    tipo: "Defesa",
    acao: "Reacao",
    alcance: "Pessoal",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 1,
    custoPontosTexto: "1 ponto por graduacao",
    custoEterBase: "1",
    resumo:
      "Reacao para resistir deslocamento forcado, empurroes e tentativas de mover o usuario.",
    efeitoPrincipal:
      "Ganha bonus progressivo em testes para resistir deslocamento forcado no gatilho.",
    extras: [
      { nome: "Ancora Absoluta", custo: "+1 por graduacao" },
      { nome: "Retencao de Posicao", custo: "+1 por graduacao" },
      { nome: "Resposta Automatizada", custo: "+1 fixo" },
    ],
    falhas: [
      { nome: "Somente Vertical", custo: "-1 por graduacao" },
      { nome: "Dependente de Base", custo: "-1 por graduacao" },
      { nome: "Rigidez", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-intangibilidade",
    nome: "Intangibilidade",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 5,
    custoPontosTexto: "5 pontos por graduacao",
    custoEterBase: "+2",
    resumo:
      "Coloca o corpo fora da interacao fisica convencional para atravessar materia e evitar ataques.",
    efeitoPrincipal:
      "Ataques fisicos contra o usuario sofrem -5; pode atravessar materia por limite de espessura.",
    extras: [
      { nome: "Intangibilidade Parcial", custo: "+1 por graduacao" },
      { nome: "Movimento Livre", custo: "+1 por graduacao" },
      { nome: "Fase Estavel", custo: "+1 por graduacao" },
      { nome: "Transicao Segura", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Dependente", custo: "-1 por graduacao" },
      { nome: "Fase Imperfeita", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-invisibilidade",
    nome: "Invisibilidade",
    naipe: "Paus",
    tipo: "Sensorial / Alteracao",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Remove presenca visual e exige deteccao ativa para alvo de efeitos direcionados.",
    efeitoPrincipal:
      "CD de deteccao = 10 + graduacao; falha impede alvo direcionado sem suposicao.",
    extras: [
      { nome: "Camuflagem Dinamica", custo: "+2 por graduacao" },
      { nome: "Afeta Outros", custo: "+1 por graduacao" },
      { nome: "Presenca Nula", custo: "+1 por graduacao" },
      { nome: "Ocultacao Aprimorada", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Passiva", custo: "-1 por graduacao" },
      { nome: "Rastro Perceptivel", custo: "-1 por graduacao" },
      { nome: "Consumo Elevado", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-manifestacao",
    nome: "Manifestacao",
    naipe: "Paus",
    tipo: "Ataque",
    acao: "Padrao",
    alcance: "Corpo a Corpo",
    duracao: "Instantanea",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Fragmenta o dano em multiplos impactos para distribuir pressao entre alvos.",
    efeitoPrincipal:
      "Dano total igual a graduacao, dividido em fragmentos independentes.",
    extras: [
      { nome: "Precisao Adaptativa", custo: "+1 por graduacao" },
      { nome: "Saturacao Controlada", custo: "+1 por graduacao" },
      { nome: "Foco Concentrado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Fragmentacao Excessiva", custo: "-1 por graduacao" },
      { nome: "Disperso", custo: "-1 por graduacao" },
    ],
    detalhes: {
      secoes: [
        {
          titulo: "Fragmentos",
          itens: [
            "Numero maximo de partes: metade da graduacao (para cima).",
            "Cada fragmento deve ter no minimo 1 de dano.",
            "Resistencia e aplicada separadamente a cada fragmento.",
          ],
        },
      ],
    },
  },
  {
    id: "paus-membros-extras",
    nome: "Membros Extras",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 4,
    custoPontosTexto: "4 pontos por graduacao",
    custoEterBase: "customizavel",
    resumo:
      "Cria membros adicionais para ampliar interacoes fisicas e dividir dano em ataques.",
    efeitoPrincipal:
      "1 membro adicional por graduacao e ganho progressivo de interacoes extras.",
    extras: [
      { nome: "Coordenacao Avancada", custo: "+1 por graduacao" },
      { nome: "Alcance Estendido", custo: "+1 por graduacao" },
      { nome: "Especializado", custo: "+1 fixo" },
      { nome: "Pressao Constante", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Descoordenacao", custo: "-1 por graduacao" },
      { nome: "Sobrecarga", custo: "-1 por graduacao" },
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-metamorfose",
    nome: "Metamorfose",
    naipe: "Paus",
    tipo: "Alteracao",
    acao: "Movimento",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 3,
    custoPontosTexto: "3 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Altera aparencia para infiltracao e disfarce sem mudar capacidades base.",
    efeitoPrincipal:
      "Escala qualidade de imitacao visual/voz e dificulta deteccao por Percepcao.",
    extras: [
      { nome: "Mudanca Rapida", custo: "+1 por graduacao" },
      { nome: "Imitacao Precisa", custo: "+1 por graduacao" },
      { nome: "Memoria de Forma", custo: "+1 por graduacao" },
      { nome: "Mascara Perfeita", custo: "+2 por graduacao" },
    ],
    falhas: [
      { nome: "Detalhes Imperfeitos", custo: "-1 por graduacao" },
      { nome: "Dependente de Observacao", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Imitacao Limitada", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-supermovimento",
    nome: "Supermovimento",
    naipe: "Paus",
    tipo: "Movimento",
    acao: "Movimento",
    alcance: "Pessoal",
    duracao: "Sustentado",
    custoPontosPorGraduacao: 2,
    custoPontosTexto: "2 pontos por graduacao",
    custoEterBase: "padrao",
    resumo:
      "Desbloqueia formas especiais de deslocamento sem aumentar velocidade base.",
    efeitoPrincipal:
      "Cada graduacao concede 1 forma de movimento especial selecionada.",
    extras: [
      { nome: "Velocidade", custo: "+1 por graduacao" },
      { nome: "Transicao Fluida", custo: "+1 por graduacao" },
      { nome: "Movimento Ofensivo", custo: "+1 por graduacao" },
      { nome: "Compartilhado", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Restricao", custo: "-1 por graduacao" },
      { nome: "Instavel", custo: "-1 por graduacao" },
      { nome: "Lento", custo: "-1 por graduacao" },
      { nome: "Contato", custo: "-1 por graduacao" },
    ],
  },
  {
    id: "paus-supersentidos",
    nome: "Supersentidos",
    naipe: "Paus",
    tipo: "Sensorial",
    acao: "Livre",
    alcance: "Pessoal",
    duracao: "Continuo",
    custoPontosPorGraduacao: 1,
    custoPontosTexto: "1 ponto por graduacao",
    custoEterBase: "1 por turno",
    resumo:
      "Amplia sentidos para detectar padroes, alvos ocultos e fenomenos especiais.",
    efeitoPrincipal:
      "Cada graduacao adiciona 1 aprimoramento sensorial escolhido.",
    extras: [
      { nome: "Sincronizado", custo: "+1 por graduacao" },
      { nome: "Compartilhado", custo: "+1 por graduacao" },
      { nome: "Area", custo: "+1 por graduacao" },
      { nome: "Precisao Absoluta", custo: "+1 por graduacao" },
    ],
    falhas: [
      { nome: "Limitado", custo: "-1 por graduacao" },
      { nome: "Sobrecarga Sensorial", custo: "-1 por graduacao" },
      { nome: "Distracao", custo: "-1 por graduacao" },
      { nome: "Dependente", custo: "-1 por graduacao" },
    ],
    detalhes: {
      secoes: [
        {
          titulo: "Aprimoramentos",
          itens: [
            "Aguçado, Alcance Ampliado, Precisao, Radial, Analitico, Deteccao.",
            "Espectral, Penetracao, Rastreamento, Antecipacao.",
            "Bonus de Percepcao geral limitado a +2 por tipo de teste.",
          ],
        },
      ],
    },
  },
];
