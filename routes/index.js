const router = require("express").Router()

const libraryRoutes = require("./libraryRoutes")
const errorRoutes = require("./errorRoutes")
const homeRoutes = require("./homeRoutes")
const userRoutes = require("./userRoutes")
const bookRoutes = require("./bookRoutes")
const apiRoutes = require("./apiRoutes")

// order matters
router.use("/users", userRoutes);
router.use("/libraries", libraryRoutes);
router.use("/books", bookRoutes)
router.use("/api", apiRoutes)
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;