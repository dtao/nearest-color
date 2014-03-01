# nearest-color

Find the nearest color given a predefined list of colors.

Usage:

```javascript
var nearestColor = require('nearest-color');

var colors = {
  red: '#f00',
  yellow: '#ff0',
  blue: '#00f'
};

nearestColor('#800', colors); // => { name: 'red', value: '#f00' }
nearestColor('#ffe', colors); // => { name: 'yellow', value: '#ff0' }
```
