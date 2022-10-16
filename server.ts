import app from './src/app'
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://biosom:biosom23brasil@cluster0.sqguezr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB is Connected'))
    .catch((error) => console.log(`Error connection MongoDB: ${error}`))
app.listen(process.env.PORT || 5000, () => console.log('live'))