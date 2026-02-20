/**
 * Maintains a fixed number of tokens. Calling {@link acquire} waits until a permit is
 * available, then consumes one; calling {@link release} returns a permit back to the
 * pool. If no permits are available, `acquire()` queues the caller and resolves later
 * in FIFO order when another operation releases a permit.
 *
 * Typical use: limit how many async tasks run at once (e.g., cap simultaneous HTTP
 * requests, file operations, or DB queries).
 */
export class Semaphore {
	private tokens: number;
	private waiters: Array<() => void> = [];

	public constructor(permits: number) {
		this.tokens = permits;
	}

	public acquire(): Promise<void> {
		if (this.tokens > 0) {
			this.tokens -= 1;
			return Promise.resolve();
		}

		return new Promise<void>(resolve => {
			this.waiters.push(() => {
				this.tokens -= 1;
				resolve();
			});
		});
	}

	public release(): void {
		const next = this.waiters.shift();

		if (next) {
			next();
		} else {
			this.tokens += 1;
		}
	}
}
