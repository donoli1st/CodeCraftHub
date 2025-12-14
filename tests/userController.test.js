// Ensure required env vars exist before loading config/controller
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

jest.mock('../src/services/userService', () => ({
	isEmailTaken: jest.fn(),
	isUsernameTaken: jest.fn(),
	createUser: jest.fn(),
	findUserByEmail: jest.fn(),
}));

jest.mock('bcrypt', () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
	sign: jest.fn(),
}));

const userService = require('../src/services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerUser, loginUser } = require('../src/controllers/userController');

const createMockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

describe('userController - registerUser', () => {
	let next;

	beforeEach(() => {
		next = jest.fn();
		jest.clearAllMocks();
	});

	test('returns 400 via next when required fields are missing', async () => {
		const req = { body: { email: 'test@example.com' } }; // missing username/password
		const res = createMockRes();

		await registerUser(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		const error = next.mock.calls[0][0];
		expect(error.statusCode).toBe(400);
	});

	test('successfully registers user when data is valid and not taken', async () => {
		const req = {
			body: { username: 'alice', email: 'alice@example.com', password: 'secret123' },
		};
		const res = createMockRes();

		userService.isEmailTaken.mockResolvedValue(false);
		userService.isUsernameTaken.mockResolvedValue(false);
		bcrypt.hash.mockResolvedValue('hashed-password');
		userService.createUser.mockResolvedValue({ _id: '1' });

		await registerUser(req, res, next);

		expect(userService.isEmailTaken).toHaveBeenCalledWith('alice@example.com');
		expect(userService.isUsernameTaken).toHaveBeenCalledWith('alice');
		expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
		expect(userService.createUser).toHaveBeenCalledWith({
			username: 'alice',
			email: 'alice@example.com',
			password: 'hashed-password',
		});
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully.' });
		expect(next).not.toHaveBeenCalled();
	});
});

describe('userController - loginUser', () => {
	let next;

	beforeEach(() => {
		next = jest.fn();
		jest.clearAllMocks();
	});

	test('returns 400 via next when email or password missing', async () => {
		const req = { body: { email: 'test@example.com' } }; // missing password
		const res = createMockRes();

		await loginUser(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
				const error = next.mock.calls[0][0];
		expect(error.statusCode).toBe(400);
	});

	test('returns 401 via next when credentials are invalid', async () => {
		const req = { body: { email: 'test@example.com', password: 'wrong' } };
		const res = createMockRes();

		userService.findUserByEmail.mockResolvedValue(null);

		await loginUser(req, res, next);

		expect(userService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
		expect(next).toHaveBeenCalledTimes(1);
		const error = next.mock.calls[0][0];
		expect(error.statusCode).toBe(401);
	});

	test('logs user in and returns token when credentials are valid', async () => {
		const req = { body: { email: 'test@example.com', password: 'secret123' } };
		const res = createMockRes();

		const fakeUser = { _id: '1', password: 'hashed' };
		userService.findUserByEmail.mockResolvedValue(fakeUser);
		bcrypt.compare.mockResolvedValue(true);
		jwt.sign.mockReturnValue('fake-token');

		await loginUser(req, res, next);

		expect(userService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
		expect(bcrypt.compare).toHaveBeenCalledWith('secret123', 'hashed');
		expect(jwt.sign).toHaveBeenCalledWith({ id: fakeUser._id }, expect.any(String), { expiresIn: '1h' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ token: 'fake-token' });
		expect(next).not.toHaveBeenCalled();
	});
});
