package com.expensetracker.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class CreateExpenseRequest {

    @NotNull(message = "amount is required")
    @Positive(message = "amount must be positive")
    private Double amount;

    @NotBlank(message = "category is required")
    private String category;

    private String description;

    @NotNull(message = "date is required")
    private LocalDate date;

    private String idempotencyKey;

    public Double getAmount() { return amount; }
    public void setAmount(Double a) { this.amount = a; }
    public String getCategory() { return category; }
    public void setCategory(String c) { this.category = c; }
    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate d) { this.date = d; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String k) { this.idempotencyKey = k; }
}
