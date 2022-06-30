//Un numero de commande unique doit s'afficher
//Recuperer un numero de commande qui n'est pas stocké nulle part

const idCmd = new URL(window.location.href).searchParams.get("id");
const cmdIdElt = document.getElementById("orderId");
if (cmdIdElt) {
  cmdIdElt.textContent = idCmd;
}
