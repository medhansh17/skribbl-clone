const joinGameBtn = document.getElementById("joingame");
let socket = null;
let roomId = null;

joinGameBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const color = document.getElementById("color").value;
  const rId = document.getElementById("roomId").value;

  if (!name || !color) {
    alert("Please enter your name and color");
    return;
  }
  socket = io();
  let params = [{ name: name, color: color }];
  socket.emit("joinRoom", params, rId);

  socket.on("joinedRoom", (data) => {
    roomId = data.roomId;
    document.getElementById("roomid").value = roomId;
    initializeGame();
    console.log("hee ");
  });

  socket.on("drawData", (data) => {
    const { color } = data;
    ctx.lineWidth = data[3];
    ctx.strokeStyle = color;

    ctx.lineTo(data[1], data[2]);
    ctx.stroke();
    console.log(data);
    console.log("sdf");
  });
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function initializeGame() {
  console.log(document.getElementById("titleScreen"));

  document.getElementById("titleScreen").classList.add("hidden");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let isDrawing = false;
let lineWidth = 5;
let startX = 0;
let startY = 0;

function draw(e) {
  if (!isDrawing) return;

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  console.log(x, y, "here");

  ctx.lineTo(x, y);
  ctx.stroke();
  console.log("fds");

  socket.emit("drawData", { roomId, data: ["#333344", x, y, lineWidth] });
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.stroke();
  ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseleave", () => {
  if (isDrawing) isDrawing = false;
  ctx.stroke();
  ctx.beginPath();
});

canvas.addEventListener("mouseenter", (e) => {
  if (e.buttons) isDrawing = true;
});

canvas.addEventListener("scroll", (e) => {
  e.preventDefault();
  lineWidth += 1;
});
