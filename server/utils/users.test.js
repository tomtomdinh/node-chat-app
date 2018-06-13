const expect= require('expect');

const {Users} = require('./users.js');

describe('Users', () => {
  var users;
  beforeEach(()=> {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    },{
      id: '2',
      name: 'Jen',
      room: 'React Course'
    },{
      id: '3',
      name: 'Tom',
      room: 'Node Course'
    }];
  });

  it('should add a new user', ()=> {
    // can still use custom data instead of using the one above
    var users = new Users();
    var user = {
      id: '123',
      name: 'Tom',
      room: 'A'
    };

    expect(users.addUser(user.id,user.name,user.room)).toMatchObject(user);
  });

  it('should return names for node course', () => {
    var userList = users.getUserList('Node Course');

    expect(userList).toEqual(expect.arrayContaining(['Mike','Tom']));
  });

  it('should return names for react course', () => {
    var userList = users.getUserList('React Course');

    expect(userList).toEqual(expect.arrayContaining(['Jen']));
  });

  it('should remove a user', () => {
    var userId = '1';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var userId = '4';
    var user = users.removeUser(userId);

    expect(user).not.toBeDefined();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = '2';
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find a user', ()=> {
    var userId = '4';
    var user = users.getUser(userId);

    expect(user).not.toBeDefined();
  });
});
