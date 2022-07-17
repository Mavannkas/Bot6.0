import { AxiosRequestConfig } from 'axios';
import { transformObjectToWWWForm } from '../helpers/transform-to-www-form';
import { CognitoCredentials } from './auth-interfaces/credits-interface';

enum GrantType {
	AuthorizationCode = 'authorization_code',
	RefreshToken = 'refresh_token',
}

export const getAuthorizationHeader = (credentials: CognitoCredentials): string =>
	`Basic ${Buffer.from(`${credentials.clientID}:${credentials.secret}`).toString('base64')}`;

export const getAuthorizationRequest = (code: string, url: string, params: CognitoCredentials): AxiosRequestConfig => {
	const basicBody = getBasicBody(url, params);
	basicBody.data = transformObjectToWWWForm({
		grant_type: GrantType.AuthorizationCode,
		client_id: params.clientID,
		code,
		redirect_uri: 'https://google.com/',
	});
	return basicBody;
};

export const getRefreshRequest = (
	refreshRequest: string,
	url: string,
	params: CognitoCredentials
): AxiosRequestConfig => {
	const basicBody = getBasicBody(url, params);
	basicBody.data = transformObjectToWWWForm({
		grant_type: GrantType.RefreshToken,
		client_id: params.clientID,
		refresh_token: refreshRequest,
	});
	return basicBody;
};

const getBasicBody = (url: string, params: CognitoCredentials): AxiosRequestConfig => {
	return {
		url: '/oauth2/token/',
		method: 'POST',
		baseURL: `https://${url}/`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Authorization: getAuthorizationHeader(params),
		},
	};
};
