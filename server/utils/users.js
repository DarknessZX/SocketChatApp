class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = { id, name , room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    console.log('after remove ',this.users);
    console.log('remove user ',user);
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id);
  }

  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => { return user.name;})
    console.log('users name list ',namesArray)
    return namesArray;
  }
}

module.exports = { Users }
