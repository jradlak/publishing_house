/**
 * Created by Jakub on 2014-08-19.
 */

var _ =               require('underscore')
    , Translation =   require('../models/Translation.js');

module.exports = {
    getTranslation: function(req, res) {
        var translations = Translation.getTranslations(req.lang);
        res.json(translations);
    }
}