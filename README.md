# Palette Lab

- [Palette Lab](#palette-lab)
	- [Info](#info)
	- [Features](#features)
	- [Getting Started](#getting-started)
	- [Configuration](#configuration)
		- [Config File](#config-file)
		- [Config object](#config-object)
			- [`scssFile (type: string)`](#scssfile-type-string)
			- [`scssFn (type: string)`](#scssfn-type-string)
			- [`url (type: string)`](#url-type-string)
		- [Palette Object](#palette-object)
			- [`base (type: string)`](#base-type-string)
			- [`gradations (type: number | array, default: 5)`](#gradations-type-number--array-default-5)
			- [`max (type: number | array, default: 100)`](#max-type-number--array-default-100)
			- [`mix (type: array)`](#mix-type-array)
	- [How It Works](#how-it-works)
	- [License](#license)

## Info

> This tool is based on [colorjs.io](https://colorjs.io) for color manipulation.

Palette Lab is a tool designed to generate perceptually uniform color gradations from base colors, utilizing the [CIE Lab color space](https://en.wikipedia.org/wiki/CIELAB_color_space) for color mixing and gradation creation. The number of gradations towards white and black can be customized, individually or together. The maximum lightness and darkness for the last gradations are adjustable as well. The tool includes a preview server for visualizing the palette and automatically refreshes the page upon config changes. Hovering over colors in the preview displays some information about the color. The tool also generates an SCSS file containing a color map and a function, for easier color access in SCSS. This file is being rebuilt on every config change.

![Palette Lab](https://raw.githubusercontent.com/v1ggs/palette-lab/main/assets/palette-lab-1.png)

## Features

- Generates tints and shades from base colors in [CIE Lab color space](https://en.wikipedia.org/wiki/CIELAB_color_space).
- Configurable number of tints and shades for each color.
- Limits for the lightness and darkness of the final gradations.
- Option to mix each color with another color from the palette, with configurable mixing amount.
- Preview server that opens automatically, to visualize the color palette.
- See color information in the preview, by hovering over a color.
- Outputs an SCSS file with a map of all colors and their gradations, plus a function for easy retrieval.
- Refresh the preview and rebuild the SCSS file when you add a new color, or change its config.
- Configurable SCSS file output location.
- Configurable SCSS function name.
- Configurable domain for the palette preview.

## Getting Started

- Navigate to your project in the console:

```cmd
cd /path/to/your/project
```

- Install the package:

```cmd
npm i -D @v1ggs/palette-lab
```

- Run the preview:

```cmd
npx plab
```

- Add and configure colors in the `.palette-lab.js` file located in your project's root directory, which is created upon installation. See [Configuration](#configuration). The preview will be refreshed and the SCSS file rebuilt, whenever you modify `.palette-lab.js`.

- Use it in SCSS:

```scss
// index.scss

// Path to the built palette SCSS file
@use './scss/palette-lab' as pl;

// You can rename this function in the config.
$color-primary: pl.color(primary); // base color
$color-primary-dark: pl.color(primary, -2); // shade 2
$color-primary-darker: pl.color(primary, -4); // shade 4
$color-primary-light: pl.color(primary, 2); // tint 2
```

## Configuration

### Config File

Palette Lab is configured through a `.palette-lab.js` file in the project's root, with the following structure:

```javascript
// General config
exports.config = {
   // Output path for the SCSS file
   scssFile: './src/scss/_palette-lab.scss',

   // Function that you'll use in scss
   scssFn: 'color',

   // URL for preview server.
   // Use 'localhost' or direct other domains to localhost in hosts file.
   previewUrl: 'localhost:3330',
};

// Define colors here
exports.palette = {
  primary: {
      // Base color
      base: '#808080',

      // Number of gradations to black and white
      gradations: [5],

      // Max lightness percentage for black and white
      max: [100],

      // Mix with another color [<color>, <percentage>]
      // Can be useful for creating tinted neutrals,
      // e.g. mix gray with primary 5%.
      mix: [],
  },

  // Add more colors as here.
};
```

### Config object

#### `scssFile (type: string)`

Path to output the generated SCSS file. You can output it to your "src" dir.

#### `scssFn (type: string)`

Name of the function that will be used in SCSS to retrieve colors.

#### `url (type: string)`

URL to run the preview server.

### Palette Object

Define each color with base, number of gradations, and optional max and mix.

#### `base (type: string)`

The color from which tints (lighter) and shades (darker) are generated.

Provide a color value as the base, in any CSS format. This color is then used as the reference for creating gradations.

Example:

```js
exports.palette = {
  primary: {
      base: "#334455", // hex
      // OR
      base: rgb(22% 33% 66%), // rgb
  },
}
```

#### `gradations (type: number | array, default: 5)`

Defines how many tints (lighter) and shades (darker) you want to create from the base color

It can be specified as a single number (applied to both tints and shades) or an array of two numbers `[<shades>, <tints>]`, indicating how many shades and tints you want to generate, respectively.

Example:

```js
exports.palette = {
  primary: {
      base: "#334455", // hex
      gradations: 10, // 10 tints and shades.
      // OR
      gradations: [10], // 10 tints and shades.
      // OR
      gradations: [3, 5], // 3 shades, 5 tints.
  },
}
```

#### `max (type: number | array, default: 100)`

Defines the maximum lightness or darkness of the final gradation, acting as a limit on the range. It specifies the proportion of white or black mixed into the color for its last gradation: 90 represents 90% white for the final tint and 90% black for the final shade, with all preceding gradations evenly distributed within this range.

It can be specified as a single number (applied to both tints and shades) or an array of two numbers `[<black limit>, <white limit>]`. This option can prevent the gradations from reaching pure white or black if desired.

Example:

```js
exports.palette = {
  primary: {
      base: "#334455", // hex
      gradations: [5, 5], // 5 shades, 5 tints.
      max: 96, // 96% for both tints and shades.
      // Or
      max: [96], // 96% for both tints and shades.
      // Or
      max: [96, 100], // 96% for shades, 100% for tints (pure white).
  },
}
```

#### `mix (type: array)`

Lets you mix the base color with another color from the palette.

It is specified as an array with a color name and a percentage without `%`: `[<color name to mix with>, <percentage>]`.

The palette object's key specifying the color is the color name ("primary" in the examples). The base color is mixed with the specified color's base, and then the gradations are created. You can use this to create a palette of slightly colored grays for example.

Example:

```js
exports.palette = {
  primary: { // color name
      base: "#334455", // hex
      gradations: [5, 5], // 5 shades, 5 tints.
      max: [96, 100], // 96% for shades, 100% (pure white) for tints.
      mix: ['secondary', 5], // Mix 5% of "secondary" color (if it exists in the config).
  },
}
```

## How It Works

> This tool is based on [colorjs.io](https://colorjs.io) for color manipulation.

Tints and shades are being created by mixing a color with white and black, within the [CIE Lab color space](https://en.wikipedia.org/wiki/CIELAB_color_space). Then an `rgb()` color is returned, for usage in CSS.

The Lab color space is chosen for its perceptual uniformity, meaning changes in color values correspond more closely to changes perceived by the human eye.

The `max` configuration parameter sets the limit for lightening and darkening. It is the proportion of white or black mixed into the color for its last gradation: `90` represents 90% white for the final tint and 90% black for the final shade, with all preceding gradations evenly distributed within this range. When `max` is set to `100`, the last tint will be white, the last shade black.

Different colors have different lightness values (L*). This means that the range for creating tints and shades vary. For instance, a dark color might have limited room for creating shades, while a very light color might have a restricted range for tints. The requested number of tints and shades will still be produced, but difference between them might be indistinguishable.

## License

MIT
