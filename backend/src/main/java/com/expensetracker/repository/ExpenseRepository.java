package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, String> {
    Optional<Expense> findByIdempotencyKey(String idempotencyKey);
    List<Expense> findByUserId(String userId, Sort sort);
    List<Expense> findByUserIdAndCategory(String userId, String category, Sort sort);
}
