module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Persons', {
        nume: {
            type: DataType.STRING,
            allowNull: false 
        },
        prenume: {
            type: DataType.STRING,
            allowNull: false
        },
        cnp: {
            type: DataType.STRING,
            allowNull: false,
            unique: true 
        },
        varsta: {
            type: DataType.INTEGER,
            allowNull: false
        },
    
    }, {
        timestamps: true 
    });

    model.associate = models => {
        model.belongsToMany(models.Cars, {
            through: models.Junction, 
        });
    };

    
    return model;
};