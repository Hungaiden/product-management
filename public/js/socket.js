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
      console.log(data);
      socket.emit("CLIENT_SEND_MESSAGE", data);
      formChat.content.value = "";
    }
  })
}
// End CLIENT_SEND_MESSAGE
// End CLIENT_SEND_MESSAGE
// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    console.log(data);
  })
  // End SERVER_RETURN_MESSAGE