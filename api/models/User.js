/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = {
  attributes: {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already in use!'
      }
    },
    password: {
      type: Sequelize.STRING
    }
  },

  associations: function() {
    User.hasMany(Like, {
      foreignKey: 'recipientId',
      constraints: false,
      as: 'receivedLikes'
    });

    User.hasMany(Like, {
      foreignKey: 'donorId',
      constraints: false,
      as: 'sentLikes'
    });
  },
  options: {
    // Options must exists (even if empty) in order to consider this model a Sequelize model
    tableName: 'user',
    classMethods: {},
    instanceMethods: {
      toJSON: function () {
        var values = Object.assign({}, this.get());

        delete values.password;
        return values;
      }
    },
    hooks: {
      beforeSave: async function(user) {
        console.log('user', user);
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
    scopes: {}
  },
  connection: 'default' // Can be omitted, so default sails.config.models.connection will be used,
};
