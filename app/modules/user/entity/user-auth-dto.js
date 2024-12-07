class UserAuthDTO {
  constructor(user) {
    this.firstname = user.firstname;
    this.email = user.email;
    this.is_active = user.is_active;
    this.role = user.role ? user.role.name : null; 
    this.permissions = user.role && user.role.permissions
      ? user.role.permissions.map(permission => ({
          code: permission.code,
          name: permission.name
        }))
      : [];
  }
}

export default UserAuthDTO;