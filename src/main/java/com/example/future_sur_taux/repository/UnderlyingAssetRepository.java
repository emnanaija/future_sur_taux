package com.example.future_sur_taux.repository;

import com.example.future_sur_taux.domain.UnderlyingAsset;
import com.example.future_sur_taux.domain.enumeration.UnderlyingType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnderlyingAssetRepository extends JpaRepository<UnderlyingAsset, Long> {
    List<UnderlyingAsset> findByUnderlyingType(UnderlyingType underlyingType);

}
