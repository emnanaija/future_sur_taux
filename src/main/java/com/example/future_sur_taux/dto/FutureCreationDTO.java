package com.example.future_sur_taux.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.example.future_sur_taux.domain.enumeration.SettlementMethod;
import com.example.future_sur_taux.domain.enumeration.DepositType;

@Data
public class FutureCreationDTO {

    // 🔹 Champs Asset
    private String symbol;
    private String description;

    // 🔹 Champs spécifiques Future
    private String isin;
    private String expirationCode;
    private String parentTicker;
    private String fullName;
    private String segment;

    private LocalDate maturityDate;
    private LocalDate firstTradingDate;
    private LocalDate lastTradingDate; // ✅ correction typo

    // 🔹 Paramètres de trading
    private Integer lotSize;
    private Integer contractMultiplier;
    private String tradingCurrency;

    // 🔹 Caractéristiques du marché
    private Double tickSize;
    private Double tickValue;

    // 🔹 Données de calcul
    private BigDecimal percentageMargin;   // Pourcentage de marge (ex: 5%)
    private Long underlyingId;              // ID du sous-jacent

    // 🔹 Autres informations
    private SettlementMethod settlementMethod;
    private DepositType depositType;
    private Boolean instrumentStatus;
}
