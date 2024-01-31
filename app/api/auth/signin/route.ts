// packages
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import { setTokenAsCookie } from '@/lib/helper/auth';

// utils
import { UsersRepository } from '@/lib/controllers/usersRepository';

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	// check for valid email and password
	if (!email || !password || !isEmail(email))
		return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

	try {
		// check if user exists
		const user = await UsersRepository.getUserByUniqueProperty({ email });

		if (!user)
			return NextResponse.json({ message: 'Not Found' }, { status: 404 });

		// check if password is correct
		if (!bcrypt.compareSync(password, user.password))
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 }
			);

		const userInfo = {
			id: user.id,
			email: user.email
		};

		const response = NextResponse.json(
			{ user: userInfo, message: 'success' },
			{ status: 201 }
		);

		// set a new token in cookie
		await setTokenAsCookie({ email, response });

		return response;
	} catch (e) {
		console.error(e);

		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
