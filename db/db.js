const mongoose = require("mongoose");

const connectMongo = async () => {
  const client = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client;
};

module.exports = { connectMongo };
