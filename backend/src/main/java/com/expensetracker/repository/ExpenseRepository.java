package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, String> {
    Optional<Expense> findByIdempotencyKey(String idempotencyKey);
    List<Expense> findByCategoryOrderByDateDescCreatedAtDesc(String category);
    List<Expense> findByCategoryOrderByCreatedAtDesc(String category);
    List<Expense> findAllByOrderByDateDescCreatedAtDesc();
    List<Expense> findAllByOrderByCreatedAtDesc();
}
