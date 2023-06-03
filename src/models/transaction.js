'use strict'
const { Model } = require('sequelize')
const moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Wallet, {
        as: 'wallet'
      })
    }
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      walletId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      type: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      description: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        field: 'createdAt',
        defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedAt',
        defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
        get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    {
      sequelize,
      modelName: 'Transaction'
    }
  )
  return Transaction
}
