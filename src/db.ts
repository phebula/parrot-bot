import { Db, MongoClient } from "mongodb"
import assert = require("assert")
import { Snowflake } from "discord.js";

export function connect(onConnected: (database: Db) => void) {
	const client = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true });

	// Use connect method to connect to the server
	client.connect(function(err) {
		assert.strictEqual(null, err, "Connection to database failed");
		console.log('Connected to database');
	
		onConnected(client.db(process.env.DB_NAME));
	});
}

export type ServerConfig = {
	sid: Snowflake,
	prefix: string,
}

export const DEFAULT_CONFIG = {
	prefix: '!quackerbot '
}
