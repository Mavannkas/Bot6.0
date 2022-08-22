import { AttributeValue, AttributeValueUpdate } from '@aws-sdk/client-dynamodb';
import { UserAttribute, User, UserType } from './model/user';

enum Expression {
	SET = 'SET',
	REMOVE = 'REMOVE',
	ADD = 'ADD',
	DELETE = 'DELETE',
}

interface AttributeValues {
	type: UserType;
	attribut: UserAttribute;
	value: Exclude<User[UserAttribute], undefined>;
}

export interface UpdateParams {
	ExpressionAttributeNames: Record<string, AttributeValue>;
	UpdateExpression: string;
	ConditionExpression?: string;
}

class UpdateExpressionBuilder {
	private updateExpressions: Record<Expression, string[]> = {
		[Expression.SET]: [],
		[Expression.REMOVE]: [],
		[Expression.ADD]: [],
		[Expression.DELETE]: [],
	};
	private expressionCount: number = 0;
	private attributeValues: Record<string, AttributeValues> = {};

	static init(): UpdateExpressionBuilder {
		return new UpdateExpressionBuilder();
	}

	set(attribut: UserAttribute, value: User[UserAttribute]): UpdateExpressionBuilder {
		this.addExpression(Expression.SET, attribut, value);
		return this;
	}

	remove(attribut: UserAttribute): UpdateExpressionBuilder {
		this.addExpression(Expression.REMOVE, attribut);
		return this;
	}

	build(): UpdateParams {
		return {
			UpdateExpression: this.buildUpdateExpression(),
			ExpressionAttributeNames: this.buildExpressionAttributeNames(),
			//TODO: add ConditionExpression
		};
	}

	private buildUpdateExpression(): string {
		return Object.entries(this.updateExpressions)
			.filter(([, values]) => values.length)
			.map(([expression, values]) => `${expression} ${values.join(', ')}`)
			.join(' ');
	}

	private buildExpressionAttributeNames(): Record<string, AttributeValue> {
		return Object.entries(this.attributeValues).reduce((acc, [key, value]) => {
			acc[key][value.type] = value.attribut;
			return acc;
		}, {} as Record<string, AttributeValue>);
	}

	private addExpression(expression: Expression, attribut: UserAttribute, value?: User[UserAttribute]) {
		if (!value) {
			this.updateExpressions[expression].push(`${attribut}`);
			return;
		}

		const newKey = this.getNextKey();
		this.updateExpressions[expression].push(`${attribut} = ${newKey}`);
		this.attributeValues[newKey] = { type: UserType[attribut], attribut, value };
	}

	private getNextKey(): string {
		this.expressionCount++;
		return `:val${this.expressionCount}`;
	}
}
