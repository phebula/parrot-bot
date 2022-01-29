# parrot-bot

Discord bot for quotes 'n' stuff

To start on server:

	mongod --auth --port=27017 --dbpath=.data &
	node js/index.js &
	disown -h
	disown <PIDs from above>
