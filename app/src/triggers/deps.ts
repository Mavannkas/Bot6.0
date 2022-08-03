import { Deps } from '../interfaces/deps';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export interface TriggerDeps extends Deps {
	cognitoService: {
		cognitoCLient: CognitoIdentityServiceProvider;
	};
}

export const resolveTriggerDeps = (): TriggerDeps => {
	return {
		cognitoService: {
			cognitoCLient: new CognitoIdentityServiceProvider({
				region: process.env.AWS_REGION,
			}),
		},
	};
};
