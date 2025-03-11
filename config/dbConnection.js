import mongoose from 'mongoose';

const dbConnect = async () => {
  mongoose.set('strictPopulate', false);
  mongoose.set('strictQuery', true);
  try {
    const connect = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log(
      `Database Connect Successfully Host=>${connect.connection.host}, Database Name => ${connect.connection.name}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default dbConnect;
