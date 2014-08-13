/**
 * Created by Jakub on 2014-08-12.
 */
var Article
    , _ =               require('underscore');

var articles = [];

module.exports = {
    loadArticles : function(db) {
        articles = [];
        var collection = db.get('articlecollection');
        collection.find({},{},function(e,docs) {
            for (var a in docs)
            {
                var art = {
                    id :  docs[a].id,
                    author_id : docs[a].author_id,
                    title : docs[a].title,
                    description : docs[a].description,
                    content : docs[a].content
                };

                articles.push(art);
            }
        });
    },

    addArticle : function(db, author_id, title, description, callback) {
        var article = {
            id : _.max(articles, function(article) { return article.id; }).id + 1,
            author_id : author_id,
            title : title
        };

        articles.push(article);

        //writing to database:
        var collection = db.get('articlecollection');
        collection.insert(article);

        callback(null, article);
    }
};