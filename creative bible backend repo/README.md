# Creative Bible - Backend Repository

This folder is reserved for alternative backend implementations (Node.js, Python, Go, etc.).

## Purpose

Currently, the backend is a **Spring Boot (Java)** application in the `../creative bible java backend` folder. If you decide to maintain a separate backend or switch to a different technology, use this folder as the repository root.

## Current Status

This folder is currently **empty** and not in use. The primary backend is a Java/Spring Boot application.

## Setup (Future)

When adding an alternative backend:

1. Initialize your backend project here (e.g., `npm init`, `python -m venv`, etc.)
2. Implement the required API endpoints (see below)
3. Ensure it exposes the same REST API as the current Java backend

## API Contract

The frontend expects these endpoints:

- `GET /api/records` - List all records
- `POST /api/records` - Create or update a single record
- `POST /api/records/bulk` - Bulk create/update multiple records
- `DELETE /api/records` - Delete a record by `type`, `phase_index`, `section_index`

### Record Schema

```json
{
  "_id": "uuid",
  "type": "phase_edit|section_edit|link|note",
  "phase_index": 0,
  "section_index": -1,
  "title": "string (optional)",
  "body": "string (optional)",
  "link_url": "string (optional)",
  "notes": "string (optional)"
}
```

## Data Storage

Current implementation uses **MongoDB Atlas**.

If you implement an alternative backend, ensure:
- Connection to the same MongoDB instance or equivalent database
- Same record structure and CRUD operations
- CORS enabled for frontend communication

## See Also

- [Parent README](../README.md)
- [Java Backend Documentation](../creative%20bible%20java%20backend/README.md)
