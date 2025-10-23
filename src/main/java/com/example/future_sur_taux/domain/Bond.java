package com.example.future_sur_taux.domain;

import com.example.future_sur_taux.domain.enumeration.Periodicity;
import com.example.future_sur_taux.domain.enumeration.RateType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bond")
@EqualsAndHashCode(callSuper = false)
public class Bond extends Asset {

    // ---------------- Champs principaux ----------------
    private BigDecimal nominal;          // Valeur nominale de l’obligation
    private BigDecimal couponAmount;     // Montant du coupon fixe (si applicable)
    private Periodicity periodicity;     // Fréquence des paiements (MENSUELLE, ANNUELLE…)
    private LocalDate maturityDate;      // Date de maturité de l’obligation
    private BigDecimal underlyingPrice;  // Prix clean (hors intérêt couru)

    // ---------------- Taux d’intérêt ----------------
    @Enumerated(EnumType.STRING)
    @Column(name = "rate_type")
    private RateType rateType;           // FIXE ou VARIABLE
    private BigDecimal indexRate;        // Indice de référence (si taux variable)

    // ---------------- Flux de coupons ----------------
    @OneToMany(mappedBy = "bond", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CashFlow> futureCoupons;  // Liste des coupons futurs (date + montant)

    /**
     * Récupère la prochaine date de paiement de coupon après la date actuelle.
     */
    public LocalDate getNextCouponDate() {
        if (futureCoupons == null || futureCoupons.isEmpty()) return null;
        return futureCoupons.stream()
                .map(CashFlow::getPaymentDate)
                .filter(d -> !d.isBefore(LocalDate.now()))
                .min(Comparator.naturalOrder())
                .orElse(null);
    }

    /**
     * Calcule la somme actualisée des coupons futurs (PV Coupons).
     * @param tauxSansRisque taux d’actualisation (ex: taux sans risque)
     */
    public BigDecimal calculerPVCoupons(BigDecimal tauxSansRisque) {
        if (futureCoupons == null || futureCoupons.isEmpty()) return BigDecimal.ZERO;
        BigDecimal pv = BigDecimal.ZERO;
        LocalDate today = LocalDate.now();
        for (CashFlow cf : futureCoupons) {
            double years = (double) (cf.getPaymentDate().toEpochDay() - today.toEpochDay()) / 365.0;
            pv = pv.add(cf.getAmount().divide(
                    BigDecimal.valueOf(Math.pow(1 + tauxSansRisque.doubleValue(), years)),
                    BigDecimal.ROUND_HALF_UP
            ));
        }
        return pv;
    }

    /**
     * Calcule l’intérêt couru depuis le dernier coupon (A).
     */
    public BigDecimal calculerInteretCouru() {
        if (futureCoupons == null || futureCoupons.isEmpty() || couponAmount == null) return BigDecimal.ZERO;

        LocalDate lastCouponDate = getLastCouponDate();
        LocalDate nextCouponDate = getNextCouponDate();
        if (lastCouponDate == null || nextCouponDate == null) return BigDecimal.ZERO;

        long joursEcoules = java.time.temporal.ChronoUnit.DAYS.between(lastCouponDate, LocalDate.now());
        long joursTotaux = java.time.temporal.ChronoUnit.DAYS.between(lastCouponDate, nextCouponDate);

        return couponAmount.multiply(BigDecimal.valueOf((double) joursEcoules / joursTotaux));
    }

    private LocalDate getLastCouponDate() {
        if (futureCoupons == null || futureCoupons.isEmpty()) return null;
        return futureCoupons.stream()
                .map(CashFlow::getPaymentDate)
                .filter(d -> d.isBefore(LocalDate.now()))
                .max(Comparator.naturalOrder())
                .orElse(null);
    }
}
