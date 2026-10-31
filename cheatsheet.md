# get table records

```bash
docker exec storit-db psql -U storit -d storit -c "SELECT * FROM playback_history;"
```

records seperated:

```bash
docker exec storit-db psql -U storit -d storit \ -x -c "SELECT * FROM playback_history;"
```

# get all tables in the database

```bash
docker exec storit-db psql -U storit -d storit -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
```

# run pgAdmin to see postgres visually locally

docker run -d \
 --name pgadmin4 \
 -p 9090:80 \
 -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
 -e PGADMIN_DEFAULT_PASSWORD=admin \
 dpage/pgadmin4

# Postgres data lives in a Docker named volume. Run these on the remote machine:

`docker volume ls docker volume inspect storit_postgres_data --format '{{ .Mountpoint }}'`

# The mountpoint is typically /var/lib/docker/volumes/storit_postgres_data/\_data. It's owned by root, so list it with:

`sudo ls -la /var/lib/docker/volumes/storit_postgres_data/\_data`

# To check how much space it uses and how much disk is free:

`sudo du -sh /var/lib/docker/volumes/storit_postgres_data/\_data df -h /`

# To confirm the mount from the container's side:

`docker inspect storit-db --format '{{ json .Mounts }}'`

#

`docker compose --profile observability up -d --build`

# From the VM, in the directory containing your Compose file, run:

`docker compose exec postgres sh -c 'exec psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'`

# At the psql prompt, use \dt to list tables, then inspect rows with a query such as:

`SELECT * FROM your_table LIMIT 20;`

# Use \q to exit. This works without publishing the database port because docker compose exec runs the database client inside the container.

# Get folders tree from current path:

`tree -I 'node_modules|.git|venv|build|dist' | pbcopy`

# get files with its content

`files-to-prompt . | pbcopy`
`files-to-prompt . --ignore 'node_modules' --ignore 'build' | pbcopy`
