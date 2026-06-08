# flx-images

Tiny test applications for the `flx` GitOps cluster.

Published images:

- `ghcr.io/deadlinecode/web-1:1.0.0`
- `ghcr.io/deadlinecode/web-2:1.0.0`
- `ghcr.io/deadlinecode/api:1.0.0`

## API endpoints

- `/` basic JSON status
- `/healthz` health check
- `/db` verifies connectivity to Postgres using `DATABASE_URL`
