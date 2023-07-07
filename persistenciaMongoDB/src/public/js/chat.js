const socket = io();

const input = document.getElementById("textbox");
const inputEmail = document.getElementById("inputemail");
const log = document.getElementById("log");

function validarEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

inputEmail.addEventListener("blur", () => {
  const email = inputEmail.value.trim();
  if (!validarEmail(email)) {
    alert("Por favor, ingrese un email válido");
    inputEmail.focus();
  }
});

input.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter" ) {
    socket.emit("message", { email: inputEmail.value, message: input.value });
    input.value = "";
    inputEmail.value = "";
  }
});

socket.on("log", (data) => {
  let logs = "";
  console.log(data);
  data.logs.forEach((log) => {
    logs += `${log.email} dice: ${log.message} <br/>`;
  });
  log.innerHTML = logs;
});
