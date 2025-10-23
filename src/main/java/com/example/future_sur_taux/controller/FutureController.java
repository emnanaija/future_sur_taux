package com.example.future_sur_taux.controller;

import com.example.future_sur_taux.domain.Future;
import com.example.future_sur_taux.dto.FutureCreationDTO;
import com.example.future_sur_taux.dto.FutureDisplayDTO;
import com.example.future_sur_taux.service.FutureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/futures")
@RequiredArgsConstructor
public class FutureController {

    private final FutureService futureService;

    @PostMapping
    public ResponseEntity<Future> createFuture(@RequestBody FutureCreationDTO dto) {
        // Le service prend le DTO et construit l'entité Future, puis effectue les calculs
        Future future = futureService.createFutureFromDTO(dto);
        return ResponseEntity.ok(future);
    }
    @GetMapping("/display")
    public List<FutureDisplayDTO> getFuturesForDisplay() {
        return futureService.getAllFuturesForDisplay();
    }




}
