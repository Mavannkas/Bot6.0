import { PreSignUpTriggerEvent } from 'aws-lambda';
import { Handler } from '../interfaces/default-handler';
import { Deps } from '../interfaces/deps';
import { TriggerDeps } from './deps';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

type LinkUsersParams = {
	ProviderName: string;
	ProviderAttributeValue: string;
	UserAttributeValue: string | undefined;
	UserPoolId: string;
};

const knownProviderNames: Record<string, string> = {
	google: 'Google',
};

const getProviderName = async (userPoolId: string, providerName: string, cognito: CognitoIdentityServiceProvider) => {
	if (knownProviderNames[providerName]) {
		return knownProviderNames[providerName];
	}

	const { Providers } = await cognito.listIdentityProviders({ UserPoolId: userPoolId }).promise();
	for (const provider of Providers) {
		if (provider.ProviderName?.toLowerCase() === providerName.toLowerCase()) {
			return provider.ProviderName;
		}
	}
};

const mergeUsers = async (event: PreSignUpTriggerEvent, deps: TriggerDeps): Promise<boolean> => {
	const { userPoolId, userName } = event;
	const { email } = event.request.userAttributes;
	const { cognitoCLient: cognito } = deps.cognitoService;
	const [provider, ...providerValues] = userName.split('_');
	const providerValue = providerValues.join('_');

	if (!(provider.length > 0 && providerValue.length > 0)) {
		return false;
	}

	const { Users } = await cognito
		.listUsers({
			UserPoolId: userPoolId,
			AttributesToGet: ['email'],
			Filter: `email = "${email}"`,
			Limit: 1,
		})
		.promise();
	console.log('Users', Users);
	const providerName = await getProviderName(userPoolId, provider, cognito);
	console.log('providerName', providerName);

	if (!providerName || !Users?.length) {
		return false;
	}

	const user = Users[0];

	await linkUsers(cognito, {
		ProviderName: providerName,
		ProviderAttributeValue: providerValue,
		UserAttributeValue: user.Username,
		UserPoolId: userPoolId,
	});

	return true;
};

const linkUsers = async (cognito: CognitoIdentityServiceProvider, params: LinkUsersParams) => {
	const { ProviderAttributeValue, ProviderName, UserAttributeValue, UserPoolId } = params;
	console.log('Params', params);
	await cognito
		.adminLinkProviderForUser({
			UserPoolId,
			DestinationUser: {
				ProviderName: 'Cognito',
				ProviderAttributeValue: UserAttributeValue,
			},
			SourceUser: {
				ProviderName,
				ProviderAttributeName: 'Cognito_Subject',
				ProviderAttributeValue,
			},
		})
		.promise();
};

export const preSignUpTrigger: Handler =
	(deps: Deps) =>
	async (event, _, callback): Promise<unknown> => {
		try {
			const innerEvent = event as PreSignUpTriggerEvent;
			console.log(JSON.stringify(innerEvent));
			const innerDeps = deps as TriggerDeps;
			const result = await mergeUsers(innerEvent, innerDeps);
			console.log('result', result);

			return !result ? callback!(null, innerEvent) : undefined;
		} catch (err) {
			console.error(err);
			callback!(err as Error);
		}
	};
