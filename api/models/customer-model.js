module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    }, {
      tableName: 'customers',
      timestamps: false
    });
  
    Customer.associate = (models) => {
      Customer.hasMany(models.Reservation, { foreignKey: 'customer_id' });
    };
  
    return Customer;
  };