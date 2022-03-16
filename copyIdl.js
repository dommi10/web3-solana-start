// copyIdl.js
const fs = require('fs');
const idl = require('./target/idl/nabittuto.json');

fs.writeFileSync('./app/app/idl.json', JSON.stringify(idl));
