﻿/**
 * Helpful camera class that holds transformation matrices and transformation utilities, simulating camera/eye
 * @author Goran Antic
 */

/**
 * Contructor for Camera. Sets projection properties, calculates horizontal field of view, 
 * and inits projection and model-view matrix as well as camera position in scene space.
 * @param {Number} verFoV - vertical field of view
 * @param {Number} aspect - aspect ratio of view
 * @param {Number} nearPlane - near plane of view frustum
 * @param {Number} farPlane - far plane of view frustum
 * @param {Number[3]} position - camera position in 3D space
 */
Camera = function (verFoV, aspect, nearPlane, farPlane, position) {
    this.verFoV = verFoV;
    this.horFoV = verFoV * aspect;

    this.aspect = aspect;
    this.nearPlane = nearPlane;
    this.farPlane = farPlane;

    mat4.perspective(verFoV, aspect, nearPlane, farPlane, this.pMatrix);
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, this.mvMatrix, position);

    this.position = position;
}

Camera.prototype = {
    verFoV: 0,
    horFoV: 0,

    aspect: 0,
    nearPlane: 0.0,
    farPlane: 0.0,

    pMatrix: mat4.create(),
    mvMatrix: mat4.create(),

    position: null,

    constructor: Camera,

    /**
     * Changes perspective matrix by given width and height
     * @param {Number} width
     * @param {Number} height
     */
    changePerspective: function (width, height) {
        this.aspect = width / height;
        mat4.perspective(this.verFoV, this.aspect, this.nearPlane, this.farPlane, this.pMatrix);
        this.horFoV = this.verFoV * this.aspect;
    },

    /**
     * Should unproject a click from a screen (near plane) to paralel plane defined with objects z position.
     * @param {Number} xPercentage - percentage of horizontal field of view (half of it) which is clicked
     * @param {Number} yPercentage - percentage of vertical field of view (half of it) which is clicked
     * @param {Number} objectZ - object z coordinate in space
     * @type {Number[2]} returns array containing x and y clicked coordinates on z plane
     */
    getClickVectorHorizontal: function (xPercentage, yPercentage, objectZ) {
        //get angles by percentage of field of view angles. Half is because we need a triangle with z as side
        var hor = (xPercentage * this.horFoV / 2),
            ver = (yPercentage * this.verFoV / 2);
        //Math.sin uses radians, so we need to convert degrees
        hor *= (Math.PI / 180);
        ver *= (Math.PI / 180);
        //get coordinates on near plane
        var xNear = this.nearPlane * Math.sin(hor) / Math.cos(hor);
        var yNear = -this.nearPlane * Math.sin(ver) / Math.cos(ver);
        //return xNear;
        return [
            xNear * (-this.position[2]-objectZ),
            yNear * (-this.position[2] - objectZ)
        ];
    }
}