export enum UserAttribute {
	Email = 'Email',
	ID = 'ID',
	CreatedAt = 'CreatedAt',
	GeneratedKey = 'GeneratedKey',
	KeyUses = 'KeyUses',
	KeyExpiry = 'KeyExpiry',
	LicenceExpiry = 'LicenceExpiry',
}

export enum UserType {
	Email = 'S',
	ID = 'S',
	CreatedAt = 'S',
	GeneratedKey = 'S',
	KeyUses = 'N',
	KeyExpiry = 'S',
	LicenceExpiry = 'S',
}

export interface User {
	[UserAttribute.Email]: string;
	[UserAttribute.ID]: string;
	[UserAttribute.CreatedAt]: string;
	[UserAttribute.GeneratedKey]?: string;
	[UserAttribute.KeyUses]?: number;
	[UserAttribute.KeyExpiry]?: string;
	[UserAttribute.LicenceExpiry]?: string;
}

export type UserByID = Pick<User, UserAttribute.ID | UserAttribute.Email | UserAttribute.LicenceExpiry>;
export type UserKey = Pick<User, UserAttribute.GeneratedKey | UserAttribute.KeyUses | UserAttribute.KeyExpiry>;
export type UserByEmailParams = Pick<User, UserAttribute.Email>;
export type UserByIDParams = Pick<User, UserAttribute.ID>;
export type UserByGeneratedKeyParams = Pick<User, UserAttribute.GeneratedKey>;
export type UpdateUserParams = Partial<User> & Pick<User, UserAttribute.Email>;
export type ProjectionExpresionParams = Array<keyof User>;
