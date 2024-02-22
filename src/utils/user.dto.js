class UserDto {
  id;
  phone;
  fullName;
  avatar;
  createdAt;
  activated;

  constructor(user) {
    this.id = user._id;
    this.fullName = user.fullName;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
  }
}

export default UserDto;
