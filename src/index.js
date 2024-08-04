const { app } = require('./app');
const { PORT } = require('./config/envs');
const { connectDB } = require('./config/mongo');

app.listen(PORT, () => {
  console.log(`Server is running in port: ${PORT}`);
  connectDB();
});
