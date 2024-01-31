import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

type TUniqueUserProperties = {
	id?: string;
	email?: string;
};

type TNewUserProperties = {
	email: string;
	password: string;
};

type TUniqueUserKeys = keyof TUniqueUserProperties & keyof User;

type TUniqueUserProperty = {
	[K in TUniqueUserKeys]: {
		[P in K]: TUniqueUserProperties[P];
	};
}[TUniqueUserKeys];

export class UsersRepository {
	constructor() {}

	static async getUserByUniqueProperty(property: TUniqueUserProperty) {
		return await prisma.user.findUnique({
			where: property
		});
	}

	static async createUser({ email, password }: TNewUserProperties) {
		const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS!));
		const hashedPassword = bcrypt.hashSync(password, salt);

		return await prisma.user.create({
			data: {
				email,
				password: hashedPassword
			}
		});
	}
}
