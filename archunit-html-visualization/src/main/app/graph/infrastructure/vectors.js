'use strict';

const defaultCoordinate = Math.sqrt(2) / 2;

const vectors = {
  distance: (vector1, vector2) => Vector.between(vector1, vector2).length(),

  norm: (vector, scale) => Vector.from(vector).norm(scale),

  getRevertedVector: vector => Vector.from(vector).revert(),

  getOrthogonalVector: vector => new Vector(vector.y, -vector.x),

  add: (vector1, vector2) => Vector.from(vector1).add(vector2)
};

const Vector = class {
  constructor(x, y) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error(`Vector must be initialized with numbers 'x' and 'y', but was (${x}, ${y})`);
    }
    this.x = x;
    this.y = y;
  }

  revert() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  revertIf(condition) {
    return condition ? this.revert() : this;
  }

  relativeTo(position) {
    return Vector.from(this).subtract(position);
  }

  isWithinCircle(vector, radius) {
    return Vector.between(this, vector).length() <= radius;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  makeDefaultIfNull() {
    if (this.length() === 0) {
      return this.changeTo(defaultVector);
    }
    return this;
  }

  changeTo(vector) {
    if (isNaN(vector.x) || isNaN(vector.y)) {
      throw new Error(`Vector must be initialized with numbers 'x' and 'y', but was (${vector.x}, ${vector.y})`);
    }
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  add(vector = zeroVector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  scale(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  norm(scale) {
    const length = this.length() || 1;
    return this.scale(scale / length);
  }

  subtract(vector = zeroVector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  equals(otherVector) {
    return Vector.equal(this, otherVector);
  }

  static from(vector) {
    return new Vector(vector.x, vector.y);
  }

  static between(originPoint, targetPoint) {
    return new Vector(targetPoint.x - originPoint.x, targetPoint.y - originPoint.y);
  }

  static equal(vector1, vector2) {
    return vector1.x === vector2.x && vector1.y === vector2.y;
  }
};

const FixableVector = class extends Vector {
  constructor(x, y) {
    super(x, y);
    this._fixed = false;
  }

  fix() {
    this._fixed = true;
    this._updateFixPosition();
  }

  get fixed() {
    return this._fixed;
  }

  unfix() {
    this._fixed = false;
    this.fx = undefined;
    this.fy = undefined;
  }

  _updateFixPosition() {
    if (this._fixed) {
      this.fx = this.x;
      this.fy = this.y;
    }
  }

  changeTo(position) {
    super.changeTo(position);
    this._updateFixPosition();
  }
};

const defaultVector = new Vector(defaultCoordinate, defaultCoordinate);
const zeroVector = new Vector(0, 0);

module.exports = {Vector, FixableVector, vectors};