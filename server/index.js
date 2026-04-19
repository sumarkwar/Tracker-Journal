const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/medicine', require('./routes/medicineRoutes'));
app.use('/api/period', require('./routes/periodRoutes'));
app.use('/api/fitness', require('./routes/fitnessRoutes'));
app.use('/api/mood', require('./routes/moodRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));

app.get('/', (req, res) => {
  res.send('Project26 API is running!');
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});