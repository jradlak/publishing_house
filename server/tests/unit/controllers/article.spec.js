/**
 * Created by Jakub on 2014-08-25.
 */

var expect = require('chai').expect
    , sinon = require('sinon')
    , ArticleCtrl = require('../../../controllers/article')
    , Article = require('../../../models/Article')
    , db =              monk('localhost:27017/publishing_house_test');

describe('Article controller Unit Tests - ', function() {
    var req = { }
        , res = {}
        , next = {}
        , sandbox = sinon.sandbox.create();

    beforeEach(function() {

    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('addArticle()', function() {
        beforeEach(function() {
            //req.db = db;
            req.body = {
                user_name: "user_test_1",
                title: "title_test_1",
                description: "description_test_1",
                content: "content_test_1"
            };
        });

        it('should add article, and return 200 - everything OK', function(done) {
            res.send = function(httpStatus) {
                expect(httpStatus).to.equal(200);
                done();
            };

            ArticleCtrl.addArticle(req);
        });
    });
});