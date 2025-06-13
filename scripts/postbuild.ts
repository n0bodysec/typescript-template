import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import pkgJson from '../package.json' with { type: 'json' };

type BuildType = typeof validBuildTypes[number];

const validBuildTypes = ['single', 'multi'] as const;
const distFolder = join(import.meta.dirname, '..', 'dist');

async function createPackageJson(packageType: 'root' | 'cjs' | 'esm' | 'types', buildType: BuildType)
{
	// special case
	if (packageType === 'root')
	{
		const outFile = join(distFolder, 'package.json');

		const exportsData = buildType === 'multi'
			? {
				types: './lib/types/main.d.ts',
				require: './lib/cjs/main.js',
				import: './lib/esm/main.js',
				default: './lib/esm/main.js',
			}
			: {
				types: './lib/main.d.ts',
				default: './lib/main.js',
			};

		return writeFile(outFile, JSON.stringify({
			...pkgJson,
			exports: {
				'.': exportsData,
			},
		}, null, 4), 'utf8');
	}

	// all other cases
	if (buildType === 'multi')
	{
		const outFile = join(distFolder, 'lib', packageType, 'package.json');
		const isModule = packageType === 'esm';

		return writeFile(outFile, JSON.stringify({
			type: isModule ? 'module' : 'commonjs',
		}), 'utf8');
	}

	return Promise.resolve();
}

function isValidBuildType(value: unknown): value is BuildType
{
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
	return validBuildTypes.includes(value as any);
}

const args = process.argv.slice(2);
const buildType = args[0] ?? process.env.BUILD_TYPE;

if (!isValidBuildType(buildType)) throw new Error('Invalid build type provided');

await Promise.all([
	createPackageJson('cjs', buildType),
	createPackageJson('esm', buildType),
	createPackageJson('types', buildType),
	createPackageJson('root', buildType),

	// exclude .tsbuildinfo files from the final package
	writeFile(join(distFolder, '.npmignore'), '*.tsbuildinfo', 'utf8'),
]);
