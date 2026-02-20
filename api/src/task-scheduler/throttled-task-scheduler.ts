import { Semaphore } from "./semaphore";
import { TaskSchedulerDestroyedError } from "./task-scheduler.errors";
import { Task, TaskScheduler } from "./task-scheduler.interface";

type QueueItem<T = unknown> = {
	task: Task<T>;
	resolve: (value: T) => void;
	reject: (exception: unknown) => void;
};

export class ThrottledTaskScheduler implements TaskScheduler {
	private readonly semaphore: Semaphore;
	private readonly queue: QueueItem[] = [];
	private readonly executionTimestamps: number[] = [];

	private running = true;
	private processing = false;

	public constructor(
		private readonly requestLimit: number,
		private readonly throttleWindowMilliseconds: number
	) {
		if (requestLimit <= 0) {
			throw new RangeError("Request limit must be greater than 0");
		}

		if (throttleWindowMilliseconds <= 0) {
			throw new RangeError("Throttle window must be greater than 0");
		}

		this.semaphore = new Semaphore(requestLimit * 2);
	}

	public destroy(): void {
		this.running = false;

		while (this.queue.length > 0) {
			const item = this.queue.shift();
			this.semaphore.release();

			if (item !== undefined) {
				item.reject(new TaskSchedulerDestroyedError());
			}
		}
	}

	public async schedule<T>(task: Task<T>): Promise<T> {
		if (!this.running) {
			throw new TaskSchedulerDestroyedError();
		}

		await this.semaphore.acquire();

		return new Promise<T>((resolve, reject) => {
			if (!this.running) {
				this.semaphore.release();
				reject(new TaskSchedulerDestroyedError());
				return;
			}

			this.queue.push({ task, resolve, reject });

			void this.processQueue();
		});
	}

	private async processQueue(): Promise<void> {
		if (this.processing) {
			return;
		}

		this.processing = true;

		try {
			while (this.running && this.queue.length > 0) {
				const delay = this.getDelayUntilNextAllowed();

				if (delay > 0) {
					await ThrottledTaskScheduler.sleep(delay);

					continue;
				}

				const item = this.queue.shift()!;
				this.semaphore.release();

				this.recordExecution();

				void ThrottledTaskScheduler.runTask(item);
			}
		} finally {
			this.processing = false;

			if (this.running && this.queue.length > 0) {
				void this.processQueue();
			}
		}
	}

	private getDelayUntilNextAllowed(): number {
		const now = Date.now();

		while (
			this.executionTimestamps[0] !== undefined &&
			this.executionTimestamps[0] <= now - this.throttleWindowMilliseconds
		) {
			this.executionTimestamps.shift();
		}

		if (this.executionTimestamps.length < this.requestLimit) {
			return 0;
		}

		const oldest = this.executionTimestamps[0];

		const allowedAt =
			oldest === undefined
				? this.throttleWindowMilliseconds
				: oldest + this.throttleWindowMilliseconds;

		return Math.max(0, allowedAt - now);
	}

	private recordExecution(): void {
		this.executionTimestamps.push(Date.now());
	}

	private static sleep(milliseconds: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, milliseconds));
	}

	private static runTask(item: QueueItem): Promise<void> {
		return Promise.resolve()
			.then(() => item.task())
			.then(
				value => {
					item.resolve(value);
				},
				err => {
					item.reject(err);
				}
			);
	}
}
