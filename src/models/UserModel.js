import {DataTypes} from "sequelize";
import db from "../libs/db.js";
import bcrypt from "bcrypt"
import {PASSWORD_SALT} from "../common/constants.js";

const Users = db.define('users', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
},{
    hooks: {
        beforeCreate(attributes) {
            attributes.password = attributes.password && attributes.password !== '' ? bcrypt.hashSync(attributes.password, PASSWORD_SALT) : ''
        }
    },
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            unique: false,
            fields: ['username']
        },
    ],
    underscored: true,
    tableName: 'users',
    modelName: 'Users',
    timestamps: true
});

export default Users;