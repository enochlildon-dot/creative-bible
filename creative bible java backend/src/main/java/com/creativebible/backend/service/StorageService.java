package com.creativebible.backend.service;

import com.creativebible.backend.model.Record;
import com.creativebible.backend.repository.RecordRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class StorageService {
    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);
    private final RecordRepository recordRepository;

    public StorageService(RecordRepository recordRepository) {
        this.recordRepository = recordRepository;
        logger.info("StorageService initialized with MongoDB backend");
    }

    public List<Record> loadRecords() {
        logger.info("Loading all records from MongoDB");
        return recordRepository.findAll();
    }

    public void saveRecords(List<Record> records) {
        logger.info("Saving {} records to MongoDB", records.size());
        recordRepository.saveAll(records);
        logger.info("Successfully saved records to MongoDB");
    }

    public int findRecordIndex(List<Record> records, Record record) {
        for (int i = 0; i < records.size(); i++) {
            Record r = records.get(i);
            if (equalsKey(r, record)) return i;
        }
        return -1;
    }

    private boolean equalsKey(Record a, Record b) {
        if (a == null || b == null) return false;
        return safeEquals(a.getType(), b.getType()) &&
                safeEquals(a.getPhase_index(), b.getPhase_index()) &&
                safeEquals(a.getSection_index(), b.getSection_index());
    }

    private boolean safeEquals(Object x, Object y) {
        if (x == null && y == null) return true;
        if (x == null || y == null) return false;
        return x.equals(y);
    }
}

