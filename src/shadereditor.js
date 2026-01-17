import { createPopup, getPopupHeader, getPopupCancelButton, getFlexContainer } from "./jakehui.js";

const addNodeButtonId = "addNodeButton";
const shaderEditorPanelId = "shaderEditor";
const viewportPanelId = "shaderViewport";
const nodeSelectionPopupId = "nodeSelectionPopup";
const canvasWidthInputId = "canvasWidthInput";
const canvasHeightInputId = "canvasHeightInput";
const canvasId = "shaderEditorCanvas";
const nodeTypes = ["select type", "builtIn", "sampler", "math", "color"];
let selectedShaderIndex = 0;
let selectedShaderNode = undefined;
let selectedShaderNodeConnection = undefined;
let selectedShaderNodeConnectionWire = undefined;
let initialShaderNodeSelectionPosition = [];
let initialShaderNodeConnectionSelectionPosition = [];
let initialShaderNodeConnectionPosition = [];
let initialShaderNodePosition = [];
let initialShaderNodeSize = [];
let shaders = [
    {
        shaderName: "",
        nodes:[]
    }
];

// editor functions
function createNewShader() {
    return {
        shaderName: "",
        nodes:[]
    }
}

function addNewNodeToEditor(nodeType) {
    let shaderEditorPanel = getShaderEditorPanelElement();
    // let shaderNode = createPopup(shaderEditorPanel.offsetLeft + shaderEditorPanel.offsetWidth / 2, shaderEditorPanel.offsetTop + shaderEditorPanel.offsetHeight / 4, 300, 300);
    let shaderNode = createPopup(shaderEditorPanel.offsetWidth / 2, shaderEditorPanel.offsetHeight / 4, 75, 100);
    shaderNode.style.position="relative";
    let nodeContainerContent = getFlexContainer("300px", "column");
    shaderNode.style.background="white";
    let nodeData = createNewNode(nodeType);
    let nodeConnection = document.createElement("div");
    nodeConnection.className="nodeConnection";
    console.warn(shaderNode.offsetWidth);
    nodeConnection.style.left=`${+(shaderNode.style.width.replace("px", ""))-5}px`;
    shaderNode.appendChild(nodeConnection);
    shaders[selectedShaderIndex].nodes.push(nodeData);
    shaderNode.id=`node-${shaders[selectedShaderIndex].nodes.length}`;
    shaderNode.appendChild(nodeContainerContent);
    shaderEditorPanel.appendChild(shaderNode);
    shaderNode.addEventListener("pointerdown", function(e) {
        if(e.target.id.includes("node")) {
            selectedShaderNode = e.target;
            initialShaderNodeSelectionPosition = [e.clientX, e.clientY];
            initialShaderNodePosition = [e.target.getBoundingClientRect().x, e.target.getBoundingClientRect().y];
            initialShaderNodeSize = [e.target.getBoundingClientRect().width, e.target.getBoundingClientRect().height];
        } else if(e.target.className.includes("nodeConnection")) {
            selectedShaderNodeConnection = e.target;
            initialShaderNodeConnectionSelectionPosition = [e.clientX, e.clientY];
            initialShaderNodeConnectionPosition = [e.target.getBoundingClientRect().x, e.target.getBoundingClientRect().y];
            console.warn(initialShaderNodeConnectionPosition);
            console.warn(initialShaderNodeConnectionSelectionPosition);
            let newNodeWire = document.createElement("div");
            newNodeWire.style.top = selectedShaderNodeConnection.style.top;
            newNodeWire.style.left = selectedShaderNodeConnection.style.left;
            newNodeWire.className="nodeWire";
            e.target.parentElement.appendChild(newNodeWire);
            selectedShaderNodeConnectionWire = newNodeWire;
        }
    });
}

function createNewNode(nodeType) {
    return {
        nodeType: nodeType,
        inputs: [], // input can either be manually set or take value of node
        outputs: [],
        value: ""
    }
}

function compileShader() {
    // each node is like a method call
    // find what unique methos to add to shader file
    // traverse through connections to build main method of other method calls
}

// ui functions
function showNodeSelectionPopup() {
    let shaderEditorPanel = getShaderEditorPanelElement();
    let newPopup = createPopup(shaderEditorPanel.offsetLeft + shaderEditorPanel.offsetWidth / 2, shaderEditorPanel.offsetTop + shaderEditorPanel.offsetHeight / 4, 300, 150);
    let popupHeader = getPopupHeader("Add New Node");
    let popupFooter = getFlexContainer("100%", "row", "flex-start", "center");
    newPopup.id = nodeSelectionPopupId;
    let popupCancelButton = getPopupCancelButton(nodeSelectionPopupId);
    popupFooter.appendChild(popupCancelButton);
    newPopup.appendChild(popupHeader);
    newPopup.appendChild(getNodeSelectionForm());
    newPopup.appendChild(popupFooter);
    shaderEditorPanel.appendChild(newPopup);
}

function hideNodeSelectionPopup() {
    document.getElementById(nodeSelectionPopupId).remove();
}

function getShaderEditorPanelElement() {
    return document.getElementById(shaderEditorPanelId);
}

function getCanvasElement() {
    return document.getElementById(canvasId);
}

function getNodeSelectionForm() {
    let nodeSelectionForm = document.createElement("div");
    let nodeTypeInput = document.createElement("select");
    for(let i = 0; i < nodeTypes.length; i++) {
        let nodeTypeOption = document.createElement("option");
        nodeTypeOption.innerHTML=nodeTypes[i];
        nodeTypeOption.value = i;
        nodeTypeInput.appendChild(nodeTypeOption);
    }

    nodeTypeInput.addEventListener("change", function(e) {
        addNewNodeToEditor(e.target.value);
        hideNodeSelectionPopup();
    });

    nodeSelectionForm.appendChild(nodeTypeInput);

    return nodeSelectionForm;
}

function moveSelectedShaderNode(pointerEvent) {
    let initialXOffset = initialShaderNodeSelectionPosition[0] - initialShaderNodePosition[0];
    let initialYOffset = initialShaderNodeSelectionPosition[1] - initialShaderNodePosition[1];
// need to do some funky tricks to get it to go under the other panels and initiate overflow in the workspace
    selectedShaderNode.style.left=`${(pointerEvent.clientX - getShaderEditorPanelElement().offsetLeft) - initialXOffset}px`;
    selectedShaderNode.style.top=`${(pointerEvent.clientY - getShaderEditorPanelElement().offsetTop) - initialYOffset}px`;
}

function getMathForm() {
    let formContainer = document.createElement("div");
}

// event handlers for static elements
document.getElementById(addNodeButtonId).addEventListener("click", showNodeSelectionPopup);
window.addEventListener("pointermove", function(e) {
    if(selectedShaderNode) {
        moveSelectedShaderNode(e);
    } else if(selectedShaderNodeConnection && selectedShaderNodeConnectionWire) {
        selectedShaderNodeConnectionWire.style.width = e.clientX - initialShaderNodeConnectionSelectionPosition[0];
        selectedShaderNodeConnectionWire.style.height = e.clientY - initialShaderNodeConnectionSelectionPosition[1];
        //console.warn(`${},${}`)
    }
});

window.addEventListener("pointerup", function(e) { // if mouseup over another nodeConnection, complete, else terminate and destroy wire/
    console.warn("resetting selected node");
    selectedShaderNode = undefined;
    initialShaderNodeSelectionPosition = [];
    initialShaderNodePosition = []
    initialShaderNodeConnectionPosition = [];
    initialShaderNodeConnectionSelectionPosition = [];
    selectedShaderNodeConnection = undefined;
    selectedShaderNodeConnectionWire = undefined;
    console.warn(e.target.id);
});

document.getElementById(canvasHeightInputId).addEventListener("change", function(e) {
    getCanvasElement().style.height=`${e.target.value}px`;
});

document.getElementById(canvasWidthInputId).addEventListener("change", function(e) {
    getCanvasElement().style.width=`${e.target.value}px`;
});