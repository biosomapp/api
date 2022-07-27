import { ModelAttributes } from 'sequelize/types'

const getProperties = (DataTypes: any): ModelAttributes => {
  return {
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    full_name: {
      type: DataTypes.STRING
    },
    createdAt: {
      field: 'creation_date',
      type: DataTypes.DATE
    },
    updatedAt: {
      field: 'creation_date',
      type: DataTypes.DATE
    },
    last_accessed: {
      type: DataTypes.DATE
    },
    key_expiration_date: {
      type: DataTypes.DATE
    },
    deleted: {
      type: DataTypes.INTEGER
    }
  }
}

export { getProperties }
