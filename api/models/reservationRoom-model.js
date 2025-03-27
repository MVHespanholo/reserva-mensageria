module.exports = (sequelize, DataTypes) => {
    const ReservationRoom = sequelize.define('ReservationRoom', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      number_of_days: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      daily_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      reservation_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    }, {
      tableName: 'reservation_rooms',
      timestamps: false
    });
  
    ReservationRoom.associate = (models) => {
      ReservationRoom.belongsTo(models.Reservation, { 
        foreignKey: 'reservation_uuid',
        as: 'Reservation'
      });
      ReservationRoom.belongsTo(models.Room, { 
        foreignKey: 'room_id',
        as: 'Room'
      });
      ReservationRoom.belongsTo(models.Category, { 
        foreignKey: 'category_id',
        as: 'Category'
      });
      ReservationRoom.belongsTo(models.SubCategory, { 
        foreignKey: 'sub_category_id',
        as: 'SubCategory',
        allowNull: true
      });
    };
  
    return ReservationRoom;
  };