require('dotenv').config();
const { PubSub } = require('@google-cloud/pubsub');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const subscriptionNameOrId = process.env.SUBSCRIPTION_NAME;
const timeout = 60;

const pubSubClient = new PubSub({
  keyFilename: path.join(__dirname, 'credenciais.json'),
});

async function processReservation(messageData) {
    const reservation = JSON.parse(messageData.toString());
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      // Inserir ou atualizar na tabela customers
      await client.query(
        'INSERT INTO customers (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name',
        [reservation.customer.id, reservation.customer.name]
      );
  
      // Inserir na tabela reservations com tratamento caso já exista um uuid registrado 
      await client.query(
        `INSERT INTO reservations (uuid, created_at, type, customer_id) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (uuid) DO UPDATE SET 
           created_at = EXCLUDED.created_at,
           type = EXCLUDED.type,
           customer_id = EXCLUDED.customer_id`,
        [reservation.uuid, reservation.created_at, reservation.type, reservation.customer.id]
      );
  
      // Aqui faz o processo para cada room vinda do payload
      for (const room of reservation.rooms) {
        // Inserir na tabela rooms se não existir
        await client.query(
            'INSERT INTO rooms (id) VALUES ($1) ON CONFLICT (id) DO NOTHING',
            [room.id]
        );
  
        // Inserir na tabela category se não existir
        await client.query(
            'INSERT INTO categories (id) VALUES ($1) ON CONFLICT (id) DO NOTHING',
            [room.category.id]
        );
  
        // Inserir na tabela subcategories se não existir
        if (room.category.sub_category) {
            await client.query(
                'INSERT INTO subcategories (id, category_id) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
                [room.category.sub_category.id, room.category.id]
            );
        }
  
        // Deleta os dados na tabela reservation_rooms caso já exista um uuid igual
        // evita o erro de duplicidade
        await client.query(
            'DELETE FROM reservation_rooms WHERE reservation_uuid = $1',
            [reservation.uuid]
        );
  
        // Inserir os dados na tabela reservation_rooms
        await client.query(
          `INSERT INTO reservation_rooms 
          (reservation_uuid, room_id, number_of_days, daily_rate, reservation_date, category_id, sub_category_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            reservation.uuid,
            room.id,
            room.number_of_days,
            room.daily_rate,
            room.reservation_date,
            room.category.id,
            room.category.sub_category ? room.category.sub_category.id : null
          ]
        );
      }
  
      await client.query('COMMIT');
      console.log(`Reservation ${reservation.uuid} processed successfully`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error processing reservation:', error);
      throw error;
    } finally {
      client.release();
    }
  }

function listenForMessages(subscriptionNameOrId, timeout) {
  const subscription = pubSubClient.subscription(subscriptionNameOrId);

  let messageCount = 0;
  const messageHandler = async (message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data.toString()}`);
    messageCount += 1;

    try {
      await processReservation(message.data);
      //Comentar/Descomentar caso queira retornar que recebeu a mensagem e registrou ela
      //message.ack();
    } catch (error) {
      console.error('Failed to process message:', error);
      //Comentar/Descomentar caso queira retornar que a mensagem foi recebida porém não registrada
      //message.nack();
    }
  };

  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}

listenForMessages(subscriptionNameOrId, timeout);