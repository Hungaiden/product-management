import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
var socket = io();

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if(formChat) {
  formChat.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = formChat.content.value;
    if(content) {
      const data = {
        content: content
      };

      socket.emit("CLIENT_SEND_MESSAGE", data);
      formChat.content.value = "";
    }
  })
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector(".chat").getAttribute("my-id"); 
  const body = document.querySelector(".chat .inner-body");

  let htmlFullName = ``;
  const div = document.createElement("div");
  if(myId == data.userId) {
    div.classList.add("inner-outgoing");
  }
  else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class = "inner-name">${data.fullName}</div>`
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class = "inner-content">${data.content}</div>
  `

  body.appendChild(div);

  bodyChat.scrollTop = bodyChat.scrollHeight;
});
// End SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom


// Show icon
const emojiPicker = document.querySelector("emoji-picker");

if(emojiPicker) {
  const buttonIcon = document.querySelector('.chat .inner-form .button-icon');
  const tooltip = document.querySelector('.tooltip');

  Popper.createPopper(buttonIcon, tooltip);

  console.log(buttonIcon);
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown');
  });

  const inputChat = document.querySelector(".chat .inner-form input[name='content']");
  emojiPicker.addEventListener('emoji-click', (event) => {
    emojiPicker.addEventListener('emoji-click', event => {
      inputChat.value = inputChat.value + event.detail.unicode;
    });
  });
}
// end show icon  