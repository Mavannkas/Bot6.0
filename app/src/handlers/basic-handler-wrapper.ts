import { APIGatewayEvent, APIGatewayProxyResult, Callback, Context, PreSignUpTriggerEvent } from 'aws-lambda';
import { Handler, LambdaEvent, LambdaResult } from '../interfaces/default-handler';
import { Deps } from '../interfaces/deps';
import { FormatResponse } from '../response/format-response';

export const basicHandler =
	(deps: Deps) =>
	(handler: Handler) =>
	async (event: LambdaEvent, context?: Context, callback?: Callback<any>): LambdaResult => {
		try {
			return await handler(deps)(event, context, callback);
		} catch (err) {
			return processError(err);
		}
	};

const getErrorCode = (err: any): number => err?.response?.status ?? err.code ?? 500;

const getErrorBody = (err: any): Response => err?.json ?? err?.response?.data;

const processError = (err: any): Promise<APIGatewayProxyResult> => {
	const code = getErrorCode(err);
	const body = getErrorBody(err);
	console.error(err.message);
	return FormatResponse.create().code(code).json(body).build();
};
