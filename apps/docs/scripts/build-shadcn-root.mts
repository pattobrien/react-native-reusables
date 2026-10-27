import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import {
  registryIndexSchema,
  registryItemSchema,
  registrySchema,
  type RegistryItem,
} from 'shadcn/registry';

const FORK_BASE_URL =
  'https://raw.githubusercontent.com/pattobrien/react-native-reusables/main/apps/docs/public/r/uniwind';
const UPSTREAM_BASE_URL = 'https://reactnativereusables.com/r/uniwind';
// shadcn maps style "new-york" with an empty tailwind.config to new-york-v4, and uniwind is tailwind v4 only.
const STYLE = 'new-york-v4';

const { values } = parseArgs({
  options: {
    registry: { type: 'string', default: './registry/uniwind.json' },
    dir: { type: 'string', default: './public/r/uniwind' },
    'base-url': { type: 'string', default: FORK_BASE_URL },
  },
});
const { registry: registryPath, dir, 'base-url': baseUrl } = values;

const registry = registrySchema.parse(JSON.parse(readFileSync(registryPath, 'utf8')));
const names = new Set(registry.items.map((item) => item.name));

const itemUrl = (name: string) => `${baseUrl}/styles/${STYLE}/${name}.json`;

function forkDependency(url: string) {
  const prefix = `${UPSTREAM_BASE_URL}/`;
  const name = url.startsWith(prefix) && url.endsWith('.json') ? url.slice(prefix.length, -5) : '';
  if (!names.has(name))
    throw new Error(`registry dependency ${url} is not an item of ${registryPath}`);
  return itemUrl(name);
}

const items: RegistryItem[] = registry.items.map(({ name }) => {
  const built = registryItemSchema.parse(
    JSON.parse(readFileSync(join(dir, `${name}.json`), 'utf8'))
  );
  return { ...built, registryDependencies: built.registryDependencies?.map(forkDependency) };
});

const index = registryIndexSchema.parse(
  items
    .filter((item) => item.type === 'registry:ui')
    .map((item) => ({ ...item, files: item.files?.map(({ content, ...file }) => file) }))
);

const toJson = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;
const stylesDir = join(dir, 'styles', STYLE);

rmSync(join(dir, 'styles'), { recursive: true, force: true });
mkdirSync(stylesDir, { recursive: true });
for (const item of items) writeFileSync(join(stylesDir, `${item.name}.json`), toJson(item));
writeFileSync(join(dir, 'index.json'), toJson(index));

console.log(`${items.length} items in ${stylesDir}, ${index.length} in ${join(dir, 'index.json')}`);
