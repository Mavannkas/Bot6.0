import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Deps } from './deps';

export type Handler = (deps: Deps) => (event: APIGatewayEvent) => Promise<APIGatewayProxyResult>;
