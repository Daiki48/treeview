export interface TreeEntry extends Deno.DirEntry {
	path: string;
}

export interface TreeOptions {
	maxDepth?: number;
	includeFiles?: boolean;
	skip?: RegExp[];
}
