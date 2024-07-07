/* eslint-disable @typescript-eslint/indent */

module.exports = {
	ignorePatterns: ['node_modules', 'dist'],

	// base extends
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'@n0bodysec',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
	],

	// parser options
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},

	// rules
	rules: {
		'max-len': 'off',
	},
};
