# nearest-color

Find the nearest color given a predefined list of colors.

Usage:

```javascript
var colors = {
  red: '#f00',
  yellow: '#ff0',
  blue: '#00f'
};

var nearestColor = require('nearest-color').from(colors);

nearestColor('#800'); // => { name: 'red', value: '#f00' }
nearestColor('#ffe'); // => { name: 'yellow', value: '#ff0' }
```
