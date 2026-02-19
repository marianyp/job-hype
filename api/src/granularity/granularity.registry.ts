import { GranularityKey } from "@job-hype/shared";
import { Inject, Injectable } from "@nestjs/common";
import { Granularity } from "./granularity";
import {
	DuplicateGranularityKeyError,
	UnregisteredGranularityError,
} from "./granularity.errors";
import { GRANULARITIES } from "./granularity.tokens";

@Injectable()
export class GranularityRegistry {
	private readonly keyToGranularity = new Map<GranularityKey, Granularity>();

	public constructor(@Inject(GRANULARITIES) granularities: Granularity[]) {
		for (const granularity of granularities) {
			const key = granularity.getKey();

			if (this.keyToGranularity.has(key)) {
				throw new DuplicateGranularityKeyError(key);
			}

			this.keyToGranularity.set(key, granularity);
		}
	}

	public get(key: GranularityKey): Granularity {
		const granularity = this.keyToGranularity.get(key);

		if (!granularity) {
			throw new UnregisteredGranularityError(key);
		}

		return granularity;
	}
}
