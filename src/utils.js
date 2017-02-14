// @flow
/* eslint-disable import/prefer-default-export */

// The `merge` function provides simple property merging.
export const merge = (src, dest, overwrite) => {
    // Do nothing if neither are true objects.
  if (Array.isArray(src) || Array.isArray(dest) || typeof src !== 'object' || typeof dest !== 'object') {
    return dest;
  }

  // Default overwriting of existing properties to false.
  overwrite = overwrite || false;

  for (const key in src) {
    // Only copy properties, not functions.
    if (typeof src[key] !== 'function' && (!dest[key] || overwrite)) {
      dest[key] = src[key];
    }
  }

  return dest;
};

  // SVG arc math
const angleToX = (percent, radius) => {
  return radius * Math.cos(2 * Math.PI * percent);
};
const angleToY = (percent, radius) => {
  return radius * Math.sin(2 * Math.PI * percent);
};
const makeArcPath = (startPercent, endPercent, radius) => {
  return `M ${angleToX(startPercent, radius)} ${angleToY(startPercent, radius)} A ${radius} ${radius} 0 0 0 ${angleToX(endPercent, radius)} ${angleToY(endPercent, radius)}`;
};
export const Arcs = {
  n4: makeArcPath(7 / 8, 5 / 8, 36),
  s4: makeArcPath(3 / 8, 1 / 8, 36),
  e4: makeArcPath(1 / 8, -1 / 8, 36),
  w4: makeArcPath(5 / 8, 3 / 8, 36),
  inport: makeArcPath(-1 / 4, 1 / 4, 4),
  outport: makeArcPath(1 / 4, -1 / 4, 4),
  inportBig: makeArcPath(-1 / 4, 1 / 4, 6),
  outportBig: makeArcPath(1 / 4, -1 / 4, 6)
};
