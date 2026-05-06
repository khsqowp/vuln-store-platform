# Deployment And Port Architecture

Last updated: 2026-05-05

## Local Diagnosis Direction

Local diagnosis should use Docker. Avoid default service ports for host and container bindings where practical.

Reserved local ports:

- React frontend: `3100`
- Spring Boot API: `8100`
- PostgreSQL: `15432`
- Redis: `16379`

Fallback development ports:

- Frontend: `3100`, `3003`, `3200`, `3301`, `3400`
- Backend: `8100`, `8003`, `8181`, `9000`, `9100`

Do not use default ports like `3000`, `5173`, `8080`, `5432`, or `6379` as first-class project ports.

## Docker Layout

Use `docker-compose.local.yml` for local diagnosis.

- `frontend`: Vite React dev server on `3100`
- `backend`: Spring Boot API on `8100`
- `postgres`: future persistent diagnosis DB on `15432`
- `redis`: future cache/session/race-condition support service on `16379`

The current API still uses H2 by default. PostgreSQL is included for the next implementation phase.

## AWS 3 Tier Target

Target architecture:

1. Presentation tier
   - CloudFront plus S3 for built React assets, or ALB plus containerized frontend if server rendering is later required.
2. Application tier
   - ECS/Fargate or EKS service running the Spring Boot API behind an internal or public ALB.
3. Data tier
   - RDS PostgreSQL, ElastiCache Redis, S3 for uploaded files, CloudWatch logs, and Secrets Manager/SSM Parameter Store.

Security and operations:

- Use separate public and private subnets.
- Keep application and data services out of public subnets.
- Use security groups with least-privilege ingress.
- Store secrets outside source code.
- Send API, admin, and audit logs to CloudWatch.
- Keep OWASP and 50-scenario mappings available as operational test metadata.
