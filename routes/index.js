const router = require("express").Router()

const courseRoutes = require("./courseRoutes")
const errorRoutes = require("./errorRoutes")
const homeRoutes = require("./homeRoutes")
const subscriberRoutes = require("./subscriberRoutes")
const userRoutes = require("./userRoutes")

// order matters
router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;