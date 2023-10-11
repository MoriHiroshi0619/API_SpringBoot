// Função para carregar as tarefas da API e exibi-las no HTML
function carregarTarefas() {
    fetch('http://localhost:8080/tarefas') // Substitua a URL pelo endpoint correto da sua API
        .then(response => response.json())
        .then(tarefas => {
            const listaTarefas = document.getElementById('lista-tarefas'); // ID do elemento HTML onde as tarefas serão exibidas
            listaTarefas.innerHTML = ''; // Limpar a lista antes de adicionar as tarefas

            tarefas.forEach(tarefa => {
                // Criar elementos HTML para cada tarefa
                const divTarefa = document.createElement('div');
                divTarefa.classList.add('task');
                divTarefa.id = `t${tarefa.id}`;

                const divCheckbox = document.createElement('div');
                divCheckbox.classList.add('checkbox-container');

                const label = document.createElement('label');

                const inputCheckbox = document.createElement('input');
                inputCheckbox.type = 'checkbox';
                inputCheckbox.classList.add('checkbox');
                inputCheckbox.checked = tarefa.checado; // Define o estado marcado ou não

                // Adiciona o evento de clique para capturar o evento de clique no checkbox
                inputCheckbox.addEventListener('click', () => {
                    atualizarTarefa(tarefa, inputCheckbox.checked);
                });

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Excluir';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    deletarTarefa(tarefa.id, tarefa.titulo)
                });

                const deleteButtonContainer = document.createElement('div');
                deleteButtonContainer.classList.add('delete-button-container');
                deleteButtonContainer.appendChild(deleteButton);

                const checkboxContainer = document.createElement('div');
                checkboxContainer.classList.add('checkbox-container');
                checkboxContainer.appendChild(inputCheckbox);

                const spanCheckmark = document.createElement('span');
                spanCheckmark.classList.add('checkmark');

                const divTaskContent = document.createElement('div');
                divTaskContent.classList.add('task-content');

                const h2Title = document.createElement('h2');
                h2Title.classList.add('title');
                h2Title.textContent = tarefa.titulo;

                const pContent = document.createElement('p');
                pContent.classList.add('content');
                pContent.textContent = tarefa.conteudo;

                // Adiciona o evento de duplo clique para exibir o modal de edição
                divTaskContent.addEventListener('dblclick', () => {
                    exibirModalEdicao(tarefa);
                });
                // Verificar se a tarefa está marcada como concluída e adicionar estilo
                if (tarefa.checado) {
                    divTarefa.style.textDecoration = 'line-through';
                    inputCheckbox.checked = true;
                }

                // Adicionar elementos na estrutura HTML
                label.appendChild(inputCheckbox);
                label.appendChild(spanCheckmark);
                divCheckbox.appendChild(label);

                divTaskContent.appendChild(h2Title);
                divTaskContent.appendChild(pContent);

                divTarefa.appendChild(deleteButtonContainer);
                divTarefa.appendChild(divCheckbox);
                divTarefa.appendChild(divTaskContent);

                listaTarefas.appendChild(divTarefa);
            });
        })
        .catch(error => console.log('Erro ao carregar as tarefas:', error));
}

// Chamar a função para carregar as tarefas ao carregar a página
document.addEventListener('DOMContentLoaded', carregarTarefas);

// Função para atualizar uma tarefa na API
function atualizarTarefa(tarefa, checado) {
    const body = JSON.stringify({
        'id': tarefa.id,
        'titulo': tarefa.titulo,
        'conteudo': tarefa.conteudo,
        'checado': checado

    }); // Prepara o corpo da requisição com os dados a serem atualizados

    fetch(`http://localhost:8080/tarefas`, { // Substitua a URL pelo endpoint correto da sua API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => {
            if (response.ok) {
                console.log(`Tarefa ${tarefa.id} atualizada com sucesso!`);
                carregarTarefas()
            } else {
                throw new Error('Erro ao atualizar a tarefa.');
            }
        })
        .catch(error => console.log('Erro ao atualizar a tarefa:', error));
}

// Função para deletar uma tarefa na API
function deletarTarefa(id, titulo) {

    if (confirm(`Você tem certeza que deseja deletar "${titulo}"?`)) {

        fetch(`http://localhost:8080/tarefas/${id}`, { // Substitua a URL pelo endpoint correto da sua API
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log(`Tarefa ${id} deletada com sucesso!`);
                    carregarTarefas()
                } else {
                    throw new Error('Erro ao deletar a tarefa.');
                }
            })
            .catch(error => console.log('Erro ao deletar a tarefa:', error));
    }

}

// Função para exibir o modal
function exibirModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
      <div class="modal" id="modal-adicionar-tarefa">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Adicionar Tarefa</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="input-title">Título:</label>
                <input type="text" class="form-control" id="input-title" placeholder="Digite o título da tarefa">
              </div>
              <div class="form-group">
                <label for="textarea-content">Conteúdo:</label>
                <textarea class="form-control" id="textarea-content" rows="5" placeholder="Digite o conteúdo da tarefa"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" onclick="adicionarTarefa()">Adicionar</button>
              <button type="button" data-dismiss="modal">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Exibir o modal
    $('#modal-adicionar-tarefa').modal('show');
}

// Função para adicionar a tarefa após o usuário clicar em "Adicionar" no modal
function adicionarTarefa() {
    const titulo = document.getElementById('input-title').value;
    const conteudo = document.getElementById('textarea-content').value;

    const body = JSON.stringify({
        'id': null,
        'titulo': titulo,
        'conteudo': conteudo,
        'checado': false

    }); // Prepara o corpo da requisição com os dados a serem adicionados

    fetch(`http://localhost:8080/tarefas`, { // Substitua a URL pelo endpoint correto da sua API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => {
            if (response.ok) {
                console.log(`Tarefa adicionada com sucesso!`);
                carregarTarefas()
            } else {
               // Verifica se o status da resposta é um erro (status 400 Bad Request).
            if (response.status === 400) {
                // Lê o corpo da resposta que contém a mensagem de erro.
                response.text()
                    .then(errorMessage => {
                        console.log('Erro ao adicionar a tarefa:', errorMessage);
                    })
                    .catch(error => {
                        console.error('Erro ao analisar a mensagem de erro:', error);
                    });
            } else {
                // Trata outros erros de forma adequada.
                console.log('Erro ao adicionar a tarefa:', response.status);
            }
        }
    })
        .catch(error => console.log('Erro ao adicionar a tarefa:', error));


    // Fechar o modal após adicionar a tarefa
    $('#modal-adicionar-tarefa').modal('hide');

    // Limpar os campos do modal para uma próxima adição
    document.getElementById('input-title').value = '';
    document.getElementById('textarea-content').value = '';
}

// Função para exibir o modal de edição com os campos preenchidos
function exibirModalEdicao(tarefa) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
      // Código HTML do modal de edição
    `;
  
    // Exibir o modal
    $('#modal-edicao-tarefa').modal('show');
  }
  
 // Função para exibir o modal de edição com os campos preenchidos
function exibirModalEdicao(tarefa) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
      <div class="modal" id="modal-edicao-tarefa">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Tarefa</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="input-title">Título:</label>
                <input type="text" class="form-control" id="input-title" placeholder="Digite o título da tarefa" value="${tarefa.titulo}">
              </div>
              <div class="form-group">
                <label for="textarea-content">Conteúdo:</label>
                <textarea class="form-control" id="textarea-content" rows="5" placeholder="Digite o conteúdo da tarefa">${tarefa.conteudo}</textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button"  onclick="salvarEdicaoTarefa(${tarefa.id}, ${tarefa.checado})">Salvar</button>
              <button type="button"  data-dismiss="modal">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // Exibir o modal
    $('#modal-edicao-tarefa').modal('show');
  }
  
  // Função para adicionar a tarefa após o usuário clicar em "Adicionar" no modal
function salvarEdicaoTarefa(id, checado) {
    const titulo = document.getElementById('input-title').value;
    const conteudo = document.getElementById('textarea-content').value;

    const body = JSON.stringify({
        'id': id,
        'titulo': titulo,
        'conteudo': conteudo,
        'checado': checado

    }); // Prepara o corpo da requisição com os dados a serem adicionados

    fetch(`http://localhost:8080/tarefas`, { // Substitua a URL pelo endpoint correto da sua API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => {
            if (response.ok) {
                console.log(`Tarefa editada com sucesso!`);
                carregarTarefas()
            } else {
                throw new Error(response.status);
            }
        })
        .catch(error => console.log('Erro ao editar a tarefa:', error));


    // Fechar o modal após adicionar a tarefa
    $('#modal-edicao-tarefa').modal('hide');

    // Limpar os campos do modal para uma próxima adição
    document.getElementById('input-title').value = '';
    document.getElementById('textarea-content').value = '';
}