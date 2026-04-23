package com.expensetracker.controller;

import com.expensetracker.dto.CreateExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/expenses")
@CrossOrigin
public class ExpenseController {

    private final ExpenseRepository repo;

    public ExpenseController(ExpenseRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@Valid @RequestBody CreateExpenseRequest req) {
        // Idempotency check
        if (req.getIdempotencyKey() != null) {
            Optional<Expense> existing = repo.findByIdempotencyKey(req.getIdempotencyKey());
            if (existing.isPresent()) {
                return ResponseEntity.ok(ExpenseResponse.from(existing.get()));
            }
        }

        Expense e = new Expense();
        e.setId(UUID.randomUUID().toString());
        e.setIdempotencyKey(req.getIdempotencyKey());
        e.setAmountCents(Math.round(req.getAmount() * 100));
        e.setCategory(req.getCategory().trim());
        e.setDescription(req.getDescription() != null ? req.getDescription().trim() : "");
        e.setDate(req.getDate());

        try {
            repo.save(e);
        } catch (Exception ex) {
            // Race condition fallback: another thread inserted with same key
            if (req.getIdempotencyKey() != null) {
                Optional<Expense> existing = repo.findByIdempotencyKey(req.getIdempotencyKey());
                if (existing.isPresent()) {
                    return ResponseEntity.ok(ExpenseResponse.from(existing.get()));
                }
            }
            throw ex;
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(ExpenseResponse.from(e));
    }

    @GetMapping
    public List<ExpenseResponse> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort) {

        List<Expense> expenses;
        boolean sortByDate = "date_desc".equals(sort);

        if (category != null && !category.isBlank()) {
            expenses = sortByDate
                    ? repo.findByCategoryOrderByDateDescCreatedAtDesc(category)
                    : repo.findByCategoryOrderByCreatedAtDesc(category);
        } else {
            expenses = sortByDate
                    ? repo.findAllByOrderByDateDescCreatedAtDesc()
                    : repo.findAllByOrderByCreatedAtDesc();
        }

        return expenses.stream().map(ExpenseResponse::from).toList();
    }
}
