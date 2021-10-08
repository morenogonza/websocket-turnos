// Referencias al DOM
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCrear = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  btnCrear.disabled = false;
});

socket.on("disconnect", () => {
  btnCrear.disabled = true;
});

socket.on("ultimo-ticket", (ulitmo) => {
  console.log("Evento ultimo-ticket");
  lblNuevoTicket.innerText = "Ticket " + ulitmo;
});

socket.on("enviar-mensaje", (payload) => {
  console.log(payload);
});

btnCrear.addEventListener("click", () => {
  socket.emit("siguiente-ticket", null, (ticket) => {
    lblNuevoTicket.innerText = ticket;
  });
});
