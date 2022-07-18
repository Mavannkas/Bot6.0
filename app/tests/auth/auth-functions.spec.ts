import { getAuthorizationHeader, getAuthorizationRequest, getRefreshRequest } from '../../src/auth/auth-functions';

describe('auth-functions test cases', () => {
	it('Should get authorization header', () => {
		//Given
		const credentials = {
			clientID: 'clientID',
			secret: 'secret',
		};
		const expectedResult = 'Basic Y2xpZW50SUQ6c2VjcmV0';

		//When
		const result = getAuthorizationHeader(credentials);

		//Should
		expect(result).toEqual(expectedResult);
	});

	it('Should get authorization request', () => {
		//Given
		const code = 'code';
		const url = 'example.com';
		const params = {
			clientID: 'clientID',
			secret: 'secret',
		};
		const expectedResult = {
			url: '/oauth2/token/',
			method: 'POST',
			baseURL: `https://${url}/`,
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic Y2xpZW50SUQ6c2VjcmV0',
			},
			data: 'grant_type=authorization_code&client_id=clientID&code=code&redirect_uri=https%3A%2F%2Fgoogle.com%2F',
		};

		//When
		const result = getAuthorizationRequest(code, url, params);

		//Should
		expect(result).toEqual(expectedResult);
	});

	it('Should get refresh request', () => {
		//Given
		const refreshRequest = 'refreshRequest';
		const url = 'example.com';
		const params = {
			clientID: 'clientID',
			secret: 'secret',
		};
		const expectedResult = {
			url: '/oauth2/token/',
			method: 'POST',
			baseURL: `https://${url}/`,
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic Y2xpZW50SUQ6c2VjcmV0',
			},
			data: 'grant_type=refresh_token&client_id=clientID&refresh_token=refreshRequest',
		};

		//When
		const result = getRefreshRequest(refreshRequest, url, params);

		//Should
		expect(result).toEqual(expectedResult);
	});
});
