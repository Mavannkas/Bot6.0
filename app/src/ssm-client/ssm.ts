import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { ReponseError } from '../response/lambda-error';

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
			console.log(commandOutput);
			if (!commandOutput?.Parameter?.Value) {
				throw new ReponseError(500, `Parameter ${command.input.Name} not found`);
			}

			return commandOutput.Parameter.Value;
		} catch (err: any) {
			console.log(err);
			console.error('sendCommand ' + err.message);
			throw err;
		}
	}
}
