package com.example.future_sur_taux.controller;

import com.example.future_sur_taux.domain.UnderlyingAsset;
import com.example.future_sur_taux.domain.enumeration.UnderlyingType;
import com.example.future_sur_taux.service.UnderlyingAssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/underlying-assets")
@RequiredArgsConstructor
public class UnderlyingAssetController {

    private final UnderlyingAssetService underlyingAssetService;

    @GetMapping
    public ResponseEntity<List<UnderlyingAsset>> getByType(@RequestParam UnderlyingType type) {
        List<UnderlyingAsset> assets = underlyingAssetService.getUnderlyingAssetsByType(type);
        return ResponseEntity.ok(assets);
    }
}
