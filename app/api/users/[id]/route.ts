import { NextRequest, NextResponse } from 'next/server';
import { UsersRepository } from '@/lib/controllers/usersRepository';

type TRouteParams = {
	params: {
		id: string;
	};
};

export async function GET(request: NextRequest, { params }: TRouteParams) {
	const { id } = params;

	try {
		const user = await UsersRepository.getUserByUniqueProperty({ id });

		if (!user)
			return NextResponse.json({ error: 'Not Found' }, { status: 404 });

		const { password, createdAt, updatedAt, ...rest } = user;

		return NextResponse.json({ user: rest }, { status: 200 });
	} catch (e) {
		console.error(e);

		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
