import { sendRequest } from '../../src/auth/axios-requests';
import axios from 'axios';

describe('axios requests test cases', () => {
	it('Send request should call axios', () => {
		//Given
		axios.request = jest.fn();
		//When
		sendRequest({});

		//Then
		expect(axios.request).toHaveBeenCalled();
	});
});
