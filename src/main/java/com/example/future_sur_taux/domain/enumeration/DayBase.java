package com.example.future_sur_taux.domain.enumeration;
public enum DayBase {
  DAY_BASE_365(365),
  DAY_BASE_360(360),
  DAY_BASE_366(366),
  DAY_BASE_252(252),
  REAL_BASE(0);
  private final int value;

  DayBase(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }
}
