import { GetParameterCommandOutput } from '@aws-sdk/client-ssm';
import { APIGatewayEvent } from 'aws-lambda';
import { getAuthToken, getRefreshToken } from '../../src/auth/auth-tokens';
import axios from 'axios';
import { InvalidParameterError } from '../../src/response/argument-error';

const expectedResult = {
	data: {
		test: 'test',
	},
};

const deps = {
	awsServices: {
		ssmClient: {
			send: jest.fn(),
		},
	},
};

describe('auth-token test cases', () => {
	beforeEach(() => {
		axios.request = jest.fn(() => expectedResult as any);
		deps.awsServices.ssmClient.send = jest.fn(() => ({ Parameter: { Value: 'test' } } as any));
	});

	it('getRefreshToken Should return response', async () => {
		//Given

		const event: Partial<APIGatewayEvent> = {
			queryStringParameters: {
				refresh_token: 'refresh_token',
			},
		};
		//When
		const result = await getRefreshToken(deps)(event as APIGatewayEvent);

		//Should
		expect(result).toEqual({
			statusCode: 200,
			headers: {
				contentType: 'application/json',
			},
			body: JSON.stringify(expectedResult.data),
		});
	});

	it('getAuthToken Should return response', async () => {
		//Given

		const event: Partial<APIGatewayEvent> = {
			queryStringParameters: {
				code: 'code',
			},
		};
		//When
		const result = await getAuthToken(deps)(event as APIGatewayEvent);

		//Should
		expect(result).toEqual({
			statusCode: 200,
			headers: {
				contentType: 'application/json',
			},
			body: JSON.stringify(expectedResult.data),
		});
	});

	it('getAuthToken Should return error without code', async () => {
		//Given
		const event: Partial<APIGatewayEvent> = {};
		let thrownError;
		//When
		try {
			await getAuthToken(deps)(event as APIGatewayEvent);
		} catch (e: any) {
			thrownError = e;
		}

		//Should
		expect(thrownError).toBeInstanceOf(InvalidParameterError);
		expect(thrownError.message).toEqual('Missing code');
		expect(thrownError.code).toEqual(400);
	});

	it('getRefreshToken Should return error without code', async () => {
		//Given
		const event: Partial<APIGatewayEvent> = {};
		let thrownError;
		//When
		try {
			await getRefreshToken(deps)(event as APIGatewayEvent);
		} catch (e: any) {
			thrownError = e;
		}

		//Should
		expect(thrownError).toBeInstanceOf(InvalidParameterError);
		expect(thrownError.message).toEqual('Missing refresh_token');
		expect(thrownError.code).toEqual(400);
	});
});
