module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      uuid: {
        type: DataTypes.STRING(50),
        primaryKey: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      indexed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'reservations',
      timestamps: false
    });
  
    Reservation.associate = (models) => {
      Reservation.belongsTo(models.Customer, { foreignKey: 'customer_id' });
      Reservation.hasMany(models.ReservationRoom, { foreignKey: 'reservation_uuid' });
    };
  
    return Reservation;
  };