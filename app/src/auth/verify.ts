import { Handler } from '../interfaces/default-handler';
import { FormatResponse } from '../response/format-response';
import { authorizationRequest } from './axios-requests';
export const verifyAuthCode: Handler = async event => {
	const { code } = event.queryStringParameters ?? {};
	const response = await authorizationRequest(code, process.env.cognitoUrl, {
		clientID: process.env.cognitoClientID,
		secret: process.env.cognitoClientSecret,
	});

	return FormatResponse.start().code(200).json(response.data).build();
};
