class UserSelDTO {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.is_active = user.is_active;
    this.created_at = user.created_at;
    this.role = user.role ? user.role.name : null;
  }
}

export default UserSelDTO;
