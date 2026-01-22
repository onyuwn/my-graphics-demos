import { select } from "three/tsl";
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
    let shaderNode = createPopup(shaderEditorPanel.offsetWidth / 2, shaderEditorPanel.offsetHeight / 2, 150, 200);
    shaderNode.style.position="relative";
    let nodeContainerContent = getFlexContainer("300px", "column");
    shaderNode.style.background="white";
    let nodeData = createNewNode(nodeType);
    shaders[selectedShaderIndex].nodes.push(nodeData);
    shaderNode.id=`node-${shaders[selectedShaderIndex].nodes.length-1}-${nodeType}`;
    nodeContainerContent.id=`nodeContent-${shaders[selectedShaderIndex].nodes.length}-${nodeType}`;
    if(nodeType == 3) {
        let nodeContent = getMathForm(nodeContainerContent.id);
        nodeContainerContent.appendChild(nodeContent);
    }
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
            let newNodeWire = document.createElementNS('http://www.w3.org/2000/svg', "svg");
            let nodeWirePath = document.createElementNS('http://www.w3.org/2000/svg', "path");
            newNodeWire.appendChild(nodeWirePath);
            newNodeWire.style.position = "absolute";
            // newNodeWire.style.left = getShaderEditorPanelElement().offsetLeft;
            // newNodeWire.style.top = getShaderEditorPanelElement().offsetTop;
            newNodeWire.style.width = getShaderEditorPanelElement().offsetWidth;
            newNodeWire.style.height = getShaderEditorPanelElement().offsetHeight;
            e.target.parentElement.appendChild(newNodeWire);
            selectedShaderNodeConnectionWire = newNodeWire;
        }
    });
}

function createNewNode(nodeType) {
    return {
        nodeType: nodeType,
        inputs: [], // input can either be manually set or take value of node
        output: {
            type:"",
            value: undefined
        },
        position: {
            x: 0,
            y: 0
        },
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
    newPopup.style.background="rgba(255,255,255,.75)";
    let popupCancelButton = getPopupCancelButton(nodeSelectionPopupId);
    popupCancelButton.innerHTML="Cancel";
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
    let initialYOffset = initialShaderNodeSelectionPosition[1] - initialShaderNodePosition[1] + 50; // plus panel toolbar height since nodes are positioned relative
    // console.warn(`${pointerEvent.clientY} - ${getShaderEditorPanelElement().offsetTop} - ${initialYOffset}`)
// need to do some funky tricks to get it to go under the other panels and initiate overflow in the workspace
    selectedShaderNode.style.left=`${(pointerEvent.clientX - getShaderEditorPanelElement().offsetLeft) - initialXOffset}px`;
    selectedShaderNode.style.top=`${(pointerEvent.clientY - getShaderEditorPanelElement().offsetTop) - initialYOffset}px`;
}

function getMathForm(nodeContentContainerId) {
    let mathOperationTypes = ['select math operation', 'add', 'subtract', 'divide', 'multiply', 'exponent', 'modulus', 'cosine',
                              'sine', 'tangent', 'arccos', 'arcsin', 'arctan'];
    let formContainer = getFlexContainer(undefined, "column", "flex-start");
    let operationsInputContainer = getFlexContainer();
    let operationsInput = document.createElement("select");
    let operationsInputLabel = document.createElement("p");
    operationsInputContainer.appendChild(operationsInputLabel);
    operationsInputContainer.appendChild(operationsInput);
    operationsInputLabel.innerHTML="operation";
    for(let i = 0; i < mathOperationTypes.length; i++) {
        let operationOption = document.createElement("option");
        operationOption.innerHTML = mathOperationTypes[i];
        operationOption.value = i;
        operationsInput.appendChild(operationOption);
    }
    formContainer.appendChild(operationsInputContainer);
    let operationsContainer = getFlexContainer(undefined, "column", "flex-start");
    formContainer.appendChild(operationsContainer);
    operationsContainer.id=`${nodeContentContainerId}-operationsContainer`;
    operationsInput.addEventListener("change", function(e) {
        // update further inputs and outputs?
        operationsContainer.innerHTML = "";
        // build form based on operation
        if(e.target.value == 1) { // addition
            let nodeObj = getNodeByElementId(nodeContentContainerId);
            nodeObj.inputs = [{type: "number", value: 0}, {type: "number", value: 0}];
            let nodeInputContainer1 = getFlexContainer();
            let nodeInputContainer2 = getFlexContainer();
            let nodeInput1Connection = document.createElement("div");
            nodeInput1Connection.className="nodeConnection";
            nodeInput1Connection.style.left = '-5px';
            let aLabel = document.createElement("p");
            aLabel.innerHTML = "A";
            let aInput = document.createElement("input");
            aInput.type = "number";
            let nodeInput2Connection = document.createElement("div");
            nodeInput2Connection.className="nodeConnection";
            nodeInput2Connection.style.left = '-5px';
            let bLabel = document.createElement("p");
            bLabel.innerHTML = "B";
            let bInput = document.createElement("input");
            bInput.type = "number";
            nodeInputContainer1.appendChild(nodeInput1Connection);
            nodeInputContainer1.appendChild(aLabel);
            nodeInputContainer1.appendChild(aInput);
            nodeInputContainer2.appendChild(nodeInput2Connection);
            nodeInputContainer2.appendChild(bLabel);
            nodeInputContainer2.appendChild(bInput);
            operationsContainer.appendChild(nodeInputContainer1);
            operationsContainer.appendChild(nodeInputContainer2);
        } else {

        }
        let resultNodeConnection = document.createElement("div");
        resultNodeConnection.className="nodeConnection";
        resultNodeConnection.style.right = '-5px';
        operationsContainer.appendChild(resultNodeConnection);
    });

    return formContainer;
}

function getNodeByElementId(id) {
    // parse id return node
    let parts = id.split("-");
    if(parts.length >= 3) {
        let nodeIdx = +(parts[1]) - 1; 
        let nodeConnectionIdx = +(parts[2]) - 1;
        console.warn(shaders[selectedShaderIndex].nodes);
        console.warn(parts);
        return shaders[selectedShaderIndex].nodes[nodeIdx];
    } else {
        return undefined;
    }
}

function getNodeInputByElementId(id) {
    // parse id return node
    let parts = id.split("-");
    if(parts.length >= 3) {
        let nodeIdx = +(parts[1]) - 1; 
        let nodeConnectionIdx = +(parts[2]) - 1;
        return shaders[selectedShaderIndex].nodes[nodeIdx].inputs[nodeConnectionIdx];
    } else {
        return undefined;
    }
}

// event handlers for static elements
document.getElementById(addNodeButtonId).addEventListener("click", showNodeSelectionPopup);
window.addEventListener("pointermove", function(e) {
    if(selectedShaderNode) {
        moveSelectedShaderNode(e);
    } else if(selectedShaderNodeConnection && selectedShaderNodeConnectionWire) {
        let newWidth = e.clientX - initialShaderNodeConnectionSelectionPosition[0];
        let newHeight = e.clientY - initialShaderNodeConnectionSelectionPosition[1];
        let viewBox =`0 0 ${getShaderEditorPanelElement().offsetWidth} ${getShaderEditorPanelElement().offsetHeight}`;
        selectedShaderNodeConnectionWire.setAttribute('viewBox', viewBox);
        let path = selectedShaderNodeConnectionWire.children.item(0);
        path.setAttribute('stroke', 'red');
        path.setAttribute('stroke-width', '20');
        let d = `
            M ${initialShaderNodeConnectionSelectionPosition[0] - getShaderEditorPanelElement().offsetLeft},${initialShaderNodeConnectionSelectionPosition[1] - getShaderEditorPanelElement().offsetTop}
            L ${e.clientX - getShaderEditorPanelElement().offsetLeft},${e.clientY - getShaderEditorPanelElement().offsetTop}`;
        // d = `
        // M 5,5 
        // L 5,5`;
        path.setAttribute('d', d)
    }
});

window.addEventListener("pointerup", function(e) { // if mouseup over another nodeConnection, complete, else terminate and destroy wire/
    if(e.target.className=="nodeConnection") {
        // persist and update node data
        console.warn("pointer up on:");
        console.warn(e.target.id);
        console.warn(e.target.parentElement.id);
        let curSelectedOutput = getNodeByElementId(selectedShaderNodeConnection.parentElement.id);
        let selectedNodeInput = getNodeInputByElementId(e.target.parentElement.id);
        if(selectedNodeInput.type == curSelectedOutput.output.type) {
            selectedNodeInput.value = curSelectedOutput.output.value; // todo else show warning type mismatch
        }
        selectedShaderNodeConnectionWire = undefined;
    } else if(selectedShaderNodeConnectionWire) {
        selectedShaderNodeConnectionWire.remove();
    }
    selectedShaderNode = undefined;
    initialShaderNodeSelectionPosition = [];
    initialShaderNodePosition = []
    initialShaderNodeConnectionPosition = [];
    initialShaderNodeConnectionSelectionPosition = [];
    selectedShaderNodeConnection = undefined;
});

document.getElementById(canvasHeightInputId).addEventListener("change", function(e) {
    getCanvasElement().style.height=`${e.target.value}px`;
});

document.getElementById(canvasWidthInputId).addEventListener("change", function(e) {
    getCanvasElement().style.width=`${e.target.value}px`;
});