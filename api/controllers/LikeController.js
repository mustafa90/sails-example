/**
 * LikeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  likeTheUser: async function(req, res) {
    try {
      //check if this user is already liked
      const existingLike = await Like.findOne({
        where: {
          recipientId: req.param("id"),
          donorId: req.user.id
        }
      });
      if (!existingLike) {
        const like = await Like.create({
          recipientId: req.param("id"),
          donorId: req.user.id
        });
        res.status(201).send(like);
      } else {
        res.status(400).send("This user is already liked.");
      }
    } catch (e) {
      console.log(e);
      res.status(400).send("Failed to like the user.");
    }
  }
};
