import { findByUsernameOrEmail } from "../repositories/userRepository.js";
import { BadRequestError, UnauthorizedError } from "../exceptions/index.js";

export const login = (identifier, password) => {
  if (!identifier || !password) {
    throw new BadRequestError("Identifier and password are required");
  }

  const user = findByUsernameOrEmail(identifier);

  if (!user || user.password !== password) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return { id: user.id, username: user.username, email: user.email };
};
