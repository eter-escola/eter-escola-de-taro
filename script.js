
// ==========================================
// CONEXÃO COM O SUPABASE
// ==========================================

const SUPABASE_URL = "https://rpczkzbarchvomctltfx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_sXUCUTl8eEdAoPXdVaAcqQ_m0R8pRZI";

const clienteSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ==========================================
// IDENTIFICAÇÃO DOS 22 ARCANOS MAIORES
// ==========================================

const arcanosMaiores = [
  { numero: 0, nome: "O Louco" },
  { numero: 1, nome: "O Mago" },
  { numero: 2, nome: "A Sacerdotisa" },
  { numero: 3, nome: "A Imperatriz" },
  { numero: 4, nome: "O Imperador" },
  { numero: 5, nome: "O Hierofante" },
  { numero: 6, nome: "Os Enamorados" },
  { numero: 7, nome: "O Carro" },
  { numero: 8, nome: "A Força" },
  { numero: 9, nome: "O Eremita" },
  { numero: 10, nome: "A Roda da Fortuna" },
  { numero: 11, nome: "A Justiça" },
  { numero: 12, nome: "O Enforcado" },
  { numero: 13, nome: "A Morte" },
  { numero: 14, nome: "A Temperança" },
  { numero: 15, nome: "O Diabo" },
  { numero: 16, nome: "A Torre" },
  { numero: 17, nome: "A Estrela" },
  { numero: 18, nome: "A Lua" },
  { numero: 19, nome: "O Sol" },
  { numero: 20, nome: "O Julgamento" },
  { numero: 21, nome: "O Mundo" }
];


// ==========================================
// IDENTIFICAÇÃO DOS 56 ARCANOS MENORES
// ==========================================

const naipesArcanosMenores = {
  Paus: [
    "Ás de Paus", "Dois de Paus", "Três de Paus",
    "Quatro de Paus", "Cinco de Paus", "Seis de Paus",
    "Sete de Paus", "Oito de Paus", "Nove de Paus",
    "Dez de Paus", "Pajem de Paus", "Cavaleiro de Paus",
    "Rainha de Paus", "Rei de Paus"
  ],

  Copas: [
    "Ás de Copas", "Dois de Copas", "Três de Copas",
    "Quatro de Copas", "Cinco de Copas", "Seis de Copas",
    "Sete de Copas", "Oito de Copas", "Nove de Copas",
    "Dez de Copas", "Pajem de Copas", "Cavaleiro de Copas",
    "Rainha de Copas", "Rei de Copas"
  ],

  Espadas: [
    "Ás de Espadas", "Dois de Espadas", "Três de Espadas",
    "Quatro de Espadas", "Cinco de Espadas", "Seis de Espadas",
    "Sete de Espadas", "Oito de Espadas", "Nove de Espadas",
    "Dez de Espadas", "Pajem de Espadas", "Cavaleiro de Espadas",
    "Rainha de Espadas", "Rei de Espadas"
  ],

  Ouros: [
    "Ás de Ouros", "Dois de Ouros", "Três de Ouros",
    "Quatro de Ouros", "Cinco de Ouros", "Seis de Ouros",
    "Sete de Ouros", "Oito de Ouros", "Nove de Ouros",
    "Dez de Ouros", "Pajem de Ouros", "Cavaleiro de Ouros",
    "Rainha de Ouros", "Rei de Ouros"
  ]
};


// ==========================================
// ESTADO ATUAL DA BIBLIOTECA
// ==========================================

let tipoBibliotecaAtual = "maiores";
let naipeAtual = "Paus";
let indiceCartaAtual = 0;


// ==========================================
// CONTROLE DAS TELAS
// ==========================================

function mostrarTela(tela) {

  const secoesPublicas = [
    "inicio",
    "sobre",
    "curso",
    "cartas"
  ];

  const telasInternas = [
    "login",
    "cadastro",
    "pagamento",
    "aluno",
    "arcanos-maiores",
    "aula-carta"
  ];

  // Controla as seções públicas.
  // Quando a tela for "inicio", todas as seções públicas aparecem.
  secoesPublicas.forEach(function(id) {

    const elemento = document.getElementById(id);

    if (elemento) {

      if (tela === "inicio") {
        elemento.hidden = false;
      } else {
        elemento.hidden = tela !== id;
      }

    }

  });

  // Controla as telas internas.
  telasInternas.forEach(function(nome) {

    const elemento = document.getElementById("tela-" + nome);

    if (elemento) {
      elemento.hidden = tela !== nome;
    }

  });

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

}


// ==========================================
// VERIFICAR SE O ALUNO PAGOU
// ==========================================

async function verificarAcesso() {

  const {
    data: sessaoData,
    error: erroSessao
  } = await clienteSupabase.auth.getSession();

  if (erroSessao) {
    throw erroSessao;
  }

  if (!sessaoData.session) {
    return false;
  }

  const {
    data,
    error
  } = await clienteSupabase.rpc(
    "verificar_acesso_curso"
  );

  if (error) {

    console.error(
      "Erro ao verificar pagamento:",
      error
    );

    throw new Error(
      "Não foi possível verificar seu pagamento."
    );

  }

  return data === true;

}


// ==========================================
// ENTRAR NA CONTA
// ==========================================

function entrar() {
  mostrarTela("login");
}


// ==========================================
// CADASTRO DO ALUNO
// ==========================================

async function fazerCadastro(event) {

  event.preventDefault();

  const nome = document
    .getElementById("cadastro-nome")
    .value.trim();

  const nascimento = document
    .getElementById("cadastro-nascimento")
    .value;

  const cpf = document
    .getElementById("cadastro-cpf")
    .value.trim();

  const email = document
    .getElementById("cadastro-email")
    .value.trim();

  const telefone = document
    .getElementById("cadastro-telefone")
    .value.trim();

  const senha = document
    .getElementById("cadastro-senha")
    .value;

  const confirmacao = document
    .getElementById("cadastro-confirmacao")
    .value;

  if (
    !nome ||
    !nascimento ||
    !cpf ||
    !email ||
    !telefone ||
    !senha
  ) {

    alert("Preencha todos os campos.");
    return false;

  }

  if (senha.length < 8) {

    alert(
      "Sua senha precisa ter pelo menos 8 caracteres."
    );

    return false;

  }

  if (senha !== confirmacao) {

    alert(
      "As senhas não são iguais. Confira e tente novamente."
    );

    return false;

  }

  try {

    const {
      data,
      error
    } = await clienteSupabase.auth.signUp({

      email: email,

      password: senha,

      options: {

        data: {
          nome_completo: nome,
          data_nascimento: nascimento,
          cpf: cpf,
          telefone: telefone
        },

        emailRedirectTo: window.location.origin

      }

    });

    if (error) {
      throw error;
    }

    if (data.session) {

      alert(
        "Cadastro realizado com sucesso! Agora vamos continuar com o pagamento."
      );

      mostrarTela("pagamento");

    } else {

      alert(
        "Cadastro realizado! Enviamos um e-mail de confirmação para " +
        email +
        ". Confirme seu e-mail antes de entrar."
      );

      mostrarTela("login");

    }

  } catch (error) {

    console.error(
      "Erro no cadastro:",
      error
    );

    alert(
      "Não foi possível realizar o cadastro: " +
      error.message
    );

  }

  return false;

}


// ==========================================
// LOGIN DO ALUNO
// ==========================================

async function fazerLogin(event) {

  event.preventDefault();

  const email = document
    .getElementById("login-email")
    .value.trim();

  const senha = document
    .getElementById("login-senha")
    .value;

  if (!email || !senha) {

    alert("Digite seu e-mail e sua senha.");
    return false;

  }

  try {

    const {
      error
    } = await clienteSupabase.auth.signInWithPassword({

      email: email,
      password: senha

    });

    if (error) {
      throw error;
    }

    const temAcesso = await verificarAcesso();

    if (temAcesso) {

      alert(
        "Login realizado! Pagamento aprovado. Bem-vindo ao Curso Éter!"
      );

      mostrarTela("aluno");

    } else {

      alert(
        "Login realizado! Ainda não encontramos um pagamento aprovado. Vamos continuar com o pagamento."
      );

      mostrarTela("pagamento");

    }

  } catch (error) {

    console.error(
      "Erro no login:",
      error
    );

    alert(
      "Não foi possível verificar sua conta: " +
      error.message
    );

  }

  return false;

}


// ==========================================
// PAGAMENTO PELO MERCADO PAGO
// ==========================================

async function iniciarPagamento() {

  const opcao = document.querySelector(
    'input[name="pagamento"]:checked'
  );

  if (!opcao) {

    alert(
      "Escolha Pix ou cartão de crédito para continuar."
    );

    return;

  }

  try {

    const {
      data: sessaoData
    } = await clienteSupabase.auth.getSession();

    const sessao = sessaoData.session;

    if (!sessao) {

      alert(
        "Sua sessão expirou. Entre novamente na sua conta."
      );

      mostrarTela("login");
      return;

    }

    alert(
      "Estamos preparando seu pagamento. Aguarde..."
    );

    const {
      data,
      error
    } = await clienteSupabase.functions.invoke(
      "criar-pagamento",
      {
        method: "POST"
      }
    );

    if (error) {

      console.error(
        "Erro ao chamar criar-pagamento:",
        error
      );

      throw new Error(
        "Não foi possível iniciar o pagamento. Tente novamente."
      );

    }

    if (!data || !data.checkout_url) {

      console.error(
        "Resposta recebida:",
        data
      );

      throw new Error(
        "O Mercado Pago não retornou o endereço do pagamento."
      );

    }

    window.location.href = data.checkout_url;

  } catch (error) {

    console.error(
      "Erro no pagamento:",
      error
    );

    alert(
      error.message ||
      "Ocorreu um erro ao iniciar o pagamento."
    );

  }

}


// ==========================================
// ACESSO AO CURSO
// ==========================================

async function abrirCurso() {

  try {

    const temAcesso = await verificarAcesso();

    mostrarTela(
      temAcesso ? "aluno" : "login"
    );

  } catch (error) {

    alert(error.message);
    mostrarTela("login");

  }

}


async function abrirAulas() {

  try {

    const temAcesso = await verificarAcesso();

    if (!temAcesso) {

      alert(
        "Seu acesso ainda não foi liberado. É necessário ter um pagamento aprovado."
      );

      mostrarTela("pagamento");
      return;

    }

    await abrirCartas("maiores");

  } catch (error) {

    alert(error.message);
    mostrarTela("login");

  }

}


// ==========================================
// FUNÇÕES AUXILIARES DA BIBLIOTECA
// ==========================================

function obterCartasAtuais() {

  if (tipoBibliotecaAtual === "maiores") {
    return arcanosMaiores;
  }

  return (
    naipesArcanosMenores[naipeAtual] || []
  ).map(function(nome, indice) {

    return {
      numero: indice + 1,
      nome: nome,
      naipe: naipeAtual
    };

  });

}


function atualizarTituloBiblioteca(texto) {

  const tela = document.getElementById(
    "tela-arcanos-maiores"
  );

  if (!tela) {
    return;
  }

  const titulo = tela.querySelector("h1, h2");

  if (titulo) {
    titulo.textContent = texto;
  }

}


function criarBotaoNavegacao(
  texto,
  aoClicar,
  classe
) {

  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;

  if (classe) {
    botao.className = classe;
  }

  botao.addEventListener(
    "click",
    aoClicar
  );

  return botao;

}


// ==========================================
// CRIAR A GALERIA DOS ARCANOS MAIORES
// ==========================================

function renderizarArcanosMaiores() {

  const galeria = document.getElementById(
    "galeria-arcanos-maiores"
  );

  if (!galeria) {

    console.error(
      "Não encontrei o elemento galeria-arcanos-maiores no HTML."
    );

    alert(
      "Não foi possível encontrar a área da biblioteca no site."
    );

    return;

  }

  galeria.replaceChildren();

  atualizarTituloBiblioteca(
    "Os 22 Arcanos Maiores"
  );

  galeria.appendChild(
    criarBotaoNavegacao(
      "Ver os 56 Arcanos Menores →",

      function() {
        abrirCartas("menores");
      },

      "botao-navegar-biblioteca"
    )
  );

  arcanosMaiores.forEach(function(carta, indice) {

    const artigo = document.createElement("article");
    artigo.className = "carta-card";

    const numero = document.createElement("span");
    numero.className = "sobretitulo";
    numero.textContent = "ARCANO " + carta.numero;

    const titulo = document.createElement("h3");
    titulo.textContent = carta.nome;

    const botao = criarBotaoNavegacao(
      "Estudar esta carta →",

      function() {
        abrirAulaCarta(indice);
      }
    );

    artigo.append(
      numero,
      titulo,
      botao
    );

    galeria.appendChild(artigo);

  });

}


// ==========================================
// CRIAR A SELEÇÃO DOS NAIPES
// ==========================================

function renderizarSelecaoDeNaipes(galeria) {

  const seletor = document.createElement("div");
  seletor.className = "seletor-naipes";

  const titulo = document.createElement("h3");
  titulo.textContent = "Escolha um naipe";

  seletor.appendChild(titulo);

  Object.keys(naipesArcanosMenores).forEach(function(naipe) {

    const botao = criarBotaoNavegacao(
      naipe,

      function() {

        naipeAtual = naipe;
        renderizarArcanosMenores();

      },

      "botao-naipe"
    );

    if (naipe === naipeAtual) {
      botao.classList.add("ativo");
    }

    seletor.appendChild(botao);

  });

  galeria.appendChild(seletor);

}


// ==========================================
// CRIAR A BIBLIOTECA DOS ARCANOS MENORES
// ==========================================

function renderizarArcanosMenores() {

  const galeria = document.getElementById(
    "galeria-arcanos-maiores"
  );

  if (!galeria) {

    console.error(
      "Não encontrei o elemento galeria-arcanos-maiores no HTML."
    );

    alert(
      "Não foi possível encontrar a área da biblioteca no site."
    );

    return;

  }

  galeria.replaceChildren();

  atualizarTituloBiblioteca(
    "Os 56 Arcanos Menores"
  );

  galeria.appendChild(
    criarBotaoNavegacao(
      "← Ver os 22 Arcanos Maiores",

      function() {
        abrirCartas("maiores");
      },

      "botao-navegar-biblioteca"
    )
  );

  renderizarSelecaoDeNaipes(galeria);

  const subtituloNaipe = document.createElement("h3");

  subtituloNaipe.className = "titulo-naipe";
  subtituloNaipe.textContent = "Naipe de " + naipeAtual;

  galeria.appendChild(subtituloNaipe);

  const grade = document.createElement("div");

  grade.className = "galeria-menores";
  grade.style.display = "grid";

  grade.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(210px, 1fr))";

  grade.style.gap = "20px";

  const cartas = obterCartasAtuais();

  cartas.forEach(function(carta, indice) {

    const artigo = document.createElement("article");
    artigo.className = "carta-card";

    const numero = document.createElement("span");

    numero.className = "sobretitulo";

    numero.textContent =
      "ARCANO MENOR " + carta.numero;

    const titulo = document.createElement("h3");

    titulo.textContent = carta.nome;

    const botao = criarBotaoNavegacao(
      "Estudar esta carta →",

      function() {
        abrirAulaCarta(indice);
      }
    );

    artigo.append(
      numero,
      titulo,
      botao
    );

    grade.appendChild(artigo);

  });

  galeria.appendChild(grade);

  const voltar = criarBotaoNavegacao(
    "← Voltar à área do aluno",

    function() {
      mostrarTela("aluno");
    },

    "botao-voltar-biblioteca"
  );

  galeria.appendChild(voltar);

}


// ==========================================
// ABRIR A BIBLIOTECA
// ==========================================

async function abrirCartas(tipo) {

  try {

    const temAcesso = await verificarAcesso();

    if (!temAcesso) {

      alert(
        "A biblioteca será liberada após a confirmação do pagamento."
      );

      mostrarTela("pagamento");
      return;

    }

    const tipoAnterior = tipoBibliotecaAtual;

    tipoBibliotecaAtual =
      tipo === "menores" ? "menores" : "maiores";

    // Só inicia no naipe de Paus quando entra
    // nos Arcanos Menores vindo de outra biblioteca.
    // Ao voltar de uma aula, mantém o naipe selecionado.

    if (
      tipoBibliotecaAtual === "menores" &&
      tipoAnterior !== "menores"
    ) {

      naipeAtual = "Paus";

    }

    if (tipoBibliotecaAtual === "menores") {

      renderizarArcanosMenores();

    } else {

      renderizarArcanosMaiores();

    }

    mostrarTela("arcanos-maiores");

  } catch (error) {

    console.error(
      "Erro ao abrir biblioteca:",
      error
    );

    alert(error.message);
    mostrarTela("login");

  }

}


// ==========================================
// CARREGAR A AULA DE UMA CARTA
// ==========================================

async function abrirAulaCarta(indice) {

  try {

    const temAcesso = await verificarAcesso();

    if (!temAcesso) {

      alert(
        "É necessário ter um pagamento aprovado para acessar as aulas."
      );

      mostrarTela("pagamento");
      return;

    }

    const cartas = obterCartasAtuais();
    const carta = cartas[indice];

    if (!carta) {

      alert(
        "Não foi possível localizar essa carta."
      );

      return;

    }

    indiceCartaAtual = indice;

    let consulta;

    if (tipoBibliotecaAtual === "menores") {

      // A tabela dos Arcanos Menores não possui
      // o campo imagem. Por isso, ele não é consultado.

      consulta = clienteSupabase
        .from("aulas_arcanos_menores")
        .select(
          "numero,naipe,nome,introducao,significado_geral,amor,trabalho,financas,positivo,desafio,interpretacao,conselho,invertida"
        )
        .eq("naipe", carta.naipe)
        .eq("numero", carta.numero);

    } else {

      consulta = clienteSupabase
        .from("aulas_arcanos")
        .select(
          "numero,nome,imagem,introducao,significado_geral,amor,trabalho,financas,positivo,desafio,interpretacao,conselho,invertida"
        )
        .eq("numero", carta.numero);

    }

    const {
      data,
      error
    } = await consulta.maybeSingle();

    if (error) {

      console.error(
        "Erro ao carregar aula:",
        error
      );

      throw new Error(
        "Não foi possível carregar a aula desta carta."
      );

    }

    if (!data) {

      alert(
        "O conteúdo desta aula ainda não foi encontrado."
      );

      return;

    }

    mostrarConteudoAula(data, carta);

    mostrarTela("aula-carta");

  } catch (error) {

    console.error(
      "Erro ao abrir aula:",
      error
    );

    alert(error.message);

  }

}


// ==========================================
// CRIAR PARÁGRAFOS COM SEGURANÇA
// ==========================================

function adicionarParagrafos(container, texto) {

  if (!texto) {
    return;
  }

  const paragrafos = String(texto)
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\s*\n/);

  paragrafos.forEach(function(conteudoParagrafo) {

    const textoLimpo = conteudoParagrafo.trim();

    if (!textoLimpo) {
      return;
    }

    const paragrafo = document.createElement("p");

    paragrafo.textContent = textoLimpo;

    container.appendChild(paragrafo);

  });

}


// ==========================================
// MOSTRAR O CONTEÚDO DA AULA
// ==========================================

function mostrarConteudoAula(dados, carta) {

  const titulo = document.getElementById(
    "aula-carta-titulo"
  );

  const introducao = document.getElementById(
    "aula-carta-introducao"
  );

  const areaImagem = document.getElementById(
    "aula-carta-imagem"
  );

  const conteudo = document.getElementById(
    "aula-carta-conteudo"
  );

  if (
    !titulo ||
    !introducao ||
    !areaImagem ||
    !conteudo
  ) {

    alert(
      "A estrutura da página da aula não foi encontrada no HTML."
    );

    return;

  }

  titulo.textContent = dados.nome || carta.nome;

  introducao.textContent = dados.introducao || "";

  // As aulas são apresentadas sem fotos dos Arcanos.

  areaImagem.replaceChildren();
  areaImagem.hidden = true;

  conteudo.replaceChildren();

  const secoes = [

    [
      "Significado geral",
      dados.significado_geral
    ],

    [
      "Amor",
      dados.amor
    ],

    [
      "Trabalho",
      dados.trabalho
    ],

    [
      "Finanças",
      dados.financas
    ],

    [
      "Aspectos positivos",
      dados.positivo
    ],

    [
      "Aspectos desafiadores",
      dados.desafio
    ],

    [
      "Interpretação nas leituras",
      dados.interpretacao
    ],

    [
      "Conselho da carta",
      dados.conselho
    ],

    [
      "Significado invertido",
      dados.invertida
    ]

  ];

  secoes.forEach(function(secao) {

    if (!secao[1]) {
      return;
    }

    const bloco = document.createElement("section");

    bloco.className = "aula-secao";

    const subtitulo = document.createElement("h3");

    subtitulo.textContent = secao[0];

    bloco.appendChild(subtitulo);

    adicionarParagrafos(
      bloco,
      secao[1]
    );

    conteudo.appendChild(bloco);

  });


  // Controla os botões de navegação entre cartas.

  const cartas = obterCartasAtuais();

  const botaoAnterior = document.getElementById(
    "carta-anterior"
  );

  const botaoProxima = document.getElementById(
    "proxima-carta"
  );

  if (botaoAnterior) {

    botaoAnterior.disabled =
      indiceCartaAtual === 0;

  }

  if (botaoProxima) {

    botaoProxima.disabled =
      indiceCartaAtual === cartas.length - 1;

  }


  // Ajusta somente os botões de voltar que pertencem
  // à página da aula, sem interferir nas outras telas.

  const botoesVoltarAula = document.querySelectorAll(
    "#tela-aula-carta .botao-voltar"
  );

  botoesVoltarAula.forEach(function(botao) {

    botao.onclick = function() {
      abrirCartas(tipoBibliotecaAtual);
    };

  });

}


// ==========================================
// NAVEGAÇÃO ENTRE AS CARTAS
// ==========================================

function navegarCarta(direcao) {

  const cartas = obterCartasAtuais();

  const novoIndice =
    indiceCartaAtual + direcao;

  if (
    novoIndice < 0 ||
    novoIndice >= cartas.length
  ) {

    return;

  }

  abrirAulaCarta(novoIndice);

}


// ==========================================
// BIBLIOTECA DA ÁREA DO ALUNO
// ==========================================

async function abrirBiblioteca() {

  try {

    const temAcesso = await verificarAcesso();

    if (!temAcesso) {

      alert(
        "A biblioteca será liberada após a confirmação do pagamento."
      );

      mostrarTela("pagamento");
      return;

    }

    await abrirCartas("maiores");

  } catch (error) {

    alert(error.message);
    mostrarTela("login");

  }

}


// ==========================================
// SAIR DA CONTA
// ==========================================

async function sairDaConta() {

  const {
    error
  } = await clienteSupabase.auth.signOut();

  if (error) {

    alert(
      "Não foi possível sair da conta: " +
      error.message
    );

    return;

  }

  mostrarTela("inicio");

  alert(
    "Você saiu da sua conta."
  );

}
