
export type Quote = QuoteV12

export type QuoteV12 = {
	quote_format: 'v1.2',
	id: number,
	quoter: string,
	quote_parts: {
		user: string,
		content: string,
	}[]
}
