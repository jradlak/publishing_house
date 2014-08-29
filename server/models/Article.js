/**
 * Created by Jakub on 2014-08-12.
 */
var Article
    , _ =               require('underscore');

var articles = [];

module.exports = {
    loadArticles : function(db, success) {
        articles = [];
        console.log('!!! loadArticles server');
        var collection = db.get('articlecollection');
        collection.find({},{},function(e,docs) {
            for (var a in docs)
            {
                console.log(a);
                var art = {
                    id :  docs[a].id,
                    user_name : docs[a].user_name,
                    title : docs[a].title,
                    description : docs[a].description,
                    content : docs[a].content
                };
                articles.push(art);
            }
            success();
        });
    },

    loadByUserName : function(db, username, success) {
        articles = [];
        var collection = db.get('articlecollection');
        collection.find({user_name: username},{},function(e,docs) {
            for (var a in docs)
            {
                var art = {
                    id :  docs[a].id,
                    user_name : docs[a].user_name,
                    title : docs[a].title,
                    description : docs[a].description,
                    content : docs[a].content
                };
                articles.push(art);
            }
            success();
        });
    },

    getAllArticles : function() {
        return _.map(articles, function(article) { return _.clone(article); });
    },

    addArticle : function(db, user_name, title, description, content, callback) {
        var maxId = 1;
        if (articles.length > 0) {
            maxId = _.max(articles, function(article) { return article.id; }).id + 1;
        }

        var article = {
            id : maxId,
            user_name : user_name,
            title : title,
            description : description,
            content : content
        };

        articles.push(article);

        //writing to database:
        var collection = db.get('articlecollection');
        collection.insert(article);

        //callback(null, article);
    }
};