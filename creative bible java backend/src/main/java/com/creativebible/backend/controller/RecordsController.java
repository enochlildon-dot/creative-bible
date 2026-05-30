package com.creativebible.backend.controller;

import com.creativebible.backend.model.Record;
import com.creativebible.backend.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/records")
public class RecordsController {

    private static final Logger logger = LoggerFactory.getLogger(RecordsController.class);
    private final StorageService storage;

    public RecordsController(StorageService storage) {
        this.storage = storage;
    }

    @GetMapping
    public List<Record> getAll() {
        logger.info("GET /api/records - Loading all records");
        List<Record> records = storage.loadRecords();
        logger.info("Found {} records in MongoDB", records.size());
        return records;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdate(@RequestBody Record record) {
        logger.info("=== CREATE/UPDATE REQUEST ===");
        if (record == null) return ResponseEntity.badRequest().body("Invalid payload");
        logger.info("Received record: type={}, phase={}, section={}", record.getType(), record.getPhase_index(), record.getSection_index());
        List<Record> records = storage.loadRecords();
        int idx = storage.findRecordIndex(records, record);
        if (idx >= 0) {
            Record existing = records.get(idx);
            if (record.getTitle() != null) existing.setTitle(record.getTitle());
            if (record.getBody() != null) existing.setBody(record.getBody());
            if (record.getLink_url() != null) existing.setLink_url(record.getLink_url());
            if (record.getNotes() != null) existing.setNotes(record.getNotes());
            records.set(idx, existing);
            logger.info("Updated existing record");
        } else {
            records.add(record);
            logger.info("Added new record");
        }
        storage.saveRecords(records);
        logger.info("=== END CREATE/UPDATE ===");
        return ResponseEntity.ok().body(new ApiResponse(true, record));
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> bulkCreate(@RequestBody List<Record> changes) {
        logger.info("=== BULK SAVE REQUEST ===");
        logger.info("Received {} records to save", changes == null ? 0 : changes.size());
        if (changes != null) {
            changes.forEach(c -> logger.info("  - type={}, phase={}, section={}", c.getType(), c.getPhase_index(), c.getSection_index()));
        }
        
        if (changes == null) return ResponseEntity.badRequest().body("Invalid payload");
        List<Record> records = storage.loadRecords();
        logger.info("Current records in storage: {}", records.size());
        
        for (Record change : changes) {
            int idx = storage.findRecordIndex(records, change);
            if (idx >= 0) {
                Record existing = records.get(idx);
                if (change.getTitle() != null) existing.setTitle(change.getTitle());
                if (change.getBody() != null) existing.setBody(change.getBody());
                if (change.getLink_url() != null) existing.setLink_url(change.getLink_url());
                if (change.getNotes() != null) existing.setNotes(change.getNotes());
                records.set(idx, existing);
                logger.info("Updated existing record at index {}", idx);
            } else {
                records.add(change);
                logger.info("Added new record");
            }
        }
        storage.saveRecords(records);
        logger.info("Successfully saved {} total records to storage", records.size());
        logger.info("=== END BULK SAVE ===");
        return ResponseEntity.ok().body(new ApiResponse(true, records));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteRecord(@RequestBody Record record) {
        if (record == null) return ResponseEntity.badRequest().body("Invalid payload");
        List<Record> records = storage.loadRecords();
        int idx = storage.findRecordIndex(records, record);
        if (idx == -1) return ResponseEntity.status(404).body("Record not found");
        records.remove(idx);
        storage.saveRecords(records);
        return ResponseEntity.ok().body(new ApiResponse(true, null));
    }

    static class ApiResponse {
        public boolean isOk;
        public Object data;

        public ApiResponse(boolean isOk, Object data) {
            this.isOk = isOk;
            this.data = data;
        }

        public boolean getIsOk(){ return isOk; }
        public Object getData(){ return data; }
    }
}
