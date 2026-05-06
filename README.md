# VUL Shopping Mall

MVP shopping mall for vulnerability diagnosis practice.

## Development

Run both the React frontend and Spring Boot API from the repository root:

```bash
./scripts/dev.sh
```

The script clears known non-default development ports, chooses available frontend/backend ports, installs frontend dependencies if needed, and starts both servers.
By default it returns your terminal after both servers pass readiness checks.

Stop the local servers:

```bash
./scripts/dev.sh stop
```

Run in foreground mode:

```bash
./scripts/dev.sh foreground
```

Default project ports:

- Frontend: `3100`
- Backend API: `8100`

## Docker Local Diagnosis

Run the local diagnosis stack with non-default ports:

```bash
docker compose -f docker-compose.local.yml up --build
```

Services:

- Frontend: `http://localhost:3100`
- Backend API: `http://localhost:8100`
- PostgreSQL: `localhost:15432`
- Redis: `localhost:16379`
