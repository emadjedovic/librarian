const showHome = (req, res) => {
  const userName = res.locals.currentUser ? res.locals.currentUser.name.first : 'Guest';
  res.render('index', { name: userName });
};

module.exports = {
  showHome
};