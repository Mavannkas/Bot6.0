import {
	AttributeValue,
	DeleteItemCommand,
	DeleteItemCommandOutput,
	DynamoDBClient,
	GetItemCommand,
	QueryCommand,
	UpdateItemCommand,
	UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import {
	UserByEmailParams,
	UserByGeneratedKeyParams,
	UserByIDParams,
	UpdateUserParams,
	UserAttribute,
	ProjectionExpresionParams,
} from './model/user';
import { UpdateParams } from './update-expression-builder';

type SendCommandInput = DeleteItemCommand | UpdateItemCommand | GetItemCommand;

export interface DatabaseClientConstructor {
	new (client: DynamoDBClient, tableName: string, index?: string): DatabaseClientInterface;
}

export interface DatabaseClientInterface {
	get: (
		params: UserByEmailParams | UserByIDParams | UserByGeneratedKeyParams,
		projection: ProjectionExpresionParams
	) => Promise<UserAttribute>;
	update: (email: string, params: UpdateParams) => Promise<UserAttribute>;
	delete: (params: UserByEmailParams | UserByIDParams | UserByGeneratedKeyParams) => Promise<UserAttribute>;
}

export abstract class DatabaseClient implements DatabaseClientInterface {
	constructor(private client: DynamoDBClient, private tableName: string, private index?: string) {}

	abstract get: (
		params: UserByEmailParams | UserByIDParams | UserByGeneratedKeyParams,
		projection: ProjectionExpresionParams
	) => Promise<UserAttribute>;

	async update(email: string, params: UpdateParams): Promise<UserAttribute> {
		const command = new UpdateItemCommand({
			TableName: this.tableName,
			Key: {
				Email: {
					S: email,
				},
			},
			UpdateExpression: params.UpdateExpression,
			ExpressionAttributeValues: params.ExpressionAttributeNames as Record<string, AttributeValue>,
			ConditionExpression: params.ConditionExpression,
			ReturnValues: 'ALL_NEW',
		});

		const result = await this.sendCommand<UpdateItemCommandOutput>(command);
		return result.Attributes as unknown as UserAttribute;
	}

	async delete(params: UserByEmailParams | UserByIDParams | UserByGeneratedKeyParams): Promise<UserAttribute> {
		const key: Record<string, AttributeValue> = {};
		if ('Email' in params) {
			key.Email = {
				S: params.Email,
			};
		}
		if ('ID' in params) {
			key.ID = {
				S: params.ID,
			};
		}

		if ('GeneratedKey' in params && params.GeneratedKey) {
			key.GeneratedKey = {
				S: params.GeneratedKey,
			};
		}

		const command = new DeleteItemCommand({
			TableName: this.tableName,
			Key: key,
			ReturnValues: 'ALL_OLD',
		});

		const result = await this.sendCommand<DeleteItemCommandOutput>(command);
		return result.Attributes as unknown as UserAttribute;
	}

	protected async sendCommand<O>(command: SendCommandInput): Promise<O> {
		const result = await this.client.send(command);
		return result as unknown as O;
	}
}
