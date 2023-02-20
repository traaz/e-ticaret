package com.ali.springbootecommerce.dto;

import com.ali.springbootecommerce.entity.Address;
import com.ali.springbootecommerce.entity.Customer;
import com.ali.springbootecommerce.entity.Order;
import com.ali.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;

    private Order order;
    private Set<OrderItem> orderItems;
}
