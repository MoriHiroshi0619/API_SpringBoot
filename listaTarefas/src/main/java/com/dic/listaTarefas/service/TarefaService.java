package com.dic.listaTarefas.service;

import com.dic.listaTarefas.model.Tarefa;
import com.dic.listaTarefas.repository.TarefaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TarefaService {
    final TarefaRepository repo;

    public TarefaService(TarefaRepository repo) {
        this.repo = repo;
    }

    public List<Tarefa> getAll(){
        return repo.findAll();
    }

    public Tarefa getById(Integer id){
        return repo.findById(id).orElse(null);
    }
    public Tarefa safe(Tarefa tarefa){
        return repo.save(tarefa);
    }

    public void deleteById(Integer id){
         repo.deleteById(id);
    }

    public Tarefa updateById(Integer id, Tarefa tarefaAtualizado){
        Tarefa tarefa = repo.findById(id).orElse(null);
        try{
            tarefa.setTitulo(tarefaAtualizado.getTitulo());
            tarefa.setConteudo(tarefaAtualizado.getConteudo());
            tarefa.setChecado(tarefaAtualizado.getChecado());
            return repo.save(tarefa);
        }catch(Exception e){
            return null;
        }
    }

}
