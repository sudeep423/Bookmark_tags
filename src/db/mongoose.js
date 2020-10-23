const mongoose = require('mongoose')

mongoose.connect(process.env.mongodbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected....'))
    .catch((e) => console.log(e))
