import {DataTypes} from "sequelize";
import db from "../../config/db.js";

const Todos = db.define('todos', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    completedAt: DataTypes.DATE,
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