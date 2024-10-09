import mongoose from 'mongoose';

const connectDb = () => {
    mongoose.set('strictQuery', true);
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch((err) => {
            console.log('Failed');
        });
};

export default connectDb;
