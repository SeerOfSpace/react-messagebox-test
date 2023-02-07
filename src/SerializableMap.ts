
export class SerializableMap<K,V> extends Map<K,V> {
	constructor();
	constructor(entries: (readonly [K, V])[] | null);
	constructor(map: Map<K,V>);
	constructor(p1?: (readonly [K, V])[] | null | Map<K,V>) {
		if(p1) {
			super(p1);
		} else {
			super();
		}
	}
	toJSON() {
		return JSON.stringify(Array.from(this.entries()));
	}
	static fromJSON(jsonStr: string) {
		return new SerializableMap(JSON.parse(jsonStr));
	}
}