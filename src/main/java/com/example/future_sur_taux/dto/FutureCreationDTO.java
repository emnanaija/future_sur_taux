package com.example.future_sur_taux.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.example.future_sur_taux.domain.enumeration.SettlementMethod;
import com.example.future_sur_taux.domain.enumeration.DepositType;

@Data
public class FutureCreationDTO {

    // Champs Asset
    private String symbol;
    private String description;

    // Champs spécifiques Future
    private String isin;
    private String expirationCode;
    private String parentTicker;
    private String fullName;
    private String segment;

    private LocalDate maturityDate;
    private LocalDate firstTradingDate;
    private LocalDate lastTraadingDate;

    private BigDecimal initialMarginAmount;
    private BigDecimal percentageMargin;

    private Integer lotSize;
    private Integer contractMultiplier;

    private String tradingCurrency;

    private Long underlyingId;

    private SettlementMethod settlementMethod;
    private Boolean instrumentStatus;

    private Double tickSize;
    private Double tickValue;

    private DepositType depositType;  // ✅ Ajouté ici
}
