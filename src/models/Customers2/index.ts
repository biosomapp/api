import { Model } from 'sequelize'
import { getProperties } from './getProperties'

interface Customers2Attributes {
  email: string
  createdAt: Date
  updatedAt: Date
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Customers2 extends Model<Customers2Attributes> {
    static associate (models: any): void {
      //
    }
  }
  Customers2.init(getProperties(DataTypes), {
    sequelize,
    modelName: 'Customers2',
    tableName: 'customers2'
  })
  return Customers2
}
