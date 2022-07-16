import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

export class SsmClient {
	private client: SSMClient;
	constructor(client: SSMClient) {
		this.client = client;
	}

	async getParameter(path: string, encrypt: boolean = false): Promise<string> {
		const command = new GetParameterCommand({
			Name: path,
			WithDecryption: encrypt,
		});

		return await this.sendCommand(command);
	}

	private async sendCommand(command: GetParameterCommand): Promise<string> {
		try {
			const commandOutput = await this.client.send(command);
			return commandOutput?.Parameter?.Value;
		} catch (err) {
			console.log(err);
			console.error('sendCommand ' + err.message);
			throw err;
		}
	}
}
