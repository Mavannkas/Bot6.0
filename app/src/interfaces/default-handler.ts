import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export type Handler = (event: APIGatewayEvent) => Promise<APIGatewayProxyResult>;
