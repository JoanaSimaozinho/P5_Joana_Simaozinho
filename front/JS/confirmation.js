const idCmd = new URL(window.location.href).searchParams.get("id");
const cmdIdElt = document.getElementById("orderId");
if (cmdIdElt) {
  cmdIdElt.textContent = idCmd;
}
