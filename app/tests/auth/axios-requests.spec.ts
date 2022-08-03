import { sendRequest } from '../../src/auth/axios-requests';
import axios from 'axios';
import { ReponseError } from '../../src/response/lambda-error';

describe('axios requests test cases', () => {
	it('Send request should call axios', () => {
		//Given
		axios.request = jest.fn();
		//When
		sendRequest({});

		//Then
		expect(axios.request).toHaveBeenCalled();
	});

	it('Send request catch error', async () => {
		//Given
		axios.request = jest.fn().mockRejectedValue(new Error('error'));
		let thrownError;
		//When
		try {
			await sendRequest({});
		} catch (err) {
			thrownError = err;
		}

		//Then
		expect(thrownError).toBeInstanceOf(Error);
	});

	it('Send request should ReponseError error when axios fails', async () => {
		//Given
		axios.request = jest.fn(() => {
			throw { response: { data: { error: 'invalid_grant' } } };
		});
		let thrownError;
		//When
		try {
			await sendRequest({});
		} catch (err: any) {
			thrownError = err;
		}

		//Then
		expect(thrownError).toBeInstanceOf(ReponseError);
		expect(thrownError.code).toEqual(401);
		expect(thrownError.json).toEqual({ message: 'Code expired' });
	});
});
