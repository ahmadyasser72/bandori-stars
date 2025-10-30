export const emptyObjectIsNull = <T extends object>(o: T | {}): T | null =>
	Object.keys(o).length === 0 ? null : (o as T);
