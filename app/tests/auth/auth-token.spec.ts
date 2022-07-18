import { getCognitoRespose } from "../../src/auth/auth-tokens";

describe('auth-token test cases', () => {
	it('getRefreshToken should call getCognitoRespose', () => {
        //Given
        getCognitoRespose = jest.fn();
        const deps = {
            awsServices: {
                ssmClient: {},
            },
        };
        const event = {
            queryStringParameters: {
                refresh_token: 'refresh_token',
            },
        };
        const expectedResult = {
            data: {},
        };

        //When
        const result = getRefreshToken(deps)(event);

        //Should
        expect(result).toEqual(expectedResult);
    }
    });
});
