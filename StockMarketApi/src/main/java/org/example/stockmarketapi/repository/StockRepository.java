package org.example.stockmarketapi.repository;

import java.util.List;

import org.example.stockmarketapi.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {

    List<Stock> findByCode(String code);

    boolean existsByCode(String code);
}