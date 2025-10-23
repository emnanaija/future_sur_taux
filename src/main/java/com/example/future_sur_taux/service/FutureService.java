package com.example.future_sur_taux.service;

import com.example.future_sur_taux.domain.Bond;
import com.example.future_sur_taux.domain.Future;
import com.example.future_sur_taux.domain.Underlying;
import com.example.future_sur_taux.domain.UnderlyingAsset;
import com.example.future_sur_taux.domain.enumeration.UnderlyingType;
import com.example.future_sur_taux.dto.FutureCreationDTO;
import com.example.future_sur_taux.dto.FutureDisplayDTO;
import com.example.future_sur_taux.repository.FutureRepository;
import com.example.future_sur_taux.repository.UnderlyingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FutureService {

    private final FutureRepository futureRepository;
    private final UnderlyingRepository underlyingRepository;
    private final FutureCalculationService calculationService;

    public Future createFutureFromDTO(FutureCreationDTO dto) {
        // 🔹 Construire l'entité Future à partir du DTO
        Future future = new Future();
        future.setSymbol(dto.getSymbol());
        future.setDescription(dto.getDescription());
        future.setIsin(dto.getIsin());
        future.setExpirationCode(dto.getExpirationCode());
        future.setParentTicker(dto.getParentTicker());
        future.setFullName(dto.getFullName());
        future.setSegment(dto.getSegment());
        future.setMaturityDate(dto.getMaturityDate());
        future.setFirstTradingDate(dto.getFirstTradingDate());
        future.setLastTradingDate(dto.getLastTradingDate());
        future.setLotSize(dto.getLotSize());
        future.setContractMultiplier(dto.getContractMultiplier());
        future.setTradingCurrency(dto.getTradingCurrency());
        future.setTickSize(dto.getTickSize());
        future.setTickValue(dto.getTickValue());
        future.setPercentageMargin(dto.getPercentageMargin());
        future.setSettlementMethod(dto.getSettlementMethod());
        future.setDepositType(dto.getDepositType());
        future.setInstrumentStatus(dto.getInstrumentStatus());

        Underlying underlying = underlyingRepository.findById(dto.getUnderlyingId())
                .orElseThrow(() -> new RuntimeException("Underlying not found"));
        future.setUnderlying(underlying);

// Vérifier si c’est un UnderlyingAsset qui contient un Bond
        if (underlying instanceof UnderlyingAsset) {
            if (((UnderlyingAsset) underlying).getAsset() instanceof Bond) {
                Bond bond = (Bond) ((UnderlyingAsset) underlying).getAsset();
                calculationService.calculateAll(future, bond);
            }
        }



        // 🔹 Sauvegarder en base
        return futureRepository.save(future);
    }


    public List<FutureDisplayDTO> getAllFuturesForDisplay() {
        List<Future> futures = futureRepository.findAll();
        return futures.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private FutureDisplayDTO toDTO(Future future) {
        FutureDisplayDTO dto = new FutureDisplayDTO();
        dto.setId(future.getId());
        dto.setSymbol(future.getSymbol());
        dto.setDescription(future.getDescription());
        dto.setIsin(future.getIsin());
        dto.setParentTicker(future.getParentTicker());
        dto.setFirstTradingDate(future.getFirstTradingDate());
        dto.setLastTradingDate(future.getLastTradingDate());
        dto.setMaturityDate(future.getMaturityDate());
        dto.setTickSize(future.getTickSize());
        dto.setTickValue(future.getTickValue());
        dto.setTradingCurrency(future.getTradingCurrency());
        dto.setLotSize(future.getLotSize());
        dto.setContractMultiplier(future.getContractMultiplier());
        dto.setPercentageMargin(future.getPercentageMargin());
        dto.setTheoreticalPrice(future.getTheoreticalPrice());
        dto.setContractValue(future.getContractValue());
        dto.setInitialMarginAmount(future.getInitialMarginAmount());
        dto.setInstrumentStatus(future.getInstrumentStatus());

        if (future.getUnderlying() != null) {
            dto.setUnderlyingId(future.getUnderlying().getId());
            dto.setUnderlyingIdentifier(future.getUnderlying().getIdentifier());
            dto.setUnderlyingType(future.getUnderlying().getUnderlyingType().name());
        }

        return dto;
    }
}
