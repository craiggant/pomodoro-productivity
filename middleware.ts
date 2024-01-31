import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from './lib/helper/auth';

const openPaths = ['/api/auth/signin', '/api/auth/signup'];

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (openPaths.includes(pathname)) return NextResponse.next();

	const token = req.cookies.get('token')?.value;

	if (!token) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await verifyToken(token);
	} catch (err) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/api/:path*'
};
