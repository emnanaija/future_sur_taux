package com.example.future_sur_taux.repository;

import com.example.future_sur_taux.domain.Future;
import com.example.future_sur_taux.domain.Underlying;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnderlyingRepository extends JpaRepository<Underlying, Long> {
}
