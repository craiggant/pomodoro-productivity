import { NextRequest, NextResponse } from 'next/server';
import isEmail from 'validator/lib/isEmail';
import { UsersRepository } from '@/lib/controllers/usersRepository';

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	// check for valid email and password
	if (!email || !password || !isEmail(email))
		return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

	try {
		// check if user exists
		const existingUser = await UsersRepository.getUserByUniqueProperty({
			email
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: 'User already exists' },
				{ status: 409 }
			);
		}

		// create user
		const user = await UsersRepository.createUser({ email, password });

		return NextResponse.json({ user, message: 'success' }, { status: 201 });
	} catch (e) {
		console.error(e);

		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
