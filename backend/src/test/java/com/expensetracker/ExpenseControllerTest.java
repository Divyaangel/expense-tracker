package com.expensetracker;

import com.expensetracker.dto.ExpenseResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ExpenseControllerTest {

    @Autowired
    private TestRestTemplate rest;

    @Test
    void createAndListExpenses() {
        // Create an expense
        Map<String, Object> body = Map.of(
                "amount", 150.50,
                "category", "Food",
                "description", "Lunch",
                "date", "2026-04-23",
                "idempotencyKey", "test-key-1"
        );
        ResponseEntity<ExpenseResponse> created = rest.postForEntity("/expenses", body, ExpenseResponse.class);
        assertEquals(HttpStatus.CREATED, created.getStatusCode());
        assertEquals(150.50, created.getBody().getAmount());
        assertEquals("Food", created.getBody().getCategory());

        // Idempotency: same key returns same record, 200 not 201
        ResponseEntity<ExpenseResponse> duplicate = rest.postForEntity("/expenses", body, ExpenseResponse.class);
        assertEquals(HttpStatus.OK, duplicate.getStatusCode());
        assertEquals(created.getBody().getId(), duplicate.getBody().getId());

        // List all
        ResponseEntity<ExpenseResponse[]> list = rest.getForEntity("/expenses", ExpenseResponse[].class);
        assertEquals(HttpStatus.OK, list.getStatusCode());
        assertTrue(list.getBody().length >= 1);

        // Filter by category
        ResponseEntity<ExpenseResponse[]> filtered = rest.getForEntity("/expenses?category=Food&sort=date_desc", ExpenseResponse[].class);
        assertEquals(HttpStatus.OK, filtered.getStatusCode());
        for (ExpenseResponse e : filtered.getBody()) {
            assertEquals("Food", e.getCategory());
        }
    }

    @Test
    void validationRejectsInvalidInput() {
        Map<String, Object> bad = Map.of("amount", -5, "category", "", "date", "bad");
        ResponseEntity<String> res = rest.postForEntity("/expenses", bad, String.class);
        assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
    }
}
