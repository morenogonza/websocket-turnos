const TicketControll = require("../models/ticket-controll");

const ticketControll = new TicketControll();

const socketController = (socket) => {
  // Esto se ejecuta cuando un cliente se conecta
  socket.emit("ultimo-ticket", ticketControll.ultimo);
  socket.emit("ultimos-tickets", ticketControll.ultimos4);
  socket.emit("tickets-pendientes", ticketControll.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControll.siguienteTicket();
    callback(siguiente);
    socket.broadcast.emit("tickets-pendientes", ticketControll.tickets.length);
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }

    const ticket = ticketControll.atenderTicket(escritorio);

    socket.broadcast.emit("ultimos-tickets", ticketControll.ultimos4);
    socket.broadcast.emit("tickets-pendientes", ticketControll.tickets.length);
    socket.emit("tickets-pendientes", ticketControll.tickets.length);

    if (!ticket) {
      callback({
        ok: false,
        msg: "No hay tickets pendientes",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
