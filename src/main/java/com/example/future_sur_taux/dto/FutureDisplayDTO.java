package com.example.future_sur_taux.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.future_sur_taux.domain.enumeration.DepositType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FutureDisplayDTO {
    private Long id;
    private String symbol;
    private String description;
    private String isin;
    private String parentTicker;
    private LocalDate firstTradingDate;
    private LocalDate lastTradingDate;
    private LocalDate maturityDate;
    private Double tickSize;
    private Double tickValue;
    private String tradingCurrency;
    private Integer lotSize;
    private Integer contractMultiplier;
    private BigDecimal percentageMargin;
    private BigDecimal theoreticalPrice;
    private BigDecimal contractValue;
    private BigDecimal initialMarginAmount;
    private Boolean instrumentStatus;
    private DepositType depositType;

    // Champs du sous-jacent (bond)
    private Long underlyingId;
    private String underlyingIdentifier;
    private String underlyingType;
}
