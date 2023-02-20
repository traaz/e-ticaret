package com.ali.springbootecommerce.service;

import com.ali.springbootecommerce.dto.Purchase;
import com.ali.springbootecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
