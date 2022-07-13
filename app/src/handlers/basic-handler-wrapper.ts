import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Handler } from '../interfaces/default-handler';
import { FormatResponse } from '../response/format-response';

export const basicHandler =
	(handler: Handler) =>
	async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
		try {
			return await handler(event);
		} catch (err) {
			console.error(err.message);
			return FormatResponse.start()
				.code(err?.response?.status ?? err.code ?? 400)
				.json(err?.json ?? err?.response?.data)
				.build();
		}
	};
