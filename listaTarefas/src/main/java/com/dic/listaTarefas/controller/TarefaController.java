package com.dic.listaTarefas.controller;

import com.dic.listaTarefas.service.TarefaService;
import com.dic.listaTarefas.model.Tarefa;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import javax.validation.Valid;
import java.util.List;

@CrossOrigin()
@RestController
@RequestMapping("/")
public class TarefaController {
    final TarefaService service;
    public TarefaController(TarefaService service) {
        this.service = service;
    }

    @GetMapping("/tarefas")
    public List<Tarefa> getTarefas(){
        return service.getAll();
    }

    @GetMapping("/tarefas/{id}")
    public ResponseEntity<?> getTarefaById(@PathVariable Integer id){
        Tarefa tarefa = service.getById(id);
        if(tarefa == null){
            return ResponseEntity.notFound().build();
        }else{
            return ResponseEntity.ok(tarefa);
        }
    }

    @PostMapping("/tarefas")
    public ResponseEntity<?> saveTarefa(@RequestBody @Valid Tarefa tarefa){
        try{
            return ResponseEntity.ok(service.safe(tarefa));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/tarefas/{id}")
    public ResponseEntity<?> updateTaredaById(@PathVariable Integer id, @RequestBody Tarefa tarefa){
        try{
            service.updateById(id, tarefa);
            return ResponseEntity.ok(tarefa);
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/tarefas/{id}")
    public ResponseEntity<?> deleteTarefaById(@PathVariable Integer id){
        try{
            service.deleteById(id);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }
}
