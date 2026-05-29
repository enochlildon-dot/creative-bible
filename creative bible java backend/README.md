# Creative Bible Java Backend

This is a Spring Boot backend and static web frontend for the Creative Bible app.

## Prerequisites
- Java 17+
- Maven
- MongoDB Atlas (or compatible MongoDB instance)

## Setup
1. Clone this repository.
2. Copy `src/main/resources/application.properties` to `src/main/resources/application-local.properties` and set your MongoDB URI and database name:

```
spring.data.mongodb.uri=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/creative-bible?retryWrites=true&w=majority
spring.data.mongodb.database=creative-bible
server.port=8080
```

**Important:** Never commit real credentials to GitHub. The default `application.properties` contains a placeholder.

## Run locally

```bash
mvn package
java -jar target/creative-bible-java-backend-1.0.0.jar
```

Or during development:

```bash
mvn spring-boot:run
```

Then open [http://localhost:8080/index.html](http://localhost:8080/index.html)

## API Endpoints
- `GET /api/records` - list records
- `POST /api/records` - create or update a single record
- `POST /api/records/bulk` - create or update multiple records
- `DELETE /api/records` - delete a record by `type`, `phase_index`, `section_index`

## Data storage
- Uses MongoDB Atlas (cloud) or any MongoDB instance.

## Static Frontend
- All static files are in `src/main/resources/static`.
-- Main entrypoint: `index.html`

## Security
- Do NOT commit real MongoDB credentials.
- Use environment variables or a local-only properties file for secrets.

## License
MIT
