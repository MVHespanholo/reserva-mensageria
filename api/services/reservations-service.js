const db = require('../models');

async function getReservations({ uuid, customerId, roomId }) {
  try {
    const where = {};
    const include = [
      {
        model: db.Customer,
        attributes: ['id', 'name'],
        required: true,
        as: 'Customer'
      },
      {
        model: db.ReservationRoom,
        as: 'ReservationRooms',
        attributes: ['id', 'number_of_days', 'reservation_date', 'daily_rate', 'room_id', 'category_id', 'sub_category_id'],
        include: [
          {
            model: db.Room,
            attributes: ['id'],
            as: 'Room',
            ...(roomId && { where: { id: roomId } })
          },
          {
            model: db.Category,
            attributes: ['id'],
            as: 'Category',
            include: [{
              model: db.SubCategory,
              attributes: ['id'],
              as: 'SubCategories',
              required: false
            }]
          }
        ],
        required: !!roomId
      }
    ];

    if (uuid) where.uuid = uuid;
    if (customerId) where.customer_id = customerId;

    const reservations = await db.Reservation.findAll({
      where,
      include,
      attributes: ['uuid', 'created_at', 'type', 'indexed_at']
    });

    return reservations.map(reservation => {
      const rooms = reservation.ReservationRooms
        ?.filter(rr => rr.Room) // Faz o filtro caso traga uma room nula
        ?.map(room => ({
          id: room.Room.id,
          daily_rate: room.daily_rate,
          number_of_days: room.number_of_days,
          reservation_date: room.reservation_date,
          category: {
            id: room.Category.id,
            sub_category: room.Category.SubCategories?.[0] 
              ? { id: room.Category.SubCategories[0].id } 
              : null
          }
        })) || [];

      const total_value = rooms.reduce((sum, room) => {
        return sum + (room.daily_rate * room.number_of_days);
      }, 0);

      return {
        uuid: reservation.uuid,
        created_at: reservation.created_at,
        type: reservation.type,
        indexed_at: reservation.indexed_at,
        customer: {
          id: reservation.Customer.id,
          name: reservation.Customer.name
        },
        rooms,
        total_value
      };
    });
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to retrieve reservations: ' + error.message);
  }
}

module.exports = {
  getReservations
};