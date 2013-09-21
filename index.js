var fs = require('fs'),
    xml = require('node-xml-lite');

var excapeList = ['item', 'category', 'wp:postmeta', 'wp:comment'];

var clear = function(body) {
    excapeList.forEach(function(escaped) {
        if (body[escaped].length == 0) delete body[escaped];
    });
    return body;
};

var init = function() {
    var body = {};
    excapeList.forEach(function(item) {
        body[item] = [];
    });
    return body;
}

// flat raw xml-like json array.
exports.flat = function(list) {
    if (list) {
        if (list.length > 1) {
            var body = init(excapeList);
            list.forEach(function(item) {
                if (excapeList.indexOf(item.name) > -1) {
                    body[item.name].push(exports.flat(item.childs));
                } else {
                    body[item.name] = exports.flat(item.childs);
                }
            });
            return clear(body);
        } else {
            return list.join('');
        }
    } else {
        return null;
    }
}

// data must be [string]
exports.convert = function(data, callback) {
    if (data && typeof(data) === 'string') {
        callback(null, exports.flat(xml.parseString(data).childs[0].childs));
    } else {
        callback(new Error('input must be string'));
    }
};

// import via filename
exports.import = function(filename, callback) {
    fs.readFile(filename, function(err, file) {
        if (!err) {
            exports.convert(file.toString(), callback);
        } else {
            callback(err);
        }
    })
};