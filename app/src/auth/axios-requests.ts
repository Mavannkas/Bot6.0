import axios, { AxiosResponse } from 'axios';
import { transformObjectToWWWForm } from '../helpers/transform-to-www-form';
import { ReponseError } from '../response/lambda-error';
import { getAuthorizationHeader } from './auth-functions';
import { CognitoCredentials } from './auth-interfaces/credits-interface';

export const authorizationRequest = async (
	code: string,
	url: string,
	params: CognitoCredentials
): Promise<AxiosResponse> => {
	const body = {
		url: '/oauth2/token/',
		method: 'POST',
		baseURL: `https://${url}/`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Authorization: getAuthorizationHeader(params),
		},
		data: transformObjectToWWWForm({
			grant_type: 'authorization_code',
			client_id: params.clientID,
			code,
			redirect_uri: 'https://google.com/',
		}),
	};

	try {
		return await axios.request(body);
	} catch (err) {
		if (err?.response?.data?.error) {
			throw new ReponseError(401, {
				message: 'Invalid code',
			});
		}
	}
};
