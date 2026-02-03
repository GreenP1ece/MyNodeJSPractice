import config from "../db/config.js";
const {Sequelize, DataTypes, db} = config;

const Book = db.define('Book', {
    title: {
        type: DataTypes.STRING,
        unique: true,
    },
    author: {
        type: DataTypes.STRING,
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
},
{});

Book.sync();

export default Book;