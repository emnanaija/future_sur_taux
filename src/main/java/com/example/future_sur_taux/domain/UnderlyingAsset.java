package com.example.future_sur_taux.domain;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
//@Table(name = "underlying_asset", schema = CurrentTenantResolver.DEFAULT_SCHEMA)
@Table(name = "underlying_asset")

//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("squid:S2160")
@EqualsAndHashCode(callSuper = false)
public class UnderlyingAsset extends Underlying {

   /* @Id
    private Long id;
*/
    @OneToOne
    private Asset asset;
}

