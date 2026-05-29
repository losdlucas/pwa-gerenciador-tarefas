const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const prioritySelect = document.getElementById("prioritySelect");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";

function salvar(){
    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );
}

function atualizarStats(){

    document.getElementById(
        "totalTasks"
    ).innerText = tarefas.length;

    document.getElementById(
        "completedTasks"
    ).innerText =
    tarefas.filter(t => t.concluida).length;
}

function atualizarBarra(){

    const concluidas =
    tarefas.filter(t => t.concluida).length;

    const porcentagem =
    tarefas.length === 0
    ? 0
    : (concluidas / tarefas.length) * 100;

    document.getElementById(
        "progressBar"
    ).style.width = porcentagem + "%";
}

function renderizar(){

    taskList.innerHTML = "";

    let tarefasFiltradas = tarefas;

    if(filtroAtual === "ativas"){
        tarefasFiltradas =
        tarefas.filter(t => !t.concluida);
    }

    if(filtroAtual === "concluidas"){
        tarefasFiltradas =
        tarefas.filter(t => t.concluida);
    }

    tarefasFiltradas.forEach((tarefa) => {

        const li = document.createElement("li");

        li.classList.add(
            "task",
            tarefa.prioridade
        );

        if(tarefa.concluida){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="task-info">

                <span class="task-text">
                    ${tarefa.texto}
                </span>

                <small class="task-date">
                    ${tarefa.data}
                </small>

            </div>

            <div class="task-buttons">

                <button
                class="complete-btn"
                onclick="concluir(${tarefa.id})">

                    <i class="fa-solid fa-check"></i>

                </button>

                <button
                class="delete-btn"
                onclick="remover(${tarefa.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

    atualizarStats();

    atualizarBarra();
}

function adicionar(){

    const texto = taskInput.value.trim();

    if(texto === "") return;

    tarefas.push({

        id:Date.now(),

        texto:texto,

        prioridade:
        prioritySelect.value,

        concluida:false,

        data:new Date()
        .toLocaleString("pt-BR")

    });

    salvar();

    renderizar();

    taskInput.value = "";
}

function concluir(id){

    const tarefa =
    tarefas.find(t => t.id === id);

    tarefa.concluida =
    !tarefa.concluida;

    salvar();

    renderizar();
}

function remover(id){

    tarefas =
    tarefas.filter(t => t.id !== id);

    salvar();

    renderizar();
}

function filtrar(tipo){

    filtroAtual = tipo;

    renderizar();
}

addBtn.addEventListener(
    "click",
    adicionar
);

taskInput.addEventListener(
    "keypress",
    e => {

    if(e.key === "Enter"){
        adicionar();
    }

});

renderizar();

if("serviceWorker" in navigator){

    navigator.serviceWorker
    .register("service-worker.js");

}