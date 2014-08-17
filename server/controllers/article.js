/**
 * Created by Jakub on 2014-08-16.
 */
var _ =           require('underscore')
    , Article =      require('../models/Article.js')

module.exports = {
    addArticle: function(req) {
        Article.addArticle(req.db, req.body.user_name, req.body.title, req.body.description, req.body.content)
    },

    loadAll : function(req) {
        Article.loadArticles(req.db);
    },

    findAll : function(req, res) {

        var articles = Article.getAllArticles();
        console.log("Znajdowanie artykulow!!!!");
        console.log(articles);
        res.json(articles);
    }
};

