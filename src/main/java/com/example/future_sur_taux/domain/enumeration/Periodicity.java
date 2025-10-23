package com.example.future_sur_taux.domain.enumeration;
/** The Periodicity enumeration. */
public enum Periodicity {
  INFINITY(0),
  DAILY(0),
  WEEKLY(0),
  MONTHLY(1),
  QUARTERLY(3),
  SEMI_ANNUAL(6),
  ANNUAL(12);

  private final int months;

  Periodicity(int months) {
    this.months = months;
  }

  public int getMonths() {
    return months;
  }
}

