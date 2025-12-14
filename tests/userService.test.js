const userService = require('../src/services/userService');

jest.mock('../src/models/userModel', () => {
	const saveMock = jest.fn();

	function User(data) {
		this.data = data;
		this.save = saveMock;
	}

	User.findById = jest.fn();
	User.findOne = jest.fn();
	User.__saveMock = saveMock;

	return User;
});

const User = require('../src/models/userModel');

describe('userService', () => {
	beforeEach(() => {
		User.findById.mockReset();
		User.findOne.mockReset();
		User.__saveMock.mockReset();
	});

	test('findUserById delegates to User.findById', async () => {
		const fakeUser = { _id: '123', username: 'alice' };
		User.findById.mockResolvedValue(fakeUser);

		const result = await userService.findUserById('123');

		expect(User.findById).toHaveBeenCalledWith('123');
		expect(result).toBe(fakeUser);
	});

	test('isEmailTaken returns true when user exists', async () => {
		User.findOne.mockResolvedValue({ _id: '1', email: 'test@example.com' });

		const result = await userService.isEmailTaken('test@example.com');

		expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
		expect(result).toBe(true);
	});

	test('isEmailTaken returns false when user does not exist', async () => {
		User.findOne.mockResolvedValue(null);

		const result = await userService.isEmailTaken('missing@example.com');

		expect(result).toBe(false);
	});

	test('createUser creates a new User and saves it', async () => {
		const payload = { username: 'bob', email: 'bob@example.com', password: 'hashed' };

		const created = await userService.createUser(payload);

		expect(created.data).toEqual(payload);
		expect(User.__saveMock).toHaveBeenCalledTimes(1);
	});
});
