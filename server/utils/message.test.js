const expect = require('expect');

var {generateMessage} = require('./message.js');

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
