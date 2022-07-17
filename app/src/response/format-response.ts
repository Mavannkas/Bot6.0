import { APIGatewayProxyResult } from 'aws-lambda';
import { Response } from '../interfaces/standard-object';
import { InvalidParameterError } from './argument-error';

export class FormatResponse {
	private statusCode!: number;
	private body!: Response;

	constructor() {
		this.init();
	}

	static create(): FormatResponse {
		return new FormatResponse();
	}

	code(statusCode: number): FormatResponse {
		if (statusCode < 100 || statusCode > 599) {
			throw new InvalidParameterError('Status code must be between 100 and 599');
		}

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
			headers: {
				contentType: 'application/json',
			},
			body: JSON.stringify(this.body),
		};
		console.log(JSON.stringify(result));
		return result;
	}

	private init() {
		this.body = {};
		this.statusCode = 500;
	}
}
