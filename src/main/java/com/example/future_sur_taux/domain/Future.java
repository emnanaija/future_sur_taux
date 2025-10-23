package com.example.future_sur_taux.domain;

import com.example.future_sur_taux.domain.enumeration.CollateralMethod;
import com.example.future_sur_taux.domain.enumeration.DepositType;
import com.example.future_sur_taux.domain.enumeration.SettlementMethod;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Future {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 // 🔹 Informations générales
 private String symbol;
 private String description;
 private String isin;
 private String expirationCode;
 private String parentTicker;
 private String fullName;
 private String segment;

 // 🔹 Dates clés
 private LocalDate firstTradingDate;
 private LocalDate lastTradingDate;   // ✅ correction typo
 private LocalDate maturityDate;
 private LocalDate expiryDate;

 // 🔹 Données de marché
 private Double tickSize;
 private Double tickValue;
 private String tradingCurrency;
 private Integer lotSize;
 private Integer contractMultiplier;

 // 🔹 Liens et méthodes
 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "underlying_id")
 private Underlying underlying;

 @Enumerated(EnumType.STRING)
 private SettlementMethod settlementMethod;

 @Enumerated(EnumType.STRING)
 private CollateralMethod collateralMethod;

 @Enumerated(EnumType.STRING)
 private DepositType depositType;

 // 🔹 Données calculées
 @Column(precision = 5, scale = 2)
 private BigDecimal percentageMargin;
 @Column(precision = 15, scale = 6)
 private BigDecimal theoreticalPrice;    // Prix théorique du future
 @Column(precision = 20, scale = 6)
 private BigDecimal contractValue;       // Valeur totale du contrat
 @Column(precision = 20, scale = 6)
 private BigDecimal initialMarginAmount; // Montant de la marge initiale

 // 🔹 États internes
 private Boolean instrumentStatus;
 private Boolean flagForDelete;
 private BigDecimal issuedQty;

 // 🔹 Métadonnées techniques
 private String loadId;
 private String activeLoadId;
 private String secondaryLoadId;
 private String internalLoadId;
 private String md5MulticastChannelId;
 private String secMD5MulticastChannelId;
 private String marketDataChannelId;
 private String referencePriceTable;

 private BigDecimal referencePrice;
 private Boolean blueMonth;
 private LocalDate settlementDate;
 private LocalDate deletionDate;
 private LocalDate orderDeletionDate;

 private String mobType;
 private String postTradeParameter;
 private String tradingParameter;
 private String calendarId;
}
