import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { ReponseError } from '../../src/response/lambda-error';
import { SsmClient } from '../../src/ssm-client/ssm';
const client: SSMClient = new SSMClient({});

describe('SSM Client Test Cases', () => {
	beforeEach(() => {
		client.send = jest.fn(
			() =>
				({
					Parameter: { Value: 'test' },
				} as any)
		);
	});

	it('should return parameter', async () => {
		const ssmClient = new SsmClient(client);
		const result = await ssmClient.getParameter('/test');
		expect(result).toBe('test');
	});

	it('should thow error when parameter is missing', async () => {
		//Given
		client.send = jest.fn();
		const ssmClient = new SsmClient(client);
		let thrownError;

		//When
		try {
			await ssmClient.getParameter('/test');
		} catch (err: any) {
			thrownError = err;
		}

		//Should
		expect(thrownError).toBeInstanceOf(ReponseError);
		expect(thrownError.json).toEqual(`Parameter /test not found`);
		expect(thrownError.code).toEqual(500);
	});
});
