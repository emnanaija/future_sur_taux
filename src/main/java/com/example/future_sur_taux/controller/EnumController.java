package com.example.future_sur_taux.controller;

import com.example.future_sur_taux.domain.enumeration.DepositType;
import com.example.future_sur_taux.domain.enumeration.SettlementMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enums")
@RequiredArgsConstructor
public class EnumController {

    @GetMapping("/settlement-methods")
    public SettlementMethod[] getSettlementMethods() {
        return SettlementMethod.values();
    }

    @GetMapping("/deposit-types")
    public DepositType[] getDepositTypes() {
        return DepositType.values();
    }
}
