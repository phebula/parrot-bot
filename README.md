# quacker-bot

Discord bot for Quackers and friends

See `bin/update`

Also need mongodb: `sudo apt-get install mongodb`

To start on server:

	mongod --auth --port=27017 --dbpath=.data &
	node js/index.js &
	disown -h
	disown <PIDs from above>
