package com.example.future_sur_taux.domain;

import com.example.future_sur_taux.domain.enumeration.UnderlyingType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
//@Table(name = "underlying", schema = CurrentTenantResolver.DEFAULT_SCHEMA)
@Table(name = "underlying")

//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Inheritance(strategy = InheritanceType.JOINED)
@EqualsAndHashCode(callSuper = false)
public class Underlying {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String identifier;

    @Enumerated(EnumType.STRING)
    private UnderlyingType underlyingType;
}

