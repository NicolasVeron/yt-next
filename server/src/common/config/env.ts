export default () => ({
   port: parseInt(process.env.PORT || "3001"),
   database: {
      uri: process.env.MONGO_URI,
      host: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
      clientUrl: process.env.CLIENT_URL
   }
});