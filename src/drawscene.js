function drawScene(gl, programInfo, buffers, sequence, time, delta) { // isPlaying
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    
    const projectionMatrix = mat4.create();
    //mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4.ortho(projectionMatrix, -1 , 1, -1 , 1, .1, 100);

    for(let i = 0; i < sequence.length; i++) {
        let curLayer = sequence[i];

        if(curLayer.length > 0) {
            for(let j = 0; j < curLayer.length; j++) {
                let curClip = curLayer[j]
                if(time >= curClip.startTime && time <= (curClip.startTime + curClip.length) && curClip.clipType == "image") {
                    gl.depthMask(false);
                    gl.enable(gl.BLEND);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    drawPlane(gl, projectionMatrix, programInfo, buffers, {x:0, y:0}, curClip, time, i + 1);
                    gl.depthMask(true);
                }
            }
        }
    }
}

function drawPlane(gl, projection, programInfo, buffers, position, sequenceItem, time, layer) {
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [position.x, position.y, -.1 * layer]);

    setPositionAttribute(gl, buffers, programInfo);
    setTextureAttribute(gl, buffers, programInfo);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projection,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sequenceItem.texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    gl.uniform1i(programInfo.uniformLocations.transitionType, sequenceItem.transitionType);
    gl.uniform1i(programInfo.uniformLocations.fadeInTransitionType, sequenceItem.fadeInTransitionType);
    gl.uniform1i(programInfo.uniformLocations.sequenceIndex, sequenceItem.id + 1);
    gl.uniform1i(programInfo.uniformLocations.clipEffect, sequenceItem.clipEffect);
    gl.uniform1f(programInfo.uniformLocations.clipEffectIntensity, sequenceItem.clipEffectIntensity);
    gl.uniform1f(programInfo.uniformLocations.time, time);
    gl.uniform1f(programInfo.uniformLocations.transitionTime, sequenceItem.transitionTime);
    gl.uniform1i(programInfo.uniformLocations.transitionFadeType , sequenceItem.transitionFadeType == true ? 1 : 0);
    gl.uniform1i(programInfo.uniformLocations.clipEffectControlAlpha , sequenceItem.clipEffectControlAlpha == true ? 1 : 0);
    gl.uniform1f(programInfo.uniformLocations.fadeInTransitionTime, sequenceItem.fadeInTransitionTime);
    gl.uniform1f(programInfo.uniformLocations.fractalX, sequenceItem.fractalX);
    gl.uniform1f(programInfo.uniformLocations.fractalY, sequenceItem.fractalY);
    gl.uniform1f(programInfo.uniformLocations.fractalInitialZoom, sequenceItem.fractalInitialZoom);
    gl.uniform1f(programInfo.uniformLocations.sequenceItemLength, sequenceItem.length);
    gl.uniform1f(programInfo.uniformLocations.sequenceItemStartTime, sequenceItem.startTime);
    if(sequenceItem.colorThreshold && sequenceItem.colorThreshold.length == 3) {
        gl.uniform3f(programInfo.uniformLocations.colorThreshold, sequenceItem.colorThreshold[0], sequenceItem.colorThreshold[1], sequenceItem.colorThreshold[2]);
    }

    if(sequenceItem.fadeInColorThreshold && sequenceItem.fadeInColorThreshold.length == 3) {
        gl.uniform3f(programInfo.uniformLocations.fadeInColorThreshold, sequenceItem.fadeInColorThreshold[0], sequenceItem.fadeInColorThreshold[1], sequenceItem.fadeInColorThreshold[2]);
    }

    {
        const offset = 0;
        const vertexCount = 6;
        gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
    }
}

function setTextureAttribute(gl, buffers, programInfo) {
    const num = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      num,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

export { drawScene };