import {DataTypes} from "sequelize";
import db from "../libs/db.js";
import Users from "./UserModel.js";

const Todos = db.define('todos', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        },
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    completedAt: {
        type: DataTypes.DATE,
        unique: false
    },
    remarks: DataTypes.STRING(255),
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
},{
    underscored: true,
    tableName: 'todos',
    modelName: 'Todos',
    timestamps: true
});

export default Todos;