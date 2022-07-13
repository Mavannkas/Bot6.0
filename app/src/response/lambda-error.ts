export class ReponseError extends Error {
	code: number;
	json: Object;
	constructor(code: number, json: Object) {
		super('ResponseError');
		this.code = code;
		this.json = json;
	}
}
