// dynamically build common ui elements
function createPopup(x, y, width, height) {
    let popupContainer = document.createElement("div");
    popupContainer.style.position = "absolute";
    popupContainer.style.width = `${width}px`;
    popupContainer.style.height = `${height}px`;
    popupContainer.style.left = `${x}px`;
    popupContainer.style.top = `${y}px`;

    return popupContainer;
}

function getPopupHeader(headerText) {
    let popupHeaderContainer = document.createElement("div");
    popupHeaderContainer.style.width="100%";
    popupHeaderContainer.innerHTML=`<h3>${headerText}</h3>`;
    return popupHeaderContainer;
}

function getPopupCancelButton(popupId) {
    let popupCancelButton = document.createElement("button");
    popupCancelButton.addEventListener("click", function(e) {
        document.getElementById(popupId).remove();
    });
    return popupCancelButton;
}

function getFlexContainer(width = "100%", direction = "row", justifyContent = "flex-start", alignItems = "center") {
    let flexContainer = document.createElement("div");
    flexContainer.style.width=width;
    flexContainer.style.flexDirection=direction;
    flexContainer.style.justifyContent=justifyContent;
    flexContainer.style.alignItems=alignItems;
    flexContainer.style.display="flex";
    return flexContainer;
}

export { createPopup, getPopupHeader, getPopupCancelButton, getFlexContainer };