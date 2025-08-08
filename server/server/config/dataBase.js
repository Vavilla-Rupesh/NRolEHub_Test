const { Sequelize } = require('sequelize');

let sequelize;

// Use DATABASE_URL in production (Render)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // needed for Render's self-signed cert
      },
    },
  });
} else {
  // Local development
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
}

// Sync Models
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Import models
    const User = require('../modules/auth/auth.model');
    const StudentRegistration = require('../modules/events/studentRegistration.model');

    // Associations
    User.hasMany(StudentRegistration, { foreignKey: 'student_id', as: 'registrations' });
    StudentRegistration.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, syncDatabase };
