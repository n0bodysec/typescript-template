import n0bodysec from '@n0bodysec/eslint-config';
import airbnbTs from 'eslint-config-airbnb-typescript-x/base';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	...airbnbTs,
	...n0bodysec,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		ignores: ['node_modules', 'dist'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},

		rules: {
			'max-len': 'off',
		},
	},
);
