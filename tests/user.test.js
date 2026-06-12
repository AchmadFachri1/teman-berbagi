const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../server/models/User");

jest.setTimeout(30000);

describe("User Model Test", () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it("should create a new user", async () => {
        const userData = {
            username: "Reza",
            email: "reza@test.com",
            password: await bcrypt.hash("123456", 10),
            tanggalLahir: new Date("1990-01-01"),
        };

        const user = await User.create(userData);

        expect(user._id).toBeDefined();
        expect(user.email).toBe("reza@test.com");
        expect(user.username).toBe("Reza");
    });

    it("should not create user without email", async () => {
        const userData = {
            username: "Reza",
            password: "123456",
            tanggalLahir: new Date("1990-01-01"),
        };

        let err;
        try {
            await User.create(userData);
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.errors.email).toBeDefined();
    });

    it("should not create user without username", async () => {
        const userData = {
            email: "test@test.com",
            password: "123456",
            tanggalLahir: new Date("1990-01-01"),
        };

        let err;
        try {
            await User.create(userData);
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.errors.username).toBeDefined();
    });

});