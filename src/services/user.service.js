import { User } from "../models/user.model.js";

const findUser = async (filter) => {
  const user = await User.findOne(filter);
  return user;
};

const createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

export { findUser, createUser };
