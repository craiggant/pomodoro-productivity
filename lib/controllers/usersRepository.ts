import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

type TUniqueUserProperties = {
	id?: string;
	email?: string;
};

type TUniqueUserKeys = keyof TUniqueUserProperties & keyof User;

type TUniqueUserProperty = {
	[K in TUniqueUserKeys]: TUniqueUserProperties[K];
};

export class UsersRepository {
	constructor() {}

	static async getUserByUniqueProperty(property: TUniqueUserProperty) {
		return await prisma.user.findUnique({
			where: property
		});
	}

	static async createUser(email: string, password: string) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		return await prisma.user.create({
			data: {
				email,
				password: hashedPassword
			}
		});
	}
}
