// Referencias DOM
const nombreEscritorio = document.querySelector("#nombreEscritorio");
const atendiendoA = document.querySelector("#atendiendoA");
const btnAtender = document.querySelector("#btnAtender");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
nombreEscritorio.innerHTML = escritorio;
divAlerta.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

socket.on("tickets-pendientes", (pendientes) => {
  if (pendientes === 0) {
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "none";
    lblPendientes.innerText = pendientes;
  }
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticket, msg }) => {
    if (!ok) {
      atendiendoA.innerText = `Nadie`;
      return (divAlerta.style.display = "");
    }

    atendiendoA.innerText = `Ticket ${ticket.numero}`;
  });
});
