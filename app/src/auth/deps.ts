import { SSMClient } from '@aws-sdk/client-ssm';
import { Deps } from '../interfaces/deps';

export interface AuthDeps extends Deps {
	awsServices: {
		ssmClient: SSMClient;
	};
}

export const resolveAuthDeps = (): AuthDeps => {
	return {
		awsServices: {
			ssmClient: new SSMClient({
				region: process.env.AWS_REGION,
			}),
		},
	};
};
