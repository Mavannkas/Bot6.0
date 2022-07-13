import { CognitoCredentials } from './auth-interfaces/credits-interface';

export const getAuthorizationHeader = (credentials: CognitoCredentials): string =>
	`Basic ${Buffer.from(`${credentials.clientID}:${credentials.secret}`).toString('base64')}`;
