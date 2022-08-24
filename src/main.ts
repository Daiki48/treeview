import { join, resolve } from "./deps.ts";
import { TreeEntry } from "./utils/types.ts";

const tree = async (root: string, prefix = "") => {
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
		console.log(prefix + branch + entry.name);
		if (entry.isDirectory && entry.name !== ".git") {
			const indent = entry === lastOne ? "    " : "┃   ";
			await tree(entry.path, prefix + "    ");
		}
	}
};

const dir = ".";
await tree(resolve(Deno.cwd(), String(dir)));
