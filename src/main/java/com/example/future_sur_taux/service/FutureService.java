package com.example.future_sur_taux.service;

import com.example.future_sur_taux.domain.Future;
import com.example.future_sur_taux.domain.Underlying;
import com.example.future_sur_taux.domain.enumeration.CollateralMethod;
import com.example.future_sur_taux.domain.enumeration.DepositType;
import com.example.future_sur_taux.dto.FutureCreationDTO;
import com.example.future_sur_taux.repository.FutureRepository;
import com.example.future_sur_taux.repository.UnderlyingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FutureService {

    private final FutureRepository futureRepository;
    private final UnderlyingRepository underlyingRepository;

    public Future createFuture(FutureCreationDTO dto) {
        Future future = new Future();

        // Champs saisis par l'utilisateur (DTO)
        future.setSymbol(dto.getSymbol());
        future.setDescription(dto.getDescription());
        future.setExpirationCode(dto.getExpirationCode());
        future.setParentTicker(dto.getParentTicker());
        future.setFullName(dto.getFullName());
        future.setSegment(dto.getSegment());
        future.setFirstTradingDate(dto.getFirstTradingDate());
        future.setLastTraadingDate(dto.getLastTraadingDate());
        future.setMaturityDate(dto.getMaturityDate());
        future.setSettlementMethod(dto.getSettlementMethod());
        future.setInstrumentStatus(dto.getInstrumentStatus());
        future.setLotSize(dto.getLotSize());
        future.setContractMultiplier(dto.getContractMultiplier());
        future.setTickSize(dto.getTickSize());
        future.setTickValue(dto.getTickValue());
        future.setTradingCurrency(dto.getTradingCurrency());
        future.setPercentageMargin(dto.getPercentageMargin());
        future.setInitialMarginAmount(dto.getInitialMarginAmount());
        future.setDepositType(dto.getDepositType());

        // Relation Underlying
        Underlying underlying = underlyingRepository.findById(dto.getUnderlyingId())
                .orElseThrow(() -> new RuntimeException("Underlying introuvable"));
        future.setUnderlying(underlying);

        // Initialisation automatique des autres champs côté backend
        future.setLoadId(UUID.randomUUID().toString());      // Ex: génération UUID pour loadId
        future.setTradingParameter(null);                     // Par défaut null ou une valeur par défaut
        future.setCalendarId(null);
        future.setFlagForDelete(false);                        // Flag par défaut false
        future.setMd5MulticastChannelId(null);
        future.setActiveLoadId(null);
        future.setSecMD5MulticastChannelId(null);
        future.setSecondaryLoadId(null);
        future.setExpiryDate(dto.getMaturityDate());          // Exemple : expiryDate = maturityDate (à adapter)
        future.setInternalLoadId(null);
        future.setMarketDataChannelId(null);
        future.setReferencePriceTable(null);
        future.setReferencePrice(null);
        future.setBlueMonth(false);
        future.setDeletionDate(null);
        future.setCfiCode(null);
        future.setMobType(null);
        future.setPostTradeParameter(null);
        future.setSettlementDate(null);
        future.setIssuedQty(0.0);                              // Par défaut 0
        future.setOrderDeletionDate(null);

        // Enums à null ou à une valeur par défaut (à adapter selon ton contexte)
        future.setCollateralMethod(CollateralMethod.CASHCOLLATERAL);     // Exemple : NONE si défini

        // Sauvegarde en base
        return futureRepository.save(future);
    }


}
