import { jest } from "@jest/globals";

import { generateRoomId, generateToken } from "../../../src/lib/utils.js";

describe("generateRoomId", () => {
  test("returns a 6-character uppercase alphanumeric string", () => {
    const roomId = generateRoomId();
    expect(roomId).toMatch(/^[0-9A-Z]{6}$/);
  });

  test("generates different ids across calls", () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateRoomId()));
    expect(ids.size).toBeGreaterThan(1);
  });
});

describe("generateToken", () => {
  test("signs a JWT, sets an httpOnly cookie, and returns the token", () => {
    const res = { cookie: jest.fn() };

    const token = generateToken("user123", res);

    expect(typeof token).toBe("string");
    expect(res.cookie).toHaveBeenCalledWith(
      "jwt",
      token,
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
      })
    );
  });
});
