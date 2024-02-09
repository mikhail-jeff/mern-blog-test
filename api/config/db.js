import chalk from "chalk";
import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGO_URI);
		console.log(chalk.cyanBright.bold(`MongoDB connected: ${connect.connection.host}`));
	} catch (error) {
		console.log(chalk.redBright.bold(error));
	}
};

export default connectDB;
