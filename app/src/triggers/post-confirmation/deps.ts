import { Deps } from '../../interfaces/deps';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export interface DynamoDBDeps extends Deps {
	userService: {
		dynamoDBClient: CognitoIdentityServiceProvider;
	};
}

export const resolveDynamoDBDeps = (): DynamoDBDeps => {
	return {
		cognitoService: {
			cognitoCLient: new CognitoIdentityServiceProvider({
				region: process.env.AWS_REGION,
			}),
		},
	};
};
