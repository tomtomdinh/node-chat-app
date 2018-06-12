const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message.js');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var res = generateMessage('bob', 'hi');

    expect(typeof res.createdAt).toBe('number');
    expect(res).toMatchObject({
      from: 'bob',
      text: 'hi'
    });
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Ryan';
    var lat = 15;
    var long = 10;
    var url = `https://www.google.com/maps?q=${lat},${long}`
    var msg = generateLocationMessage(from,lat,long);

    expect(typeof msg.createdAt).toBe('number');
    expect(msg).toMatchObject({
      from,
      url
    });
  });
});
