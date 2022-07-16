import { Handler } from '../interfaces/default-handler';
import { FormatResponse } from '../response/format-response';
import { SsmClient } from '../ssm-client/ssm';
import { CognitoCredentials } from './auth-interfaces/credits-interface';
import { authorizationRequest } from './axios-requests';
import { AuthDeps } from './deps';

const SSM_CLIENT_ID_PATH = process.env.CognitoClientIDPath;
const SSM_CLIENT_SECRET_PATH = process.env.CognitoClientSecretPath;
const COGNITO_URL = process.env.CognitoUrl;

export const verifyAuthCode: Handler = (deps: AuthDeps) => async event => {
	const { code } = event.queryStringParameters ?? {};
	const ssmClient = new SsmClient(deps.awsServices.ssmClient);

	const credentials = await getCognitoCredentials(ssmClient);

	const response = await authorizationRequest(code, COGNITO_URL, credentials);

	return FormatResponse.create().code(200).json(response.data).build();
};

const getCognitoCredentials = async (client: SsmClient): Promise<CognitoCredentials> => {
	const clientID = await client.getParameter(SSM_CLIENT_ID_PATH);
	const secret = await client.getParameter(SSM_CLIENT_SECRET_PATH, true);
	return { clientID, secret };
};
