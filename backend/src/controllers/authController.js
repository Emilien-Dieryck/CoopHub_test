import { login as loginService } from "../services/authService.js";
import logger from "../utils/logger.js";

export const login = (req, res, next) => {
  const { identifier, password } = req.body;
  try {
    const user = loginService(identifier, password);
    logger.info(`User logged in: ${user.username} (${user.email})`);
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    next(err);
  }
};
