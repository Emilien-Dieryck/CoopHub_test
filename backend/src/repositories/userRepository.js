// ========================================
// User Repository - Data Access Layer
// ========================================
import { usersData } from "../data/users.js";

export const findByUsernameOrEmail = (identifier) => {
  return usersData.find(u => u.username === identifier || u.email === identifier);
};
