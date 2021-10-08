const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControll {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.tickets = [];
    this.ultimos4 = [];

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  init() {
    const { hoy, tickets, ultimo, ultimos4 } = require("../db/data.json");

    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimos4 = ultimos4;
    } else {
      // Es otro día
      this.guardarDb();
    }
  }

  guardarDb() {
    const dbPath = path.join(__dirname, "../db/data.json");

    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  siguienteTicket() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);

    this.tickets.push(ticket);
    this.guardarDb();

    return "Ticket " + ticket.numero;
  }

  atenderTicket(escritorio) {
    // si no hay tickets
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets[0];
    this.tickets.shift(); // remueve el primer elemento del array tickets se puede hacer asi ----> const ticket = this.tickets.shift() porque shift remueve el primer elemento y lo devuelve

    ticket.escritorio = escritorio;

    this.ultimos4.unshift(ticket);

    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1);
    }

    console.log(this.ultimos4);
    this.guardarDb();

    return ticket;
  }
}

module.exports = TicketControll;
