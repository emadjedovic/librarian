const showHome = (req, res) => {
  const memberName = res.locals.currentMember ? res.locals.currentMember.firstName : 'Guest';
  res.render('index', { name: memberName });
};

module.exports = {
  showHome
};