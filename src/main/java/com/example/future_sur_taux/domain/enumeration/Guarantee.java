package com.example.future_sur_taux.domain.enumeration;
public enum Guarantee {
  STATE_GUARANTEED("Avec Garantie de l'état"),
  CO_GUARANTEE("Garantie conjointe"),
  SECURED("Sécurisé"),
  UNSECURED("Non Garantie / non sécurisé"),
  NEGATIVE_PLEDGE("Gage négatif"),
  SENIOR("Sénior"),
  SUBORDINATED_SENIOR("Sénior Subordonné"),
  JUNIOR("Junoir"),
  SUBORDINATED_JUNIOR("Junoir Subordonné"),
  SUPRANATIONAL("Supranational");

  private final String label;

  Guarantee(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }
}
