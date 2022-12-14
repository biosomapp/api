import fs from 'fs'
import path from 'path'
import { Sequelize, DataTypes } from 'sequelize'

const basename = path.basename(__filename)
const db: any = {}

const sequelize = new Sequelize(process.env.DATABASE_NAME || '', process.env.DATABASE_USER || '', process.env.DATABASE_PW, {
    host: process.env.DATABASE_HOST,
    dialect: 'mariadb',
  });

fs
  .readdirSync(__dirname)
  .filter(folderFile => {
    // this is not a folder, must return to avoid crash
    if (folderFile.indexOf('.') > 0) return null

    return fs.readdirSync(path.resolve(__dirname, folderFile)).filter(file => {
      return (file.indexOf('.') !== 0) && (file === basename) && (file.slice(-3) === '.ts')
    })
  })
  .forEach(async file => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
