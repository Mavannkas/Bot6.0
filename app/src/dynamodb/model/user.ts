export enum User {
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

export interface UserI {
	[User.Email]: string;
	[User.ID]: string;
	[User.CreatedAt]: string;
	[User.GeneratedKey]?: string;
	[User.KeyUses]?: number;
	[User.KeyExpiry]?: string;
	[User.LicenceExpiry]?: string;
}

export type UserByID = Pick<UserI, User.ID | User.Email | User.LicenceExpiry>;
export type UserKey = Pick<UserI, User.GeneratedKey | User.KeyUses | User.KeyExpiry>;
export type UserByEmailParams = Pick<UserI, User.Email>;
export type UserByIDParams = Pick<UserI, User.ID>;
export type UserByGeneratedKeyParams = Pick<UserI, User.GeneratedKey>;
export type UpdateUserParams = Partial<UserI> & Pick<UserI, User.Email>;
export type ProjectionExpresionParams = Array<keyof UserI>;
