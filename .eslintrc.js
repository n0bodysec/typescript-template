module.exports = {
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	extends: [
		'@n0bodysec',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:import/typescript',
	],
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
	},
	root: true,
	ignorePatterns: ['node_modules', 'dist'],
};
