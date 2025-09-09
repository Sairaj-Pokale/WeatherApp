const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URL

console.log(uri)

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// }
// );

const connectDB = async () => {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(`Error in establishing connection to MondoDB Database: ${error}`)
    }
};

module.exports = connectDB