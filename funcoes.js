// Tenta pegar o que já está salvo. Caso não exista, através do operador "||" ele cria um novo.
// "JSON.parse" serve para transformar o texto do navegador em código JavaScript
let meusDados = JSON.parse(localStorage.getItem("listaSalva")) || [];

document.getElementById("inputTopico").addEventListener("keypress", function (event) {
    if (event.key === "Enter")
        adicionarEstudo()
})

carregarLista();

function adicionarEstudo() {
    let input = document.getElementById("inputTopico");
    let texto = input.value;

    if (texto === "") {
        alert("Por favor, escreve algo para estudar!");
        return;
    }

    // CRIAÇÂO DO OBJETO DE DADOS
    // Esse bloco agrupa o texto e a hora em um "pacote" (objeto)
    let novoObjeto = {
        nome: texto,
        horario: new Date().toLocaleTimeString(),
        concluido: false
    };

    // Essa linha adiciona o pacote à lista na memória do computador
    meusDados.push(novoObjeto)

    // SALVAR NO NAVEGADOR
    // O "localStorage" só aceita texto. O JSON.stringfy transforma o objeto em texto.
    localStorage.setItem("listaSalva", JSON.stringify(meusDados));

    // Em vez de criar o HTML manualmente, reutilizei a função que já existe para isso
    // Single Source of Truth (Fonte Única da Verdade)
    carregarLista()

    input.value = "";
}

// A função agora recebe um parâmetro chamado de "tarefaConcluida".
function concluirEstudo(posicao) {
    // Inverte o valor: Se era true vira false, se era false vira true
    meusDados[posicao].concluido = !meusDados[posicao].concluido;

    // Atualiza o banco de dados do navegador
    localStorage.setItem("listaSalva", JSON.stringify(meusDados))

    // Manda redesenhar a tela com a lista atualizada
    carregarLista()
}

// A função agora recebe um parâmetro chamado de "tarefaConcluida".
function deletarEstudo(posicao) {
    // Remove 1 item a partir da posição indicada
    meusDados.splice(posicao, 1)

    // Atualiza o banco de dados do navegador
    localStorage.setItem("listaSalva", JSON.stringify(meusDados))

    // Manda redesenhar a tela com a lista atualizada
    carregarLista()
}

// Função para recarregar o que estava salvo
function carregarLista() {
    let lista = document.getElementById("listaEstudos");
    lista.innerHTML = "";

    meusDados.forEach(function (item, index) {
        let novoItem = document.createElement("li");

        // Define se está riscado ou não
        let classeCss = item.concluido ? "riscado" : "";
        novoItem.className = classeCss;

        // VERSÃO "SEMESPAÇOS" PARA REMOVER O HÍFEN
        // Coloquei uma div com display:flex para garantir que ficam alinhados sem caracteres estranhos
        novoItem.innerHTML = `
                    <span>${item.nome}<small>(${item.horario})</small></span>
                    
                    <div style="display: flex; align-items: center;">
                        <button class="btn-acao btn-check" onclick="concluirEstudo(${index})">${item.concluido ? '↩' : '✔'}</button><button class="btn-acao btn-delete" onclick="deletarEstudo(${index})">✖</button>
                    </div>
                `;

        lista.appendChild(novoItem);
    });
}