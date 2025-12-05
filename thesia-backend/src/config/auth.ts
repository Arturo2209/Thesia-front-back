export const JWT_SECRET = process.env.JWT_SECRET || 'thesia_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export const JWT_ISSUER = process.env.JWT_ISSUER || 'thesia-backend';
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'thesia-frontend';

export type JwtUserPayload = {
	id: number;
	email: string;
	name: string;
	role: string;
	carrera?: string;
	codigo?: string;
};
