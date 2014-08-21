/**
 * Created by Jakub on 2014-08-19.
 */
var Translation
    , _ =               require('underscore');

var translations = [];

module.exports = {
    getTranslations: function (lang) {
    var file = '/translation/' + lang + '/main.json';
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            data = JSON.parse(data);
            console.log(data);
        });
    }
}