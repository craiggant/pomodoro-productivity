import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

type TTokenAsCookieParams = {
	email: string;
	response: NextResponse;
};

// Note: this is not a pure function, and will mutate the response object
export const setTokenAsCookie = async ({
	email,
	response
}: TTokenAsCookieParams) => {
	// create token
	const secret = new TextEncoder().encode(process.env.JWT_SECRET);

	const jwt = await new SignJWT({ 'urn:example:claim': true })
		.setProtectedHeader({ alg: process.env.JWT_ALG! })
		.setIssuedAt()
		.setIssuer('urn:example:issuer')
		.setAudience('urn:example:audience')
		.setExpirationTime('2h')
		.sign(secret);

	// set token in cookie
	response.cookies.set({
		name: 'token',
		value: jwt,
		maxAge: 8 * 60 * 60
	});

	return response;
};

export const verifyToken = async (token: string) => {
	const secret = new TextEncoder().encode(process.env.JWT_SECRET);

	try {
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch (err) {
		console.error(err);
		throw new Error('Invalid token');
	}
};
