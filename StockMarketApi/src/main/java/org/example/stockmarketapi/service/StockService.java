package org.example.stockmarketapi.service;

import java.util.List;
import java.util.Optional;

import org.example.stockmarketapi.entity.Stock;
import org.example.stockmarketapi.repository.StockRepository;
import org.springframework.stereotype.Service;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<Stock> findAll(String code) {
        if (code == null || code.isBlank()) {
            return stockRepository.findAll();
        }
        return stockRepository.findByCode(code);
    }

    public Optional<Stock> findById(Long id) {
        return stockRepository.findById(id);
    }

    public Stock create(Stock stock) {
        stock.setId(null);
        if (stock.getFavorite() == null) {
            stock.setFavorite(false);
        }
        return stockRepository.save(stock);
    }

    public Optional<Stock> replace(Long id, Stock stock) {
        return stockRepository.findById(id).map(existing -> {
            existing.setName(stock.getName());
            existing.setCode(stock.getCode());
            existing.setPrice(stock.getPrice());
            existing.setPreviousPrice(stock.getPreviousPrice());
            existing.setExchange(stock.getExchange());
            existing.setFavorite(stock.getFavorite() != null ? stock.getFavorite() : false);
            return stockRepository.save(existing);
        });
    }

    public Optional<Stock> update(Long id, Stock patch) {
        return stockRepository.findById(id).map(existing -> {
            if (patch.getName() != null) {
                existing.setName(patch.getName());
            }
            if (patch.getCode() != null) {
                existing.setCode(patch.getCode());
            }
            if (patch.getPrice() != null) {
                existing.setPrice(patch.getPrice());
            }
            if (patch.getPreviousPrice() != null) {
                existing.setPreviousPrice(patch.getPreviousPrice());
            }
            if (patch.getExchange() != null) {
                existing.setExchange(patch.getExchange());
            }
            if (patch.getFavorite() != null) {
                existing.setFavorite(patch.getFavorite());
            }
            return stockRepository.save(existing);
        });
    }

    public Optional<Stock> delete(Long id) {
        return stockRepository.findById(id).map(existing -> {
            stockRepository.delete(existing);
            return existing;
        });
    }
}