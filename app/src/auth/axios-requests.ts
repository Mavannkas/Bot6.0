import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ReponseError } from '../response/lambda-error';
import { getAuthorizationRequest, getRefreshRequest } from './auth-functions';
import { CognitoCredentials } from './auth-interfaces/credits-interface';

export type AuthRequest = (code: string, url: string, params: CognitoCredentials) => Promise<AxiosResponse>;

export const authorizationRequest: AuthRequest = async (
	code: string,
	url: string,
	params: CognitoCredentials
): Promise<AxiosResponse> => {
	const body = getAuthorizationRequest(code, url, params);
	return sendRequest(body);
};

export const refreshRequest: AuthRequest = async (
	refreshToken: string,
	url: string,
	params: CognitoCredentials
): Promise<AxiosResponse> => {
	const body: AxiosRequestConfig = getRefreshRequest(refreshToken, url, params);
	return sendRequest(body);
};

const sendRequest = async (body: AxiosRequestConfig): Promise<AxiosResponse> => {
	try {
		return await axios.request(body);
	} catch (err: any) {
		console.log(JSON.stringify(body));
		console.error(err?.response?.data);
		if (err?.response?.data?.error === 'invalid_grant') {
			throw new ReponseError(401, {
				message: 'Code expired',
			});
		}

		throw err;
	}
};
