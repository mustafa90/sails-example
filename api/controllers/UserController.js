/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Sequelize = require("sequelize");
module.exports = {
  index: async function(req, res) {
    try {
      const user = await User.findOne({
        where: { id: req.param("id") },
        attributes: {
          include: [
            "User.username",
            [
              Sequelize.fn("COUNT", Sequelize.col("receivedLikes.recipientId")),
              "numberOfLikes"
            ]
          ]
        },
        include: [
          {
            model: Like,
            attributes: [],
            as: "receivedLikes" // <---- HERE
          }
        ],
        group: ["User.id"]
      });
      console.log(user);
      if (!user) {
        return res.notFound();
      }

      res.status(201).send(user);
    } catch (e) {
      console.log(e);
      res.status(400).send("Failed to retrieve the user.");
    }
  },
  signup: async function(req, res) {
    try {
      const user = await User.create({
        username: req.body.username,
        password: req.body.password
      });
      res.status(201).send(user);
    } catch (e) {
      console.log(e);
      res.status(400).send("Failed to create user.");
    }
  },
  me: async function(req, res) {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        include: [
          {
            model: Like,
            as: "receivedLikes" // <---- HERE
          },
          {
            model: Like,
            as: "sentLikes" // <---- HERE
          }
        ]
      });
      console.log(user);
      if (!user) {
        return res.notFound();
      }

      res.status(201).send(user);
    } catch (e) {
      console.log(e);
      res.status(400).send("Failed to get the logged in user.");
    }
  },
  updatePassword: async function(req, res) {
    if (!req.body.user || !req.body.user.password) {
      res.status(400).send("Invalid request body. Missing user parameter.");
    }
    if (!req.body.user.password) {
      res
        .status(400)
        .send(
          "Invalid request body. Missing password parameter inside the user body."
        );
    }
    try {
      const user = await User.update(
        { password: req.body.user.password },
        { where: { id: req.user.id }, individualHooks: true }
      );
      res.status(201).send(user);
    } catch (e) {
      console.log(e);
      res.status(400).send("Failed to update the user.");
    }
  }
};
