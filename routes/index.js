
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'msrd.io' });
};

exports.not_found = function(res) {
  res.render('404', {
    layout: false,
    status: 404
  });
};
  
