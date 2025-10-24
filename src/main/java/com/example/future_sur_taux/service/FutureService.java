package com.example.future_sur_taux.service;

import com.example.future_sur_taux.domain.Bond;
import com.example.future_sur_taux.domain.Future;
import com.example.future_sur_taux.domain.Underlying;
import com.example.future_sur_taux.domain.UnderlyingAsset;
import com.example.future_sur_taux.domain.enumeration.UnderlyingType;
import com.example.future_sur_taux.domain.enumeration.CollateralMethod;
import com.example.future_sur_taux.dto.FutureCreationDTO;
import com.example.future_sur_taux.dto.FutureDisplayDTO;
import com.example.future_sur_taux.repository.FutureRepository;
import com.example.future_sur_taux.repository.UnderlyingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.example.future_sur_taux.domain.enumeration.DepositType;

@Service
@RequiredArgsConstructor
public class FutureService {

    private final FutureRepository futureRepository;
    private final UnderlyingRepository underlyingRepository;
    private final FutureCalculationService calculationService;

    public Future createFutureFromDTO(FutureCreationDTO dto) {
        try {
            System.out.println("=== FUTURE SERVICE - Creating Future ===");
            System.out.println("DTO: " + dto);
            
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
        future.setDepositType(dto.getDepositType() != null ? dto.getDepositType() : DepositType.RATE);
        future.setInstrumentStatus(dto.getInstrumentStatus());
        
        // Set default collateral method (required field)
        future.setCollateralMethod(CollateralMethod.CASHCOLLATERAL);
        
        // Set default values for required fields that might be null
        if (future.getInstrumentStatus() == null) {
            future.setInstrumentStatus(false);
        }
        if (future.getFlagForDelete() == null) {
            future.setFlagForDelete(false);
        }

        System.out.println("Looking for underlying with ID: " + dto.getUnderlyingId());
        Underlying underlying = underlyingRepository.findById(dto.getUnderlyingId())
                .orElseThrow(() -> new RuntimeException("Underlying not found with ID: " + dto.getUnderlyingId()));
        System.out.println("Found underlying: " + underlying);
        future.setUnderlying(underlying);

// Vérifier si c'est un UnderlyingAsset qui contient un Bond
        if (underlying instanceof UnderlyingAsset) {
            UnderlyingAsset underlyingAsset = (UnderlyingAsset) underlying;
            System.out.println("UnderlyingAsset: " + underlyingAsset);
            System.out.println("Asset: " + underlyingAsset.getAsset());
            
            if (underlyingAsset.getAsset() != null && underlyingAsset.getAsset() instanceof Bond) {
                Bond bond = (Bond) underlyingAsset.getAsset();
                System.out.println("Bond found: " + bond);
                try {
                    calculationService.calculateAll(future, bond);
                    System.out.println("Calculations completed successfully");
                } catch (Exception e) {
                    System.err.println("Error in calculations: " + e.getMessage());
                    e.printStackTrace();
                    // Continue without calculations rather than failing
                }
            } else {
                System.out.println("No Bond asset found, skipping calculations");
            }
        } else {
            System.out.println("Not an UnderlyingAsset, skipping calculations");
        }



        // 🔹 Sauvegarder en base
        System.out.println("Saving future to database...");
        Future savedFuture = futureRepository.save(future);
        System.out.println("Future saved successfully with ID: " + savedFuture.getId());
        return savedFuture;
        
        } catch (Exception e) {
            System.err.println("ERROR in FutureService.createFutureFromDTO: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create future: " + e.getMessage(), e);
        }
    }


    public List<FutureDisplayDTO> getAllFuturesForDisplay() {
        List<Future> futures = futureRepository.findAll();
        return futures.stream().map(this::toDTO).collect(Collectors.toList());
    }
    
    public List<Underlying> getAllUnderlyings() {
        return underlyingRepository.findAll();
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
        dto.setDepositType(future.getDepositType());

        if (future.getUnderlying() != null) {
            dto.setUnderlyingId(future.getUnderlying().getId());
            dto.setUnderlyingIdentifier(future.getUnderlying().getIdentifier());
            dto.setUnderlyingType(future.getUnderlying().getUnderlyingType().name());
        }

        return dto;
    }
}
