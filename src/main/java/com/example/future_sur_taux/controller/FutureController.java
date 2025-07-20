package com.example.future_sur_taux.controller;

import com.example.future_sur_taux.domain.Future;
import com.example.future_sur_taux.service.FutureService;
import com.example.future_sur_taux.dto.FutureCreationDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/futures")
@RequiredArgsConstructor
public class FutureController {

    private final FutureService futureService;

    @PostMapping
    public ResponseEntity<Future> createFuture(@RequestBody FutureCreationDTO dto) {
        Future future = futureService.createFuture(dto);
        return ResponseEntity.ok(future);
    }


}

