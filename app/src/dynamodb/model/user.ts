export interface User {
	Email: string;
	ID: string;
	CreatedAt: string;
	GeneratedKey?: string;
	KeyUses?: number;
	KeyExpiry?: string;
	LicenceExpiry?: string;
}

export type UserByID = Pick<User, 'ID' | 'Email' | 'LicenceExpiry'>;
export type UserKey = Pick<User, 'GeneratedKey' | 'KeyUses' | 'KeyExpiry'>;
export type UserByEmailParams = Pick<User, 'Email'>;
export type UserByIDParams = Pick<User, 'ID'>;
export type UserByGeneratedKeyParams = Pick<User, 'GeneratedKey'>;
export type UpdateUserParams = Partial<User> & Pick<User, 'Email'>;
export type ProjectionExpresionParams = Array<keyof User>;
