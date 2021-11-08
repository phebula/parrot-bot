import { Collection, Db, MongoClient } from "mongodb"
import assert = require("assert")
import { Snowflake } from "discord-api-types"
import { User } from "discord.js"
import { Quote } from "./Quote"

export function connect(onConnected: (database: DatabaseInterface) => void) {
	const url = process.env.DB_URL

	if (url === undefined)
		throw "Expected DB_URL"

	const client = new MongoClient(url, { useUnifiedTopology: true })

	// Use connect method to connect to the server
	client.connect(function(err) {
		assert.strictEqual(null, err, "Connection to database failed")
		console.log('Connected to database')

		const db = client.db(process.env.DB_NAME)
		const quotes = db.collection<Quote>('quotes')

		onConnected({
			addQuote: async (quoter, multiQuoteParts) => {
				const qc = quotes.find().sort({id:-1}).limit(1)
				const quote: Quote = {
					id: (await qc.hasNext() ? (await qc.next() as Quote).id : 0) + 1,
					quoter: quoter.id,
					multiQuoteParts: multiQuoteParts.map(({ user, content }) => { return { user: user.id, content: content } })
				}

				await quotes.insertOne(quote)

				return quote.id
			},
			getRandomQuote: async () => {
				return quotes.aggregate([{ "$sample": { size: 1 } }]).next()
			},
			getQuoteById: async (id) => {
				return quotes.findOne({ id: id })
			},
			getQuoteByUser: async (user) => {
				return quotes.aggregate([
					{ "$match": { 
						"multiQuoteParts": { "$elemMatch": {
							"user": user.id
						} }
					} },
					{ "$sample": { size: 1 } }
				]).next()
			},
			removeQuoteById: async (id) => {
				await quotes.deleteOne({ id: id })
			}
		})
	})
}

export type DatabaseInterface = {
	addQuote: (quoter: User, multiQuoteParts: { user: User, content: string }[]) => Promise<number>,
	getRandomQuote: () => Promise<Quote | null>,
	getQuoteById: (id: number) => Promise<Quote | null>,
	getQuoteByUser: (user: User) => Promise<Quote | null>,
	removeQuoteById: (id: number) => Promise<void>
}
