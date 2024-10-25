import bcrypt from "bcrypt";

export const isPasswordMatched = async (password: string, userPassword: string) => {
  const isCorrectPassword = await bcrypt.compare(password, userPassword);
  return isCorrectPassword;
};
