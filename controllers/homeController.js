const showHome = (req, res) => {
  res.render('index', { name: 'Ema'})
}

module.exports = {
  showHome
}