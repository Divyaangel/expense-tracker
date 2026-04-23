package com.expensetracker.dto;

import com.expensetracker.model.Expense;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenseResponse {
    private String id;
    private double amount;
    private String category;
    private String description;
    private LocalDate date;
    private LocalDateTime createdAt;

    public static ExpenseResponse from(Expense e) {
        ExpenseResponse r = new ExpenseResponse();
        r.id = e.getId();
        r.amount = e.getAmountCents() / 100.0;
        r.category = e.getCategory();
        r.description = e.getDescription();
        r.date = e.getDate();
        r.createdAt = e.getCreatedAt();
        return r;
    }

    public String getId() { return id; }
    public double getAmount() { return amount; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public LocalDate getDate() { return date; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
