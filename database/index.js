const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kanban'

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))