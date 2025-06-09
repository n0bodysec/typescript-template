import configX from '@snowyyd/eslint-config/esm';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	...configX,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		ignores: ['dist/**'],
		languageOptions: {
			parserOptions: {
				projectService: {
					// add other config files below (e.g.: tsup.config.ts)
					allowDefaultProject: ['eslint.config.mjs'],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
);
