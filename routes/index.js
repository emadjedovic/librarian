const router = require("express").Router()

const libraryRoutes = require("./libraryRoutes")
const errorRoutes = require("./errorRoutes")
const homeRoutes = require("./homeRoutes")
const memberRoutes = require("./memberRoutes")
const apiRoutes = require("./apiRoutes")

// order matters
router.use("/members", memberRoutes);
router.use("/libraries", libraryRoutes);
router.use("/api", apiRoutes)
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;