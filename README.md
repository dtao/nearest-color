# nearest-color

Find the nearest color given a predefined list of colors.

## Usage

```javascript
var colors = {
  red: '#f00',
  yellow: '#ff0',
  blue: '#00f'
};

var nearestColor = require('nearest-color').from(colors);

nearestColor('#800'); // => { name: 'red', value: '#f00', rgb: { r: 255, g: 0, b: 0 }, distance: 119 }
nearestColor('#ffe'); // => { name: 'yellow', value: '#ff0', rgb: { r: 255, g: 255, b: 0 }, distance: 238 }
```

## How it works

Finding the nearest color is a specific case of the "nearest neighbor search" (or NNS) problem. The predefined colors can be thought of as points in 3D space where the X, Y, and Z axes represent each color's red, green, and blue (RGB) values. So finding the nearest color to any given value amounts to finding the closet neighbor to the point where that color would reside when plotted in such a 3D space.

From [the Wikipedia article on the subject](http://en.wikipedia.org/wiki/Nearest_neighbor_search):

> The simplest solution to the NNS problem is to compute the distance from the query point 
> to every other point in the database, keeping track of the "best so far". This algorithm, 
> sometimes referred to as the naive approach, has a running time of *O(Nd)* where *N* is 
> the cardinality of *S* and *d* is the dimensionality of *M*. There are no search data 
> structures to maintain, so linear search has no space complexity beyond the storage of the 
> database. Naive search can, on average, outperform space partitioning approaches on higher 
> dimensional spaces.

This library uses the naive approach, which is hard to beat. Performance should be totally fine unless there are **many** pre-defined colors to search (and even then, it will probably only matter if you're calling `nearestColor` a ton of times).

The most realistic optimization that could be made here would probably be to cache results so that multiple calls for the same color can return immediately.
