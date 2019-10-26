/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const Sequelize = require('sequelize');


module.exports = {
  attributes: {
    recipientId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    donorId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  options: {
    // Options must exists (even if empty) in order to consider this model a Sequelize model
    tableName: 'like',
    classMethods: {},
    instanceMethods: {},
    hooks: {},
    scopes: {}
  },
  connection: 'default' // Can be omitted, so default sails.config.models.connection will be used,
};
