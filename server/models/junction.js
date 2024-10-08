module.exports = (sequelize, DataType) => {
    return sequelize.define('Junction', {
        personId: {
            type: DataType.INTEGER,
            references: {
                model: 'Persons',
                key: 'id',
                onDelete: 'CASCADE',  
                onUpdate: 'CASCADE'
            }
        },
        carId: {
            type: DataType.INTEGER,
            references: {
                model: 'Cars',
                key: 'id',
                onDelete: 'CASCADE',  
                onUpdate: 'CASCADE'
            }
        }
    },{
        timestamps: true
      });
};