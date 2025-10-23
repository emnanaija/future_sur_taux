package com.example.future_sur_taux.service;

import com.example.future_sur_taux.domain.Bond;
import com.example.future_sur_taux.domain.Future;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class FutureCalculationService {

    // Exemple : taux sans risque fixe pour simplification (3% par an)
    private static final BigDecimal RISK_FREE_RATE = BigDecimal.valueOf(0.03);

    /**
     * Calcule le prix théorique du future sur obligation.
     * Approche réaliste : (Prix clean + Intérêt couru - PV coupons) actualisé avec capitalisation continue
     */
    public void calculateTheoreticalPrice(Future future, Bond bond) {
        if (future == null || bond == null) return;

        BigDecimal cleanPrice = bond.getUnderlyingPrice() != null ? bond.getUnderlyingPrice() : BigDecimal.ZERO;
        BigDecimal accruedInterest = bond.calculerInteretCouru(); // intérêt couru depuis dernier coupon
        BigDecimal pvCoupons = bond.calculerPVCoupons(RISK_FREE_RATE); // PV des coupons actualisés

        // Calcul de la durée jusqu'à maturité en années
        LocalDate today = LocalDate.now();
        LocalDate maturity = future.getMaturityDate() != null ? future.getMaturityDate() : today;
        long daysToMaturity = ChronoUnit.DAYS.between(today, maturity);
        BigDecimal t = BigDecimal.valueOf(daysToMaturity).divide(BigDecimal.valueOf(365), 10, RoundingMode.HALF_UP);

        // Capitalisation continue : F = (Clean + AI - PV coupons) * exp(rf * t)
        double exponent = RISK_FREE_RATE.doubleValue() * t.doubleValue();
        BigDecimal expFactor = BigDecimal.valueOf(Math.exp(exponent));

        BigDecimal theoreticalPrice = cleanPrice
                .add(accruedInterest)
                .subtract(pvCoupons)
                .multiply(expFactor)
                .setScale(4, RoundingMode.HALF_UP);

        future.setTheoreticalPrice(theoreticalPrice);
    }

    /**
     * Calcule la valeur totale du contrat (Contract Value)
     */
    public void calculateContractValue(Future future) {
        if (future.getTheoreticalPrice() != null && future.getContractMultiplier() != null) {
            BigDecimal contractValue = future.getTheoreticalPrice()
                    .multiply(BigDecimal.valueOf(future.getContractMultiplier()))
                    .setScale(4, RoundingMode.HALF_UP);
            future.setContractValue(contractValue);
        }
    }

    /**
     * Calcule la marge initiale (Initial Margin)
     */
    public void calculateInitialMargin(Future future) {
        if (future.getContractValue() != null && future.getPercentageMargin() != null) {
            BigDecimal initialMargin = future.getContractValue()
                    .multiply(future.getPercentageMargin())
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            future.setInitialMarginAmount(initialMargin);
        }
    }

    /**
     * Méthode complète pour calculer tous les champs calculés d'un Future
     */
    public void calculateAll(Future future, Bond bond) {
        calculateTheoreticalPrice(future, bond);
        calculateContractValue(future);
        calculateInitialMargin(future);
    }
}
