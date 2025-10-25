package com.example.future_sur_taux.controller;

import com.example.future_sur_taux.domain.Future;
import com.example.future_sur_taux.domain.Underlying;
import com.example.future_sur_taux.dto.FutureCreationDTO;
import com.example.future_sur_taux.dto.FutureDisplayDTO;
import com.example.future_sur_taux.service.FutureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/futures")
@RequiredArgsConstructor
public class FutureController {

    private final FutureService futureService;

    @PostMapping
    public ResponseEntity<Future> createFuture(@RequestBody FutureCreationDTO dto) {
        try {
            System.out.println("=== FUTURE CREATION REQUEST ===");
            System.out.println("DTO received: " + dto);
            System.out.println("UnderlyingId: " + dto.getUnderlyingId());
            System.out.println("SettlementMethod: " + dto.getSettlementMethod());
            System.out.println("DepositType: " + dto.getDepositType());
            
            // Le service prend le DTO et construit l'entité Future, puis effectue les calculs
            Future future = futureService.createFutureFromDTO(dto);
            
            System.out.println("Future created successfully with ID: " + future.getId());
            return ResponseEntity.ok(future);
        } catch (Exception e) {
            System.err.println("ERROR creating future: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to get proper error response
        }
    }
    @GetMapping("/display")
    public List<FutureDisplayDTO> getFuturesForDisplay() {
        return futureService.getAllFuturesForDisplay();
    }
    
    @GetMapping("/test-data")
    public ResponseEntity<Map<String, Object>> getTestData() {
        Map<String, Object> testData = new HashMap<>();
        
        // Test underlying assets
        try {
            List<Underlying> allUnderlyings = futureService.getAllUnderlyings();
            testData.put("underlyingAssets", allUnderlyings);
            testData.put("underlyingCount", allUnderlyings.size());
        } catch (Exception e) {
            testData.put("underlyingError", e.getMessage());
        }
        
        return ResponseEntity.ok(testData);
    }
    




}
