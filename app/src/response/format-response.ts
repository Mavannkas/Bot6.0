import { APIGatewayProxyResult } from 'aws-lambda';
import { Response } from '../interfaces/standard-object';

export class FormatResponse {
	private statusCode: number;
	private body: Response;

	constructor() {
		this.init();
	}

	static start(): FormatResponse {
		return new FormatResponse();
	}

	code(statusCode: number): FormatResponse {
		this.statusCode = statusCode;
		return this;
	}

	json(data: Response): FormatResponse {
		this.body = data;
		return this;
	}

	async build(): Promise<APIGatewayProxyResult> {
		const result: APIGatewayProxyResult = {
			statusCode: this.statusCode,
			body: JSON.stringify(this.body),
		};

		return result;
	}

	private init() {
		this.body = undefined;
		this.statusCode = undefined;
	}
}
