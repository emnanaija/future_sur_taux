package com.example.future_sur_taux.domain;

import com.example.future_sur_taux.domain.enumeration.CollateralMethod;
import com.example.future_sur_taux.domain.enumeration.DepositType;
import com.example.future_sur_taux.domain.enumeration.SettlementMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
//@Table(name = "future", schema = CurrentTenantResolver.DEFAULT_SCHEMA)
@Table(name = "future")

//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("squid:S2160")
@EqualsAndHashCode(callSuper = false)
public class Future extends Asset  {


    @Id
    private Long id;

    private String symbol;
    private Boolean instrumentStatus;
    private String loadId;
    private String fullName;
    private String tradingParameter;
    private LocalDate lastTradingDate;
    private String segment;
    private String calendarId;
    private Boolean flagForDelete;
    private String md5MulticastChannelId;
    private String tradingCurrency;
    private String activeLoadId;
    private String secMD5MulticastChannelId;
    private String secondaryLoadId;
    private LocalDate expiryDate;
    private String internalLoadId;
    private String marketDataChannelId;
    private String referencePriceTable;
    private String referencePrice;
    private Boolean blueMonth;

    @Enumerated(EnumType.STRING)
    private SettlementMethod settlementMethod;

    private LocalDate firstTradingDate;
    private LocalDate deletionDate;
    private String parentTicker;
    private String cfiCode;
    private String mobType;
    private String postTradeParameter;
    private LocalDate settlementDate;
    private LocalDate maturityDate;
    private Double issuedQty;
    private LocalDate orderDeletionDate;
    private Integer lotSize;//contract size
    private String expirationCode;

    // Multiplicateur du contrat (contract size)
    private Integer contractMultiplier;

    // Tick size (la plus petite variation de prix possible)
    private Double tickSize;

    // Tick value (valeur monétaire d’une variation d’un tick)
    private Double tickValue;

    @Column(name = "percentage_margin", precision = 5, scale = 2)
    private BigDecimal percentageMargin;

    @Column(name = "initial_margin_amount", precision = 15, scale = 2)
    private BigDecimal initialMarginAmount;


    @Enumerated(EnumType.STRING)
    private DepositType depositType;

    @Enumerated(EnumType.STRING)
    private CollateralMethod collateralMethod;

    @OneToOne
    private Underlying underlying;

   /* @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = "futures", allowSetters = true)
    private ClearingHouse clearingHouse;

*/
}
