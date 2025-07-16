package com.example.future_sur_taux.repository;

import com.example.future_sur_taux.domain.UnderlyingAsset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnderlyingAssetRepository extends JpaRepository<UnderlyingAsset, Long> {
}
