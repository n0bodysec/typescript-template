import { execSync } from 'node:child_process';
import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import pkgJson from '../package.json' with { type: 'json' };

const t0 = performance.now();
const projectDir = join(import.meta.dirname, '..'); // the project root (where the main 'package.json' is located)
const distDir = join(projectDir, 'dist'); // the working dir (see publishConfig.directory)
const cfgDir = join(projectDir, 'tsconfigs'); // the path where tsconfig files are located

type PackageType = typeof buildNames[number] | 'root';
async function createPackageJson(packageType: PackageType, isMultiBuild: boolean)
{
	if (!isMultiBuild && packageType !== 'root') throw new Error('The package type MUST be "root" for "single" builds.');

	const libDirName = 'lib'; // the outDir inside the 'distDir' (see tsconfig.*.json)

	// default out file and data for multi builds
	let outFile = join(distDir, libDirName, packageType, 'package.json');
	let outData = `{"type":"${packageType === 'esm' ? 'module' : 'commonjs'}"}`;

	// the root package.json
	if (packageType === 'root')
	{
		// this generate the paths used in the 'exports' key in package.json
		const gen = (t: PackageType, sub = true) =>
		{
			let base = './' + libDirName; // base path for transpiled code (relative to package.json)
			if (sub) base += '/' + t; // add sub path for multi builds
			base += 'main'; // entrypoint file name (no extension)
			base += t === 'types' ? '.d.ts' : '.js'; // file extension based on package type
			return base;
		};

		// https://nodejs.org/api/packages.html#conditional-exports
		// https://nodejs.org/api/packages.html#exports-sugar
		const exports = isMultiBuild
			? {
				// types should be the first key
				// see https://nodejs.org/api/packages.html#community-conditions-definitions
				types: gen('types'),
				require: gen('cjs'),
				import: gen('esm'),
				default: gen('esm'),
			}
			: {
				types: gen('types', false),
				default: gen('esm', false),
			};

		outFile = join(distDir, 'package.json');
		outData = JSON.stringify({ ...pkgJson, exports }, null, 4);
	}

	return writeFile(outFile, outData);
}

// build type can be parsed from the first cli arg or from an env var
const buildType = process.argv.slice(2)[0] ?? process.env.BUILD_TYPE;
if (!buildType || !['single', 'multi'].includes(buildType)) throw new Error('Invalid build type provided');
const isMultiBuild = buildType === 'multi';

// build names (used in multi builds)
const buildNames = ['cjs', 'esm', 'types'] as const;

// prebuild - delete the old distDir
await rm(distDir, { recursive: true, force: true });

// build - run the typescript compiler
if (isMultiBuild)
{
	// config files in format `tsconfig.{buildName}.json`
	const cfgFiles = buildNames.map((x) => join(cfgDir, `tsconfig.${x}.json`));
	execSync(`pnpm tsc -b ${cfgFiles.join(' ')}`, { stdio: 'inherit' });
}
else execSync(`pnpm tsc -p ${join(cfgDir, 'tsconfig.build.json')}`, { stdio: 'inherit' });

// postbuild - create all the required package.json and .npmignore
await Promise.all([
	createPackageJson('root', isMultiBuild),
	isMultiBuild ? buildNames.map((x) => createPackageJson(x, isMultiBuild)) : [],

	// exclude .tsbuildinfo files from the final package
	writeFile(join(distDir, '.npmignore'), '*.tsbuildinfo'),
]);

console.log(`Build completed. Build script for "${buildType}" took ${performance.now() - t0}ms.`);
