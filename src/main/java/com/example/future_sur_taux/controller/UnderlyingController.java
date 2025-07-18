package com.example.future_sur_taux.controller;

import com.example.future_sur_taux.domain.enumeration.UnderlyingType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/underlyings")
public class UnderlyingController {

    @GetMapping("/types")
    public ResponseEntity<List<String>> getUnderlyingTypes() {
        List<String> types = Arrays.stream(UnderlyingType.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(types);
    }
}
