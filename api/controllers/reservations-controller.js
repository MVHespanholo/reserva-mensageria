const reservationsService = require('../services/reservations-service');
const { getReservations } = require('../schemas/reservations-schema');

async function list(req, res) {
  try {
    const { error } = getReservations.validate(req.query);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details.map(d => d.message) 
      });
    }

    const { uuid, customer_id, room_id } = req.query;
    const reservations = await reservationsService.getReservations({
      uuid,
      customerId: customer_id,
      roomId: room_id
    });

    if (reservations.length === 0) {
      let message = 'No reservations found';
      if (uuid) message += ` with UUID: ${uuid}`;
      if (customer_id) message += ` for customer ID: ${customer_id}`;
      if (room_id) message += ` for room ID: ${room_id}`;
      
      return res.status(404).json({ 
        message        
      });
    }


    res.json(reservations);
    
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

module.exports = {
  list
};