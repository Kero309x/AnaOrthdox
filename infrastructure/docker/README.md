# Infrastructure Docker Guidelines

## Development Stack

- **PostgreSQL 18.x Alpine:** Port 5432 with persistent volume `ana_orthodox_postgres_data`.
- **Redis 7.x Alpine:** Port 6379 with persistent volume `ana_orthodox_redis_data`.

## Commands

```bash
# Start all infrastructure services in the background
docker compose up -d

# Check service logs
docker compose logs -f

# Stop services
docker compose down
```
