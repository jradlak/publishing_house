/**
 * Created by Jakub on 2014-08-16.
 */
var _ =           require('underscore')
    , Article =      require('../models/Article.js')
    , url = require('url');

module.exports = {
    addArticle: function(req) {
        Article.addArticle(
            req.db,
            req.body.user_name,
            req.body.title,
            req.body.description,
            req.body.content)
    },

    loadAll : function(req, res) {
        Article.loadArticles(req.db, function() {
            var articles = Article.getAllArticles();
            res.json(articles);
        });
    },

    loadByUserName : function(req, res) {
        var objUserName = url.parse(req.url,true).query;
        Article.loadByUserName(req.db, objUserName.username, function() {
            var articles = Article.getAllArticles();
            res.json(articles);
        });
    }
};

