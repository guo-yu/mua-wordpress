var parser = require('../index');

parser.import('wp.xml', function(data) {
    // console.log(data);
    require('fs').writeFileSync('data.json',JSON.stringify(data))
});