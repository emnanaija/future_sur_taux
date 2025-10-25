package com.example.future_sur_taux.service;

import com.example.future_sur_taux.domain.Future;
import com.example.future_sur_taux.domain.Underlying;
import com.example.future_sur_taux.domain.UnderlyingAsset;
import com.example.future_sur_taux.domain.Bond;
import com.example.future_sur_taux.dto.FutureCreationDTO;
import com.example.future_sur_taux.dto.FutureDisplayDTO;
import com.example.future_sur_taux.repository.FutureRepository;
import com.example.future_sur_taux.repository.UnderlyingRepository;
import com.example.future_sur_taux.domain.enumeration.DepositType;
import com.example.future_sur_taux.domain.enumeration.CollateralMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FutureService {

    private final FutureRepository futureRepository;
    private final UnderlyingRepository underlyingRepository;
    private final FutureCalculationService calculationService;

    @Autowired
    private FinnhubService finnhubService;

    public Future createFutureFromDTO(FutureCreationDTO dto) {
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
        future.setDepositType(dto.getDepositType() != null ? dto.getDepositType() : DepositType.RATE);
        future.setInstrumentStatus(dto.getInstrumentStatus() != null ? dto.getInstrumentStatus() : false);
        future.setCollateralMethod(CollateralMethod.CASHCOLLATERAL);

        Underlying underlying = underlyingRepository.findById(dto.getUnderlyingId())
                .orElseThrow(() -> new RuntimeException("Underlying not found with ID: " + dto.getUnderlyingId()));
        future.setUnderlying(underlying);

        // 🔹 Calculs si bond
        if (underlying instanceof UnderlyingAsset) {
            UnderlyingAsset ua = (UnderlyingAsset) underlying;
            if (ua.getAsset() instanceof Bond) {
                Bond bond = (Bond) ua.getAsset();
                try { calculationService.calculateAll(future, bond); }
                catch (Exception e) { e.printStackTrace(); }
            }
        }

        return futureRepository.save(future);
    }


    public List<FutureDisplayDTO> getAllFuturesForDisplay() {
        List<Future> futures = futureRepository.findAll();
        String[] symbols = futures.stream().map(Future::getSymbol).distinct().toArray(String[]::new);

        Map<String, BigDecimal> marketPrices = finnhubService.getMarketPrices(symbols);

        return futures.stream()
                .map(f -> toDTO(f, marketPrices.get(f.getSymbol())))
                .collect(Collectors.toList());
    }




    private FutureDisplayDTO toDTO(Future future, BigDecimal marketPrice) {
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
        dto.setDepositType(future.getDepositType());

        if (future.getUnderlying() != null) {
            dto.setUnderlyingId(future.getUnderlying().getId());
            dto.setUnderlyingIdentifier(future.getUnderlying().getIdentifier());
            dto.setUnderlyingType(future.getUnderlying().getUnderlyingType().name());
        }

        dto.setMarketPrice(marketPrice);

        if (marketPrice != null && future.getTheoreticalPrice() != null) {
            int cmp = marketPrice.compareTo(future.getTheoreticalPrice());
            if (cmp > 0) dto.setEvaluation("SUREVALUE");
            else if (cmp < 0) dto.setEvaluation("SOUS-EVALUEE");
            else dto.setEvaluation("EGAL");
        } else {
            dto.setEvaluation("INCONNUE");
        }

        return dto;
    }
    public List<Underlying> getAllUnderlyings() {
        return underlyingRepository.findAll();
    }
}
