package com.example.future_sur_taux.domain.enumeration;
public enum RateType {
  VARIABLE_RATE("Variable"),
  FIXED_RATE("Taux fixe");

  private final String label;

  RateType(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }
}
