var fs = require('fs'),
    xml = require('node-xml-lite');

// data must be [string]
exports.convert = function(data, callback) {

    var parsedData = xml.parseString(data);
    var main = parsedData.childs[0].childs;
    var output = {
        site: {},
        authors: [],
        articles: []
    };

    // 这段逻辑要改进
    main.forEach(function(info) {
        if (info.name == 'title') {
            output.site['name'] = info.childs[0];
        } else if (info.name == 'wp:base_site_url') {
            output.site['url'] = info.childs[0];
        } else if (info.name == 'description') {
            output.site['description'] = info.childs[0];
        } else if (info.name == 'wp:author') {
            // 如果是作者
            var author = info.childs;
            var thisAuthor = {};
            author.forEach(function(authorInfo) {
                if (authorInfo.name = "wp:author_email") {
                    thisAuthor['email'] = authorInfo.childs[0];
                } else if (authorInfo.name = "wp:author_display_name") {
                    thisAuthor['name'] = authorInfo.childs[0];
                } else if (authorInfo.name = "wp:wp:author_login") {
                    thisAuthor['loginName'] = authorInfo.childs[0];
                }
            });
            output.authors.push(thisAuthor);
        } else if (info.name == 'item') {
            var outputArticle = {};
            outputArticle['category'] = [];
            outputArticle['tags'] = [];
            // 如果是文章
            var thisArticle = info.childs;

            thisArticle.forEach(function(item) {

                if (item.name == 'title') {
                    outputArticle['title'] = item.childs[0];
                } else if (item.name == 'pubDate') {
                    outputArticle['pubdate'] = item.childs[0];
                } else if (item.name == 'dc:creator') {
                    // 这里读取的author对应的是loginName
                    outputArticle['author'] = item.childs[0];
                } else if (item.name == 'content:encoded') {
                    // 筛选内容中放在原博客的远程图片，替换url
                    var contents = item.childs[0];
                    var siteUrl = site.baseUrl + '/wp-content/uploads';
                    // var escContents = contents.replace(new RegExp(esc(siteUrl), 'g'), '../public/uploads');
                    outputArticle['content'] = contents;
                } else if (item.name == 'category') {
                    // 如果是分类或者标签
                    var type = item.attrib;
                    if (type.domain == 'post_tag') {
                        outputArticle['tags'].push(item.childs[0]);
                    } else if (type.domain == 'category') {
                        outputArticle['category'].push(item.childs[0]);
                    }
                } else if (item.name == 'wp:postmeta') {
                    var meta = item.childs;
                    if (meta[0].name == 'wp:meta_key' && meta[0].childs[0] == 'duoshuo_thread_id') {
                        outputArticle['duoshuoId'] = meta[1].childs[0];
                    }
                }

            });

            output.articles.push(outputArticle);

        }
    });

    callback(output);

};

// import via filename
exports.import = function(filename, callback) {
    exports.convert(fs.readFileSync(filename), callback);
};