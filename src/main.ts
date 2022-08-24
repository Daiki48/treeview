import { join, resolve } from "./deps.ts";
import { TreeEntry, TreeOptions } from "./utils/types.ts";

const tree = async (
	root: string,
	prefix = "",
	{ maxDepth = Infinity, includeFiles = true, skip }: TreeOptions = {}
) => {
	if (maxDepth < 1 || !include(root, skip)) {
		return;
	}

	const entries: TreeEntry[] = [];
	for await (const entry of Deno.readDir(root)) {
		const treeEntry = { ...entry, path: join(root, entry.name) };
		entries.push(treeEntry);
	}

	if (entries.length == 0) {
		return;
	}

	const sortedEntries = entries.sort((a, b) =>
		a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
	);
	const lastOne = sortedEntries[entries.length - 1];
	for await (const entry of sortedEntries) {
		const branch = entry === lastOne ? "┗━━ " : "┣━━ ";
		const suffix = entry.isDirectory ? "/" : "";
		if (include(entry.path, skip)) {
			console.log(prefix + branch + entry.name + suffix);
		}
		if (entry.isDirectory && entry.name !== ".git") {
			const indent = entry === lastOne ? "    " : "┃   ";
			await tree(entry.path, prefix + indent, {
				maxDepth: maxDepth - 1,
				includeFiles,
				skip,
			});
		}
	}
};

const dir = ".";
await tree(resolve(Deno.cwd(), String(dir)));

function include(path: string, skip?: RegExp[]): boolean {
	if (skip && skip.some((pattern): boolean => !!path.match(pattern))) {
		return false;
	}
	return true;
}
