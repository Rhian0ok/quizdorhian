
const perguntas = [
    // Primeira fase
    {
        pergunta: "Qual linguagem é usada para estruturar páginas web?",
        alternativas: ["CSS", "HTML", "Python", "JavaScript"],
        correta: 1
    },
    {
        pergunta: "Qual foi o primeiro milagre que Jesus operou??",
        alternativas: ["A cura do paralítico", "A cura do cego", "Água em vinho", "Andar sobre as águas"],
        correta: 2
    },
    {
        pergunta: "Quantos continentes existem no mundo?",
        alternativas: ["5", "6", "7", "8"],
        correta: 1
    },
    {
        pergunta: "Qual o nome do processo de mudança de estado físico do gasoso para o líquido?",
        alternativas: ["Fusão", "Condensação", "Ebulição", "Vaporização"],
        correta: 1
    },
    {
        pergunta: "Qual é o maior oceano do planeta?",
        alternativas: [
            "Oceano Atlântico",
            "Oceano Índico",
            "Oceano Ártico",
            "Oceano Pacífico"
        ],
        correta: 3
    },

    // Segunda fase
    {
        pergunta: "Qual destes números é primo?",
        alternativas: ["21", "27", "29", "33"],
        correta: 2
    },
    {
        pergunta: "Qual órgão do corpo humano produz a insulina?",
        alternativas: ["Fígado", "Pâncreas", "Rim", "Baço"],
        correta: 1
    },
    {
        pergunta: "Como se chama o processo em que uma célula se divide em duas células geneticamente semelhantes?",
        alternativas: ["Meiose", "Mitose", "Osmose", "Fotossíntese"],
        correta: 1
    },
    {
        pergunta: "Qual tratado encerrou oficialmente a Primeira Guerra Mundial entre a Alemanha e os Aliados?",
        alternativas: [
            "Tratado de Tordesilhas",
            "Tratado de Versalhes",
            "Tratado de Paris de 1783",
            "Tratado de Utrecht"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é o menor país do mundo em área territorial?",
        alternativas: ["Mônaco", "Vaticano", "Malta", "Luxemburgo"],
        correta: 1
    }
];

// Prêmio de cada pergunta
const premio = [
    1000, 2000, 3000, 4000, 5000,
    10000, 20000, 30000, 40000, 50000
];

let perguntaAtual = 0;
let premioAtual = 0;
let respondeu = false;
let jogoFinalizado = false;
let ajudaUsada = false;
let ajudaNestaPergunta = false;
let segundaFase = false;
let premioGarantido = 0;

// Elementos do quiz
const perguntaE = document.getElementById("pergunta");
const alternativasE = document.getElementById("alternativas");
const mensagemE = document.getElementById("mensagem");
const numeroPerguntaE = document.getElementById("numero-pergunta");
const premioE = document.getElementById("premio");
const proximaBtnE = document.getElementById("proxima");
const barraProgressoE = document.getElementById("barra-progresso");
const ajudaE = document.getElementById("ajuda");

// Telas de decisão
const telaDecisaoE = document.getElementById("tela-decisao");
const premioFinalE = document.getElementById("premio-final");
const pararJogoE = document.getElementById("parar-jogo");
const continuarJogoE = document.getElementById("continuar-jogo");

const confirmacaoRiscoE = document.getElementById("confirmacao-risco");
const confirmarContinuacaoE =
    document.getElementById("confirmar-continuacao");
const cancelarContinuacaoE =
    document.getElementById("cancelar-continuacao");

// Formata o prêmio em reais
function formatarPremio(valor) {
    return valor.toLocaleString("pt-BR");
}

// Carrega a pergunta atual
function carregarPergunta() {
    respondeu = false;
    ajudaNestaPergunta = false;

    proximaBtnE.disabled = true;
    ajudaE.disabled = ajudaUsada;

    mensagemE.textContent = "";
    alternativasE.innerHTML = "";

    const item = perguntas[perguntaAtual];

    perguntaE.textContent = item.pergunta;

    numeroPerguntaE.textContent =
        `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;

    premioE.textContent =
        `Prêmio: R$ ${formatarPremio(premioAtual)}`;

    // Atualiza a barra de progresso
    const progresso =
        ((perguntaAtual + 1) / perguntas.length) * 100;

    barraProgressoE.style.width = `${progresso}%`;

    // Cria os botões das alternativas
    item.alternativas.forEach((texto, indice) => {
        const botao = document.createElement("button");

        botao.classList.add("alternativa");
        botao.textContent =
            `${String.fromCharCode(65 + indice)}) ${texto}`;

        botao.addEventListener("click", () => {
            verificaResposta(indice, botao);
        });

        alternativasE.appendChild(botao);
    });
}

// Verifica a resposta escolhida
function verificaResposta(indiceEscolhido, botaoEscolhido) {
    if (respondeu) return;

    respondeu = true;

    const item = perguntas[perguntaAtual];
    const botoes =
        alternativasE.querySelectorAll(".alternativa");

    botoes.forEach(botao => {
        botao.disabled = true;
    });

    ajudaE.disabled = true;

    if (indiceEscolhido === item.correta) {
        botaoEscolhido.classList.add("correta");

        let pontos = premio[perguntaAtual];

        // A ajuda faz o jogador receber metade dos pontos
        if (ajudaNestaPergunta) {
            pontos = pontos / 2;
            mensagemE.textContent =
                `Resposta correta! Você ganhou R$ ${formatarPremio(pontos)} nesta pergunta!`;
        } else {
            mensagemE.textContent =
                "Resposta correta! Você avançou!";
        }

        // Soma os pontos ao prêmio acumulado
        premioAtual += pontos;

    } else {
        botaoEscolhido.classList.add("errada");
        botoes[item.correta].classList.add("correta");

        mensagemE.textContent = "Resposta incorreta!";

        // Na segunda fase, perder a pergunta zera o prêmio
        if (segundaFase) {
            premioAtual = 0;

            finalizarJogo(
                "Você errou na segunda fase e perdeu o prêmio acumulado."
            );

            return;
        }
    }

    premioE.textContent =
        `Prêmio: R$ ${formatarPremio(premioAtual)}`;

    proximaBtnE.disabled = false;
}

// Ajuda 50/50: esconde duas alternativas incorretas
ajudaE.addEventListener("click", () => {
    if (respondeu || ajudaUsada) return;

    const item = perguntas[perguntaAtual];

    const botoes =
        Array.from(alternativasE.querySelectorAll(".alternativa"));

    const incorretas = botoes.filter((botao, indice) => {
        return indice !== item.correta;
    });

    // Embaralha as alternativas incorretas
    incorretas.sort(() => Math.random() - 0.5);

    // Esconde duas alternativas
    incorretas.slice(0, 2).forEach(botao => {
        botao.style.display = "none";
    });

    ajudaUsada = true;
    ajudaNestaPergunta = true;
    ajudaE.disabled = true;

    mensagemE.textContent = "Ajuda 50/50 utilizada!";
});

// Avança para a próxima pergunta ou tela
proximaBtnE.addEventListener("click", () => {
    if (jogoFinalizado) {
        reiniciarJogo();
        return;
    }

    perguntaAtual++;

    // Ao terminar as cinco primeiras perguntas
    if (perguntaAtual === 5 && !segundaFase) {
        mostrarDecisao();
        return;
    }

    // Ao terminar todas as perguntas
    if (perguntaAtual >= perguntas.length) {
        finalizarJogo();
        return;
    }

    carregarPergunta();
});

// Mostra a decisão de parar ou continuar
function mostrarDecisao() {
    perguntaE.style.display = "none";
    alternativasE.style.display = "none";
    ajudaE.style.display = "none";
    mensagemE.style.display = "none";
    proximaBtnE.style.display = "none";

    telaDecisaoE.style.display = "block";

    premioFinalE.textContent =
        `Você acumulou R$ ${formatarPremio(premioAtual)}!`;
}

// Garante o prêmio e encerra a partida
pararJogoE.addEventListener("click", () => {
    premioGarantido = premioAtual;
    premioAtual = premioGarantido;

    finalizarJogo();
});

// Mostra a confirmação de risco
continuarJogoE.addEventListener("click", () => {
    telaDecisaoE.style.display = "none";
    confirmacaoRiscoE.style.display = "block";
});

// Confirma a entrada na segunda fase
confirmarContinuacaoE.addEventListener("click", () => {
    confirmacaoRiscoE.style.display = "none";

    segundaFase = true;

    perguntaE.style.display = "block";
    alternativasE.style.display = "flex";
    ajudaE.style.display = "inline-block";
    mensagemE.style.display = "block";
    proximaBtnE.style.display = "block";

    carregarPergunta();
});

// Decide parar depois de ver a confirmação
cancelarContinuacaoE.addEventListener("click", () => {
    premioGarantido = premioAtual;
    premioAtual = premioGarantido;

    finalizarJogo();
});

// Finaliza o jogo
function finalizarJogo(mensagemFinal = "") {
    jogoFinalizado = true;

    telaDecisaoE.style.display = "none";
    confirmacaoRiscoE.style.display = "none";

    perguntaE.style.display = "block";
    perguntaE.textContent = "🏆 Fim de jogo!";

    alternativasE.innerHTML = "";
    alternativasE.style.display = "none";

    numeroPerguntaE.textContent = "Quiz concluído";

    mensagemE.style.display = "block";

    if (mensagemFinal) {
        mensagemE.textContent =
            `${mensagemFinal} Prêmio final: R$ ${formatarPremio(premioAtual)}.`;
    } else {
        mensagemE.textContent =
            `Você terminou com R$ ${formatarPremio(premioAtual)}!`;
    }

    ajudaE.style.display = "none";

    proximaBtnE.style.display = "block";
    proximaBtnE.textContent = "Jogar novamente";
    proximaBtnE.disabled = false;

    premioE.textContent =
        `Prêmio: R$ ${formatarPremio(premioAtual)}`;
}

// Reinicia o jogo
function reiniciarJogo() {
    perguntaAtual = 0;
    premioAtual = 0;
    premioGarantido = 0;

    respondeu = false;
    jogoFinalizado = false;
    ajudaUsada = false;
    ajudaNestaPergunta = false;
    segundaFase = false;

    telaDecisaoE.style.display = "none";
    confirmacaoRiscoE.style.display = "none";

    perguntaE.style.display = "block";
    alternativasE.style.display = "flex";
    ajudaE.style.display = "inline-block";
    mensagemE.style.display = "block";
    proximaBtnE.style.display = "block";

    proximaBtnE.textContent = "Próxima Pergunta";
    ajudaE.disabled = false;

    carregarPergunta();
}

// Inicia o quiz
carregarPergunta();
