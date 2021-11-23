
export type Quote = QuoteV1_1

export type QuoteV1_1 = {
	quoteVersion: '1.1',
	id: number,
	quoter: string,
	multiQuoteParts: {
		user: string,
		content: string,
	}[]
}
