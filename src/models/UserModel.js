import {DataTypes} from "sequelize";
import db from "../libs/db.js";
import bcrypt from "bcrypt"

const Users = db.define('users', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
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
            attributes.password = attributes.password && attributes.password !== '' ? bcrypt.hashSync(attributes.password, 8) : ''
        }
    },
    underscored: true,
    tableName: 'users',
    modelName: 'Users',
    timestamps: true
});

export default Users;