const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvar(){
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function renderizar(filtro = "todas"){

    taskList.innerHTML = "";

    let tarefasFiltradas = tarefas;

    if(filtro === "ativas"){
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    }

    if(filtro === "concluidas"){
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    }

    tarefasFiltradas.forEach((tarefa, index) => {

        const li = document.createElement("li");

        li.classList.add("task");

        if(tarefa.concluida){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${tarefa.texto}</span>

            <div class="task-buttons">

                <button class="complete-btn" onclick="concluir(${index})">
                    ✓
                </button>

                <button class="delete-btn" onclick="remover(${index})">
                    X
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

}

function adicionar(){

    const texto = taskInput.value.trim();

    if(texto === "") return;

    tarefas.push({
        texto,
        concluida:false
    });

    salvar();

    renderizar();

    taskInput.value = "";
}

function concluir(index){

    tarefas[index].concluida = !tarefas[index].concluida;

    salvar();

    renderizar();
}

function remover(index){

    tarefas.splice(index,1);

    salvar();

    renderizar();
}

function filtrar(tipo){
    renderizar(tipo);
}

addBtn.addEventListener("click", adicionar);

taskInput.addEventListener("keypress", e => {
    if(e.key === "Enter"){
        adicionar();
    }
});

renderizar();

if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js");
}