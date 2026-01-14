// Tenta pegar o que já está salvo. Caso não exista, através do operador "||" ele cria um novo.


// Model
const estudosRepository = {
    dados: [],

    // Carrega os dados do "banco" (LocalStorage) para a memória
    inicializar: function() {
        const dadosSalvos = localStorage.getItem("meusEstudos");
        if(dadosSalvos){
            this.dados = JSON.parse(dadosSalvos) // "JSON.parse" serve para transformar o texto do navegador em código JavaScript
        }else{
            this.dados = []
        }
    },

    // Adiciona no array e salva
    adicionar: function(novoEstudo) {
        this.dados.push(novoEstudo)
        this.salvar();
    },

    // Remove do array e salva
    // A lista mantem todos, EXCETO o que tem o ID clicado
    remover: function(id) {
        this.dados = this.dados.filter(item => item.id !== id);
        this.salvar();
    },

    // Marca e desmarca como concluído
    // O item que tem o ID igual ao que foi clicado é alterado
    alternarStatus: function(id) {
        this.dados = this.dados.map(item =>{
            if(item.id == id){
                return {...item, concluido: !item.concluido};
            };
            return item;
        });
        this.salvar();
    },

    // Salva a memória no Local
    salvar: function() {
        localStorage.setItem("meusEstudos", JSON.stringify(this.dados))
    }
}

// Inicializa a aplicação
const iniciarSistema = () => {
    estudosRepository.inicializar();
    carregarLista();
    carregarDadosGithub();
}

// Escuta a tecla Enter
document.getElementById("inputTopico").addEventListener("keypress", function (event) {
    if (event.key === "Enter")
        adicionarEstudo()
})

const adicionarEstudo = () => {
    let input = document.getElementById("inputTopico");
    let texto = input.value;

    // A função trim() tira todos os espaços em branco e, nessse caso, está comparando com uma string fazia. Se ela comparação for igual, significa que, ou o usuário não digitou nada ou digitou espaços em branco.
    if (texto.trim() === "") {
        alert("Por favor, escreve algo para estudar!");
        return;
    }

    // CRIAÇÂO DO OBJETO DE DADOS
    // Esse bloco agrupa o texto e a hora em um "pacote" (objeto)
    let novoObjeto = {
        id: Date.now(),
        nome: texto,
        data: new Date().toLocaleDateString(),
        horario: new Date().toLocaleTimeString(),
        concluido: false
    };

    // Essa linha adiciona o pacote à lista na memória do computador
    estudosRepository.adicionar(novoObjeto)
    carregarLista();
    input.value = ""; // Limpa o campo
    input.focus(); // Devolve o foco para digitar outro estudo
}

// A função recebe um parâmetro chamado de "posicao".
const concluirEstudo = id => {
    estudosRepository.alternarStatus(id);
    carregarLista();
}

// A função recebe um parâmetro chamado de "posicao".
const deletarEstudo = id => {
    estudosRepository.remover(id);
    carregarLista();
}

// Função para recarregar o que estava salvo
function carregarLista() {
    let lista = document.getElementById("listaEstudos");

    // O .map vai criar um novo array apenas com os texto HTML

    let itensHTML = estudosRepository.dados.map((item) => {

        // Define se está riscado ou não
        let classeCss = item.concluido ? "riscado" : "";

        // Coloquei uma div com display:flex para garantir que ficam alinhados sem caracteres estranhos
        return `
            <li class = "${classeCss}">
                <span>${item.nome}<small>Criada em: ${item.data} às ${item.horario}</small></span>                    
                    <div style="display: flex; align-items: center;">
                        <button class="btn-acao btn-check" onclick="concluirEstudo(${item.id})">${item.concluido ? '↩' : '✔'}
                        </button><button class="btn-acao btn-delete" onclick="deletarEstudo(${item.id})">✖</button>
                    </div>
            </li>
        `;
    });
    // O .join('') pega o array de textos e cola tudo numa string só, vírgulas
    lista.innerHTML = itensHTML.join("");
}

async function carregarDadosGithub() {

    const usuario = "jotajdev";

    const imagem = document.getElementById("avatar");
    const nome = document.getElementById("nomeUsuario");
    const loader = document.getElementById("loading");

    // 1.Liga o loading
    loader.style.display = "block";
    nome.innerText = "";

    try {
        // Através desse linha, o programa sai do navegador e vai até o servidor buscar esses dados. 
        // O fetch não devolve um dado imediatamente, mas sim uma promessa.
        const resposta = await fetch(`https://api.github.com/users/${usuario}`);

        // Espere o "carteiro" abrir o envolope e transformar em JSON
        const dados = await resposta.json();

        // Variáveis para fazer referência no HTML
        let imagem = document.getElementById("avatar");
        let nome = document.getElementById("nomeUsuario");

        // Colocando os dados que vieram da API e fazendo uma pequena verificação
        if (dados.name) {
            nome.innerText = dados.name; // Pega o nome real (não o login)
            imagem.src = dados.avatar_url; // Pega o link da foto
            imagem.style.display = "inline-block"; // Faz a imagem aparecer
        } else {
            nome.innerText = "Usuário não encontrado!"
        }
    } catch (erro) {
        console.error("Erro ao buscar GitHub", erro);
        nome.innerText = "Erro ao carregar o perfil!";
    } finally {
        // Desliga o loading
        loader.style.display = "none"
    }
}

iniciarSistema();