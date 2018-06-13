const moment = require('moment');

var date = moment();
date.add(5,'m')
console.log(date.format('MMM Do YYYY'));
console.log(date.format('hh:mm a'));
