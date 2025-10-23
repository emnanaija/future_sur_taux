package com.example.future_sur_taux.domain;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cash_flow")
public class CashFlow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate paymentDate;   // Date du coupon
    private BigDecimal amount;       // Montant du coupon

    @ManyToOne
    @JoinColumn(name = "bond_id")
    private Bond bond;               // Lien vers l'obligation associée
}
