import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Handler } from '../interfaces/default-handler';
import { Deps } from '../interfaces/deps';
import { FormatResponse } from '../response/format-response';

export const basicHandler =
	(deps: Deps) =>
	(handler: Handler) =>
	async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
		try {
			return await handler(deps)(event);
		} catch (err) {
			return processError(err);
		}
	};

const getErrorCode = (err): number => err?.response?.status ?? err.code ?? 500;

const getErrorBody = (err): Response => err?.json ?? err?.response?.data;

const processError = (err): Promise<APIGatewayProxyResult> => {
	const code = getErrorCode(err);
	const body = getErrorBody(err);
	console.error(err.message);
	return FormatResponse.create().code(code).json(body).build();
};
