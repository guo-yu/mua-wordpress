var parser = require('../index');

parser.import('wp.xml', function(err, data) {
    console.log(err)
    console.log(data);
    // require('fs').writeFileSync('data.json',JSON.stringify(data))
});