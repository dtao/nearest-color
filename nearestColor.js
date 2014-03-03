(function(context) {

  // Expect Color to be defined if we're in the browser.
  var Color = context.Color;

  // If we're in Node, load it here.
  if (typeof Color === 'undefined' && typeof require === 'function') {
    Color = require('color');
  }

  /**
   * Defines an available color.
   *
   * @typedef {Object} ColorSpec
   * @property {string=} name A name for the color, e.g., 'red'
   * @property {string} source The hex-based color string, e.g., '#FF0'
   * @property {RGB} rgb The {@link RGB} color values
   */

  /**
   * Describes a matched color.
   *
   * @typedef {Object} ColorMatch
   * @property {string} name The name of the matched color, e.g., 'red'
   * @property {string} value The hex-based color string, e.g., '#FF0'
   */

  /**
   * Provides the RGB breakdown of a color.
   *
   * @typedef {Object} RGB
   * @property {number} r The red component, from 0 to 255
   * @property {number} g The green component, from 0 to 255
   * @property {number} b The blue component, from 0 to 255
   */

  /**
   * Gets the nearest color, from the given list of {@link ColorSpec} objects
   * (which defaults to {@link nearestColor.DEFAULT_COLORS}).
   *
   * Probably you wouldn't call this method directly. Instead you'd get a custom
   * color matcher by calling {@link nearestColor.from}.
   *
   * @public
   * @param {string} hex The hex-based color string, e.g., '#FF0'
   * @param {Array.<ColorSpec>=} colors An optional list of available colors
   *     (defaults to {@link nearestColor.DEFAULT_COLORS})
   * @return {ColorMatch|string} If the colors in the provided list had names,
   *     then a {@link ColorMatch} object with the name and (hex) value of the
   *     nearest color from the list. Otherwise, simply the hex value.
   *
   * @example
   * nearestColor('#f11'); // => '#f00'
   * nearestColor('#f88'); // => '#f80'
   * nearestColor('#ffe'); // => '#ff0'
   * nearestColor('#efe'); // => '#ff0'
   * nearestColor('#abc'); // => '#808'
   */
  function nearestColor(hex, colors) {
    var needle = Color(hex).rgb(),
        distance,
        minDistance = Infinity,
        rgb,
        value;

    colors || (colors = nearestColor.DEFAULT_COLORS);

    for (var i = 0; i < colors.length; ++i) {
      rgb = colors[i].rgb;

      distance = Math.sqrt(
        Math.pow(needle.r - rgb.r, 2) +
        Math.pow(needle.g - rgb.g, 2) +
        Math.pow(needle.b - rgb.b, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        value = colors[i];
      }
    }

    return value.name ?
      { name: value.name, value: value.source } :
      value.source;
  }

  /**
   * Provides a matcher to find the nearest color based on the provided list of
   * available colors.
   *
   * @public
   * @param {Array.<string>|Object} availableColors An array of hex-based color
   *     strings, or an object mapping color *names* to hex values.
   * @return {function(string):ColorMatch|string} A function with the same
   *     behavior as {@link nearestColor}, but with the list of colors predefined.
   *
   * @example
   * var getColor = nearestColor.from({
   *   'maroon': '#800',
   *   'light yellow': '#ffe',
   *   'pale blue': '#def'
   * });
   *
   * var getBGColor = getColor.from([
   *   '#eee',
   *   '#444'
   * ]);
   *
   * getColor('#f00');
   * // => { name: 'maroon', value: '#800' }
   *
   * getBGColor('#fff'); // => '#eee'
   * getBGColor('#000'); // => '#444'
   */
  nearestColor.from = function from(availableColors) {
    var colors = mapColors(availableColors),
        nearestColorBase = nearestColor;

    var matcher = function nearestColor(hex) {
      return nearestColorBase(hex, colors);
    };

    // Keep the 'from' method, to support changing the list of available colors
    // multiple times without needing to keep a reference to the original
    // nearestColor function.
    matcher.from = from;

    return matcher;
  };

  /**
   * Given either an array or object of colors, returns an array of
   * {@link ColorSpec} objects (with {@link RGB} values).
   *
   * @private
   * @param {Array.<string>|Object} colors An array of hex-based color strings, or
   *     an object mapping color *names* to hex values.
   * @return {Array.<ColorSpec>} An array of {@link ColorSpec} objects
   *     representing the same colors passed in.
   */
  function mapColors(colors) {
    if (colors instanceof Array) {
      return colors.map(function(color) {
        if (color.rgb) {
          return color;
        }

        return {
          source: color,
          rgb: Color(color).rgb()
        };
      });
    }

    var result = [];
    for (var name in colors) {
      result.push({
        name: name,
        source: colors[name],
        rgb: Color(colors[name]).rgb()
      });
    }
    return result;
  };

  /**
   * Default colors. Comprises the colors of the rainbox (good ol' ROY G. BIV).
   * This list will be used for calls to {@nearestColor} that don't specify a list
   * of available colors to match.
   */
  nearestColor.DEFAULT_COLORS = mapColors([
    '#f00', // r
    '#f80', // o
    '#ff0', // y
    '#0f0', // g
    '#00f', // b
    '#008', // i
    '#808'  // v
  ]);

  if (typeof module === 'object' && module && module.exports) {
    module.exports = nearestColor;
  } else {
    context.nearestColor = nearestColor;
  }

}(this));
