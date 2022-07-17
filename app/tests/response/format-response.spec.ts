import { APIGatewayProxyResult } from 'aws-lambda';
import { InvalidParameterError } from '../../src/response/argument-error';
import { FormatResponse } from '../../src/response/format-response';

const BASIC_RESPONSE: APIGatewayProxyResult = {
	statusCode: -1,
	headers: {
		contentType: 'application/json',
	},
	body: '',
};

describe('FormatResponse test cases', () => {
	it('should return new FormatResponse Instance', () => {
		//When
		const formatResponse = FormatResponse.create();
		//Should
		expect(formatResponse).toBeInstanceOf(FormatResponse);
	});

	it('should create http 500 response without body', async () => {
		//Given
		const response = await FormatResponse.create().build();
		//When
		const expectedResult = Object.assign({}, BASIC_RESPONSE, {
			statusCode: 500,
			body: '{}',
		});
		//Should
		expect(response).toEqual(expectedResult);
	});

	it('Should create http 200 response with body', async () => {
		//Given
		const response = await FormatResponse.create().code(200).json({ ala: 123 }).build();
		//When
		const expectedResult = Object.assign({}, BASIC_RESPONSE, {
			statusCode: 200,
			body: JSON.stringify({ ala: 123 }),
		});
		//Should
		expect(response).toEqual(expectedResult);
	});

	it('Should throw error with invalid status code', async () => {
		//Given
		const formatResponse = FormatResponse.create();
		let thrownError;
		//When
		try {
			formatResponse.code(99).build();
		} catch (e: any) {
			thrownError = e;
		}
		//Should
		expect(thrownError).toBeInstanceOf(InvalidParameterError);
		expect(thrownError.message).toEqual('Status code must be between 100 and 599');
	});
});
