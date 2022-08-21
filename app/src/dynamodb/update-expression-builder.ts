import { User, UserI, UserType } from './model/user';

enum Expression {
	SET = 'SET',
	REMOVE = 'REMOVE',
	ADD = 'ADD',
	DELETE = 'DELETE',
}

interface AttributeValue {
	type: UserType;
	attribut: User;
	value: Exclude<UserI[User], undefined>;
}

interface UpdateParams {
	ExpressionAttributeNames: Record<string, Record<string, string>>;
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
	private attributeValues: Record<string, AttributeValue> = {};

	static init(): UpdateExpressionBuilder {
		return new UpdateExpressionBuilder();
	}

	set(attribut: User, value: UserI[User]): UpdateExpressionBuilder {
		this.addExpression(Expression.SET, attribut, value);
		return this;
	}

	remove(attribut: User, value: UserI[User]): UpdateExpressionBuilder {
		this.addExpression(Expression.REMOVE, attribut, value);
		return this;
	}

	add(attribut: User, value: UserI[User]): UpdateExpressionBuilder {
		this.addExpression(Expression.ADD, attribut, value);
		return this;
	}

	delete(attribut: User, value: UserI[User]): UpdateExpressionBuilder {
		this.addExpression(Expression.DELETE, attribut, value);
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

	private buildExpressionAttributeNames(): Record<string, Record<string, string>> {
		return Object.entries(this.attributeValues).reduce((acc, [key, value]) => {
			acc[key] = { [value.type]: value.attribut };
			return acc;
		}, {} as Record<string, Record<string, string>>);
	}

	private addExpression(expression: Expression, attribut: User, value: UserI[User]) {
		if (!value) {
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
