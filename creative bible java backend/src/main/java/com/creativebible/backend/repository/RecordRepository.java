package com.creativebible.backend.repository;

import com.creativebible.backend.model.Record;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordRepository extends MongoRepository<Record, String> {
    // Spring Data MongoDB will handle queries via MongoRepository's built-in methods
}
