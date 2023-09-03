// Assuming that ADD_PRODUCT is a function to add a new product
const { ADD_PRODUCT, CHANGE_ORDER_STATUS } = require('../actions/socketio');

const socketIOEvents = (io) => {
    // Event fired whenever a new client connects
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('CHANGE_ORDER_STATUS', async (data) => {
            try {
                const orderStatusUntilChange = await CHANGE_ORDER_STATUS(data);
                
                socket.emit('CHANGE_ORDER_STATUS_TO_USER', orderStatusUntilChange);
            } catch (error) {
                console.error('Error adding product:', error.message);
                // Emit an error event to the client if necessary
                socket.emit('ADD_PRODUCT_ERROR', { error: error.message });
            }
        });

        // Event fired whenever a client disconnects
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

module.exports = socketIOEvents;