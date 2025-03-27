module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('Room', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    }, {
      tableName: 'rooms',
      timestamps: false
    });
  
    Room.associate = (models) => {
      Room.hasMany(models.ReservationRoom, { 
        foreignKey: 'room_id',
        as: 'ReservationRooms'
      });
    };
  
    return Room;
  };