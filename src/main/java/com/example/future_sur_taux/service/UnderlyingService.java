package com.example.future_sur_taux.service;

import com.example.future_sur_taux.domain.Underlying;
import com.example.future_sur_taux.repository.UnderlyingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnderlyingService {
    private final UnderlyingRepository underlyingRepository;

    public List<Underlying> getAllUnderlyings() {
        return underlyingRepository.findAll();
    }
}
