import {
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
	User,
	ProjectionExpresionParams,
} from './model/user';

type SendCommandInput = DeleteItemCommand | UpdateItemCommand | GetItemCommand;

export interface DatabaseClientConstructor {
	new (client: DynamoDBClient, tableName: string, index?: string): DatabaseClientInterface;
}

export interface DatabaseClientInterface {
	get: (
		params: UserByEmailParams | UserByIDParams | UserByGeneratedKeyParams,
		projection: ProjectionExpresionParams
	) => Promise<User>;
	update: (params: UpdateUserParams) => Promise<User>;
	delete: (params: UserByEmailParams | UserByIDParams | UserByGeneratedKeyParams) => Promise<User>;
}

export abstract class DatabaseClient implements DatabaseClientInterface {
	constructor(private client: DynamoDBClient, private tableName: string, private index?: string) {}

	abstract get: (
		params: UserByEmailParams | UserByIDParams | UserByGeneratedKeyParams,
		projection: ProjectionExpresionParams
	) => Promise<User>;

	async update(params: UpdateUserParams): Promise<User> {
		const command = new UpdateItemCommand({
			TableName: this.tableName,
			Key: {
				Email: {
					S: params.Email,
				},
			},
			UpdateExpression: params.UpdateExpression,
			ExpressionAttributeValues: params.ExpressionAttributeValues,
			ExpressionAttributeNames: params.ExpressionAttributeNames,
			ReturnValues: 'ALL_NEW',
		});

		const result = await this.sendCommand<UpdateItemCommandOutput>(command);
		return result.Attributes as unknown as User;
	}

	async delete(params: UserByEmailParams | UserByIDParams | UserByGeneratedKeyParams): Promise<User> {
		const command = new DeleteItemCommand({
			TableName: this.tableName,
			Key: params,
			ReturnValues: 'ALL_OLD',
		});

		const result = await this.sendCommand<DeleteItemCommandOutput>(command);
		return result.Attributes as unknown as User;
	}

	protected async sendCommand<O>(command: SendCommandInput): Promise<O> {
		const result = await this.client.send(command);
		return result as unknown as O;
	}
}
