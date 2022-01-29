# parrot-bot

Discord bot for quotes 'n' stuff

## Development/deployment

Any environment needs a `.env` file, which can be copied from
`.env.example` and edited with the appropriate fields. From
here, `docker-compose` manages running the bot.

You may also want to install a systemd service to allow the bot
to start when the system starts. Run `./install_service`.

For development, use

	docker-compose up -d --build

This will rebuild the image and get everything running, with the
database in a docker volume named `parrot-bot_database-dat_`.

For production, use

	docker-compose -f docker-compose.production.yml up -d --build

This will rebuild the image and get everything running in
production mode, meaning the bot will register commands more
permanently, and database data will persist and live in
`/var/lib/parrot-bot`.

## Data backups

There are two tools, `export_backup` and `import_backup`, which
handle getting data in/out of the database.

Before using these, you need an instance of the bot up and
running - see the `docker-compose` instructions below, noting
`.env` must exist for these too!

`export_backup` will write a JSON document to
`.data-backup-<DATE_AND_TIME>.json` and symlink
`.data-backup.json` to that (i.e. the most recent). Note that
the resultant file contains some unwanted output (first and
last lines) which should be trimmed.

`import_backup` takes a filename (but defaults to
`.data-backup.json`) and sticks stuff in the database.
