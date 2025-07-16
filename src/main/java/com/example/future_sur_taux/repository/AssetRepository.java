package com.example.future_sur_taux.repository;

import com.example.future_sur_taux.domain.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {
}
