package com.example.future_sur_taux.domain;

import com.example.future_sur_taux.domain.enumeration.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
//@Table(name = "bond", schema = CurrentTenantResolver.DEFAULT_SCHEMA)
@Table(name = "bond")

//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("squid:S2160")
@EqualsAndHashCode(callSuper = false)
public class Bond  extends Asset{

/*
    @Id
    private Long id;
*/
    @Column(name = "indexed")
    private Boolean indexed;

    @Column(name = "listed")
    private Boolean listed;

    @Column(name = "reference")
    private String reference;

    @Column(name = "eligibility_indicator")
    private Boolean eligibilityIndicator;

    @Column(name = "maturity_date")
    private LocalDate maturityDate;

    @Column(name = "dated_date")
    private LocalDate datedDate;

    @Column(name = "delisting_date")
    private LocalDate delistingDate;

    @Column(name = "convertibility_indicator")
    private Boolean convertibilityIndicator;

    @Column(name = "subordination_indicator")
    private Boolean subordinationIndicator;

    @Column(name = "amortization_table_management")
    private Boolean amortizationTableManagement;

    @Column(name = "variable_rate")
    private Boolean variableRate;

    @Column(name = "pool_factor")
    private BigDecimal poolFactor;

    @Column(name = "risk_premium")
    private BigDecimal riskPremium;

    @Enumerated(EnumType.STRING)
    @Column(name = "amortizationType")
    private AmortizationType amortizationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "bondNature")
    private BondNature bondNature;

    @Enumerated(EnumType.STRING)
    @Column(name = "advance_type")
    private AdvanceType advanceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "rateType")
    private RateType rateType;

    @Enumerated(EnumType.STRING)
    @Column(name = "guarantee")
    private Guarantee guarantee;

    @Enumerated(EnumType.STRING)
    @Column(name = "bond_classification")
    private BondClassification bondClassification;

    @Enumerated(EnumType.STRING)
    @Column(name = "paiement_status")
    private PaiementStatusBond paiementStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "priodicity")
    private Periodicity periodicity;

    @Column(name = "rate")
    private BigDecimal rate;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_base")
    private DayBase dayBase;

   /* @Enumerated(EnumType.STRING)
    @Column(name = "rounding_mode")
    private RoundingMode roundingMode;
*/
    @Enumerated(EnumType.STRING)
    @Column(name = "bond_category")
    private BondCategory bondCategory;
}
