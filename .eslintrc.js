module.exports = {
	root: true,
	env: { node: true },
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint/eslint-plugin'],
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	ignorePatterns: ['node_modules', 'dist'],
	extends: [
		'@n0bodysec',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:import/typescript',
	],
};
