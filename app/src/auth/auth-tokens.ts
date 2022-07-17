import { Handler } from '../interfaces/default-handler';
import { FormatResponse } from '../response/format-response';
import { SsmClient } from '../ssm-client/ssm';
import { CognitoCredentials } from './auth-interfaces/credits-interface';
import { authorizationRequest, AuthRequest, refreshRequest } from './axios-requests';
import { AuthDeps } from './deps';

const SSM_CLIENT_ID_PATH = process.env.CognitoClientIDPath;
const SSM_CLIENT_SECRET_PATH = process.env.CognitoClientSecretPath;
const COGNITO_URL = process.env.CognitoUrl;

export const getAuthToken: Handler = (deps: AuthDeps) => async event => {
	const { code } = event.queryStringParameters ?? {};

	return await getCognitoRespose(deps, code, authorizationRequest);
};

export const getRefreshToken: Handler = (deps: AuthDeps) => async event => {
	const { refresh_token: code } = event.queryStringParameters ?? {};

	return await getCognitoRespose(deps, code, refreshRequest);
};

const getCognitoRespose = async (deps: AuthDeps, code: string, callback: AuthRequest) => {
	const ssmClient = new SsmClient(deps.awsServices.ssmClient);
	console.log(SSM_CLIENT_ID_PATH);
	console.log(SSM_CLIENT_SECRET_PATH);
	const credentials = await getCognitoCredentials(ssmClient);

	const response = await callback(code, COGNITO_URL, credentials);

	return FormatResponse.create().code(200).json(response.data).build();
};

const getCognitoCredentials = async (client: SsmClient): Promise<CognitoCredentials> => {
	const clientID = await client.getParameter(SSM_CLIENT_ID_PATH);
	const secret = await client.getParameter(SSM_CLIENT_SECRET_PATH, true);
	return { clientID, secret };
};
