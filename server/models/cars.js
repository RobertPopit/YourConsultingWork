module.exports = (sequelize,DataType) => {
    let cars = sequelize.define('Cars' , {
          denumire_marca: {
            type: DataType.STRING,
            allowNull: false
          },
          denumire_model: {
            type: DataType.STRING,
            allowNull: false
          },
          anul_fabricatiei: {
            type: DataType.INTEGER,
            allowNull: false
          },
          capacitatea_cilindrica: {
            type: DataType.FLOAT,
            allowNull: false
          },
          taxa_impozit: {
            type: DataType.FLOAT,
            allowNull: false
          },
         
        }, {
          timestamps: true
        });
      
        cars.associate = models => {
            cars.belongsToMany(models.Persons, {
                through: models.Junction,
                
            });
        };
       
        return cars;
      };