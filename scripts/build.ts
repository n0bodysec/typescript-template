import { execSync } from 'node:child_process';
import { existsSync, rmdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import pkgJson from '../package.json' with { type: 'json' };

type BuildType = typeof validBuildTypes[number];
const validBuildTypes = ['single', 'multi'] as const;
const distFolder = join(import.meta.dirname, '..', 'dist');
const cfgFolder = join(import.meta.dirname, '..', 'tsconfigs');

function isValidBuildType(value: unknown): value is BuildType
{
	return validBuildTypes.includes(value as BuildType);
}

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

const args = process.argv.slice(2);
const buildType = args[0] ?? process.env.BUILD_TYPE;

if (!isValidBuildType(buildType)) throw new Error('Invalid build type provided');

// prebuild
if (existsSync(distFolder))
{
	rmdirSync(distFolder, {
		recursive: true,
	});
}

// build
switch (buildType)
{
	case 'single': {
		execSync(`pnpm tsc -p ${join(cfgFolder, 'tsconfig.build.json')}`, { stdio: 'inherit' });
		break;
	}

	case 'multi': {
		const cfgFiles = ['tsconfig.cjs.json', 'tsconfig.esm.json', 'tsconfig.types.json']
			.map((f) => join(cfgFolder, f));
		execSync(`pnpm tsc -b ${cfgFiles.join(' ')}`, { stdio: 'inherit' });
		break;
	}

	// no default
}

// postbuild
await Promise.all([
	createPackageJson('cjs', buildType),
	createPackageJson('esm', buildType),
	createPackageJson('types', buildType),
	createPackageJson('root', buildType),

	// exclude .tsbuildinfo files from the final package
	writeFile(join(distFolder, '.npmignore'), '*.tsbuildinfo', 'utf8'),
]);
