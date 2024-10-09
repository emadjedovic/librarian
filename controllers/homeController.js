const showHome = (req, res) => {
  const userName = res.locals.currentUser ? res.locals.currentUser.firstName : 'Guest';
  res.render('index', { name: userName });
};

module.exports = {
  showHome
};