import {Sequelize, DataTypes} from "sequelize";

const db = new Sequelize('postgres://postgres:123@localhost:5432/librarydb', {
    logging: true,
});

try {
    await db.authenticate();
    console.log('Database connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default {
    Sequelize,
    DataTypes,
    db
};