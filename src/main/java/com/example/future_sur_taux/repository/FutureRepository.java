package com.example.future_sur_taux.repository;

import com.example.future_sur_taux.domain.Asset;
import com.example.future_sur_taux.domain.Future;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FutureRepository extends JpaRepository<Future, Long> {
}
