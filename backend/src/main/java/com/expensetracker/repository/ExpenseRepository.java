package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, String> {
    Optional<Expense> findByIdempotencyKey(String idempotencyKey);
    Page<Expense> findByUserId(String userId, Pageable pageable);
    Page<Expense> findByUserIdAndCategory(String userId, String category, Pageable pageable);
}
