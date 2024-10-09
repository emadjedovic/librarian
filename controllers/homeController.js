const showHome = (req, res) => {
  const memberName = res.locals.currentMember ? res.locals.currentMember.name.first : 'Guest';
  res.render('index', { name: memberName });
};

module.exports = {
  showHome
};