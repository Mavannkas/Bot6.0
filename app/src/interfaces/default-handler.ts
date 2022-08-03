import { APIGatewayEvent, APIGatewayProxyResult, Callback, Context, PreSignUpTriggerEvent } from 'aws-lambda';
import { Deps } from './deps';

export type LambdaEvent = APIGatewayEvent | PreSignUpTriggerEvent;
export type LambdaResult = Promise<APIGatewayProxyResult | unknown>;

export type Handler = (deps: Deps) => (event: LambdaEvent, context?: Context, callback?: Callback<any>) => LambdaResult;
