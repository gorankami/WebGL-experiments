﻿/**
 * ShaderProgram is a container of a openGL (WebGL) program with various utilites for creating a shader, using attributes, uniforms and buffers etc
 */


/**
 * ShaderProgram constructor. It creates and builds fragment and vertex shaders right away, then sets up attributes, 
 * uniforms and buffers that can be easily accessed while the program runs
 * @param {String} type - type of shader. For now "Color" and "FEMWireframe" are implemented for the use of a FEM application
 * @type {object} - returns a GL shader program object
 */
ShaderProgram = function ShaderProgram(type) {
    var vertexShader = null;
    var fragmentShader = null;
    switch (type) {
        case "Colors":
            vertexShader = this.createShader(this.getVertexShaderColorsSource(), gl.VERTEX_SHADER);
            fragmentShader = this.createShader(this.getFragmentShaderColorsSource(), gl.FRAGMENT_SHADER);
            break;
        case "Uniform":
            vertexShader = this.createShader(this.getVertexShaderUniformSource(), gl.VERTEX_SHADER);
            fragmentShader = this.createShader(this.getFragmentShaderUniformSource(), gl.FRAGMENT_SHADER);
            break;
        default:
            return null;
    }
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }
    gl.useProgram(program);

    program.attributes = {
        position: gl.getAttribLocation(program, "aVertexPosition")
    };

    if (type == "Colors"){
        program.attributes.color = gl.getAttribLocation(program, "aVertexColor");
    }
    
    program.uniforms = {
        mvMatrix: gl.getUniformLocation(program, "uMVMatrix"),
        pMatrix: gl.getUniformLocation(program, "uPMatrix")
    };

    program.buffers = {
        vertex: gl.createBuffer(),
        index: gl.createBuffer()
    };

    if (type == "Colors") {
        program.buffers.color = gl.createBuffer();
    }

    return program;
}

ShaderProgram.prototype = {
    constructor: ShaderProgram,
    program: null,

    /**
     * Creates a shader from source
     * @param {String} src - source code for shader
     * @param {Number} type - enumerated type of shader, can be gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @type {object}
     */
    createShader: function (src, type) {
        //compile the vertex shader
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
        }
        return shader;
    },

    //Color
    /**
     * Retreives a source for vertex shader for colored vertices material
     * @type {String} - source code
     */
    getVertexShaderColorsSource: function () {
        return [
            "attribute vec3 aVertexPosition;",
            "attribute vec3 aVertexColor;",
            "uniform mat4 uMVMatrix;",
            "uniform mat4 uPMatrix;",
            "varying highp vec4 vColor;",
            "void main(void) {",
            "  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
            "  vColor = vec4(aVertexColor, 1.0);",
            "}"
        ].join("\n");
    },

    /**
     * Retreives a source for fragment shader for colored vertices material
     * @type {String} - source code
     */
    getFragmentShaderColorsSource: function () {
        return [
            "varying highp vec4 vColor;",
			"void main(void) {",
            "   gl_FragColor = vColor;",
            "}"
        ].join("\n");
    },

    //FEMWireframe
    /**
     * Retreives a source for vertex shader for wireframed vertices material
     * @type {String} - source code
     */
    getVertexShaderUniformSource: function () {
        return [
            "attribute vec3 aVertexPosition;",
            "uniform mat4 uMVMatrix;",
            "uniform mat4 uPMatrix;",
            "void main(void) {",
            "  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
            "}"
        ].join("\n");
    },
    /**
     * Retreives a source for fragment shader for wireframed vertices material
     * @type {String} - source code
     */
    getFragmentShaderUniformSource: function () {
        return [
			"void main(void) {",
            "   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
            "}"
        ].join("\n");
    }

}
