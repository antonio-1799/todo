import {DataTypes} from "sequelize";
import db from "../libs/db.js";

const RevokedTokens = db.define('revokedTokens', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
    indexes: [
        {
            unique: false,
            fields: ['token']
        },
    ],
    underscored: true,
    tableName: 'revoked_tokens',
    modelName: 'RevokedTokens',
    timestamps: true
});

export default RevokedTokens;