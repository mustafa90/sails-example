/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = sails.config.secrets.jwtSecret;

module.exports = {
  login: async function(req, res) {
    var user = await User.findOne({
      where: { username: req.body.username }
    });
    console.log(user);
    if (!user) return res.notFound();

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      var token = jwt.sign({ user: user.id }, jwtSecret, {
        expiresIn: 180 * 60
      });
      // set a cookie on the client side that they can't modify unless they sign out (just for web apps)
      res.cookie('sailsjwt', token, {
        signed: true,
        // domain: '.yourdomain.com', // always use this in production to whitelist your domain
        maxAge: 180 * 60
      });
      // provide the token to the client in case they want to store it locally to use in the header (eg mobile/desktop apps)
      return res.ok(token);
    } else {
      return res.status(401).send('Invalid credentials.');
    }
  }
};
