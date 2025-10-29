function initBuffers(gl) {
    const positionBuffer = initPositionBuffer(gl);
    const textureCoordBuffer = init2DTextureBuffer(gl);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
    };
}

function initPositionBuffer(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    //const positions = [-1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    const positions = [
        -0.5,  0.5,
        0.5,  0.5,
       -0.5, -0.5,
       -0.5, -0.5,
        0.5,  0.5,
        0.5, -0.5,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}

function init2DTextureBuffer(gl) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ];

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW,
    );

    return textureCoordBuffer;
}

export { initBuffers };