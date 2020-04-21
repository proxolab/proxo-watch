module.exports = (req, res, next) => {
  try {
    if (req.session.user) {
       next();
    } else {
       throw 'Invalid user ID';    
    }
  } catch {
    res.render('login.ejs', {
        messages: 'Bu sayfayı Görebilmek için giriş yapmanız gerekmektedir.'
      });
  }
};