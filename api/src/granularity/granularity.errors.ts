import { GranularityKey } from "@job-hype/shared";

export class UnregisteredGranularityError extends Error {
	public constructor(public readonly key: GranularityKey) {
		super(`No granularity registered for key: ${key}`);
		this.name = this.constructor.name;
	}
}

export class DuplicateGranularityKeyError extends Error {
	public constructor(public readonly key: GranularityKey) {
		super(`Attempted to register existing granularity key '${key}'`);
		this.name = this.constructor.name;
	}
}
