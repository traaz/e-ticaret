package com.ali.springbootecommerce.service;

import com.ali.springbootecommerce.dao.CustomerRepository;
import com.ali.springbootecommerce.dto.Purchase;
import com.ali.springbootecommerce.dto.PurchaseResponse;
import com.ali.springbootecommerce.entity.Customer;
import com.ali.springbootecommerce.entity.Order;
import com.ali.springbootecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //siprais bilgilerini dtodan al
        Order order= purchase.getOrder();

        //takip numarasi olustur
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //siparisini ordemItems ile doldur
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //siparisi adresleri doldur
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //siparisi musteriyle doldur
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //kaydet
        customerRepository.save(customer);



        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
