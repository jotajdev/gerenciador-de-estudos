// Tenta pegar o que já está salvo. Caso não exista, através do operador "||" ele cria um novo.
// "JSON.parse" serve para transformar o texto do navegador em código JavaScript
let meusDados = JSON.parse(localStorage.getItem("listaSalva")) || [];

// Inicializa a aplicação
carregarLista();

// Escuta a tecla Enter
document.getElementById("inputTopico").addEventListener("keypress", function (event) {
    if (event.key === "Enter")
        adicionarEstudo()
})

const salvarERenderizar = () => {
    // SALVAR NO NAVEGADOR
    // O "localStorage" só aceita texto. O JSON.stringfy transforma o objeto em texto.
    localStorage.setItem("listaSalva", JSON.stringify(meusDados));
    carregarLista();
}

const adicionarEstudo = () => {
    let input = document.getElementById("inputTopico");
    let texto = input.value;
    const escreveAlgo = () => alert("Por favor, escreve algo para estudar!")

    // A função trim() tira todos os espaços em branco e, nessse caso, está comparando com uma string fazia. Se ela comparação for igual, significa que, ou o usuário não digitou nada ou digitou espaços em branco.
    if (texto.trim() === "") {
        return escreveAlgo()
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
    meusDados.push(novoObjeto)
    salvarERenderizar();
    input.value = ""; // Limpa o campo
    input.focus(); // Devolve o foco para digitar outro estudo
}

// A função recebe um parâmetro chamado de "posicao".
const concluirEstudo = idProcurado => {
    // O item que tem o ID igual ao que foi clicado é procurado
    meusDados = meusDados.map(item => {
        if(item.id === idProcurado){
            return {...item, concluido: !item.concluido};
        }
        return item;
    });

    salvarERenderizar();
}

// A função recebe um parâmetro chamado de "posicao".
const deletarEstudo = idProcurado => {
    // A lista manteve todos, EXCETO o que tem o ID clicado
    meusDados = meusDados.filter(item => item.id !== idProcurado);
    salvarERenderizar()
}

// Função para recarregar o que estava salvo
function carregarLista() {
    let lista = document.getElementById("listaEstudos");

    // O .map vai criar um novo array apenas com os texto HTML

    let itensHTML = meusDados.map((item, index) => {

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