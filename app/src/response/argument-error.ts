export class InvalidParameterError extends Error {
	json: Object;
	constructor(public code: number, public message: string) {
		super(message);
		this.code = code;
		this.json = { error: message };
	}
}
