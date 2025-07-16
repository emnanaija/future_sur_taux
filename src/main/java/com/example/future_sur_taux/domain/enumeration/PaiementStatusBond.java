package com.example.future_sur_taux.domain.enumeration;
public enum PaiementStatusBond {
  FIXED("Fixe"),
  FIXED_WITH_CALL("Fixe avec Call"),
  FIXED_WITH_PUT("Fixe avec Put"),
  FIXED_WITH_PUTANDCALL("Fixe avec Put & Call"),
  AMORTIZING("Amortissable"),
  AMORTIZING_WITH_CALL("Amortissable avec call"),
  AMORTIZING_WITH_PUT("Amortissable avec put"),
  AMORTIZING_WITH_PUTANDCALL("Amortissable avec put and call"),
  PERPETUAL("Perpétuelle"),
  PERPETUAL_WITH_CALL("Perpétuelle avec call"),
  PERPETUAL_WITH_PUT("Perpétuelle avec put"),
  EXTENDABLE("Extensibles");

  private final String label;

  PaiementStatusBond(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }
}
