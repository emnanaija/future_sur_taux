package com.example.future_sur_taux.service;

import com.example.future_sur_taux.domain.UnderlyingAsset;
import com.example.future_sur_taux.domain.enumeration.UnderlyingType;
import com.example.future_sur_taux.repository.UnderlyingAssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnderlyingAssetService {

    private final UnderlyingAssetRepository underlyingAssetRepository;

    public List<UnderlyingAsset> getUnderlyingAssetsByType(UnderlyingType type) {
        return underlyingAssetRepository.findByUnderlyingType(type);
    }
}

