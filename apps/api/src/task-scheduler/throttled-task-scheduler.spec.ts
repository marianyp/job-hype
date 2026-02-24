import { TaskSchedulerDestroyedError } from "./task-scheduler.errors";
import { ThrottledTaskScheduler } from "./throttled-task-scheduler";

async function flushMicrotasks(times: number): Promise<void> {
	for (let i = 0; i < times; i += 1) {
		await Promise.resolve();
	}
}

function setupTaskRecorder(): {
	starts: number[];
	createTask: (value: number) => () => number;
} {
	const starts: number[] = [];

	const createTask = (value: number) => () => {
		starts.push(Date.now());
		return value;
	};

	return { starts, createTask };
}

describe("ThrottledTaskScheduler", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(0);
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	describe("constructor", () => {
		it("should throw if request limit is out of range", () => {
			expect(() => new ThrottledTaskScheduler(0, 1000)).toThrow(RangeError);
			expect(() => new ThrottledTaskScheduler(-1, 1000)).toThrow(RangeError);
		});

		it("should throw if window milliseconds is out of range", () => {
			expect(() => new ThrottledTaskScheduler(1, 0)).toThrow(RangeError);
			expect(() => new ThrottledTaskScheduler(1, -10)).toThrow(RangeError);
		});
	});

	describe("destroy", () => {
		it("should reject queued tasks", async () => {
			const scheduler = new ThrottledTaskScheduler(1, 1000);

			const firstTask = scheduler.schedule(() => "one");

			await flushMicrotasks(1);

			await expect(firstTask).resolves.toBe("one");

			const secondTask = scheduler.schedule(() => "two");
			const thirdTask = scheduler.schedule(() => "three");

			await flushMicrotasks(2);

			scheduler.destroy();

			await expect(secondTask).rejects.toBeInstanceOf(
				TaskSchedulerDestroyedError
			);
			await expect(thirdTask).rejects.toBeInstanceOf(
				TaskSchedulerDestroyedError
			);

			jest.runOnlyPendingTimers();
		});
	});

	describe("schedule", () => {
		it("should throw error if task scheduler is destroyed", async () => {
			const scheduler = new ThrottledTaskScheduler(1, 1000);

			scheduler.destroy();

			await expect(scheduler.schedule(() => 123)).rejects.toBeInstanceOf(
				TaskSchedulerDestroyedError
			);
		});

		it("should not execute more than the request limit", async () => {
			const scheduler = new ThrottledTaskScheduler(2, 1000);

			const { starts, createTask } = setupTaskRecorder();

			const firstTask = scheduler.schedule(createTask(1));
			const secondTask = scheduler.schedule(createTask(2));
			const thirdTask = scheduler.schedule(createTask(3));

			await flushMicrotasks(2);

			expect(starts).toHaveLength(2);
			expect(starts[0]).toBe(0);
			expect(starts[1]).toBe(0);

			jest.advanceTimersByTime(999);
			jest.setSystemTime(999);

			await flushMicrotasks(1);

			expect(starts).toHaveLength(2);

			jest.advanceTimersByTime(1);
			jest.setSystemTime(1000);

			await flushMicrotasks(1);

			expect(starts).toHaveLength(3);
			expect(starts[2]).toBe(1000);

			await expect(
				Promise.all([firstTask, secondTask, thirdTask])
			).resolves.toEqual([1, 2, 3]);
		});

		it("should execute in order of the oldest timestamp", async () => {
			const scheduler = new ThrottledTaskScheduler(1, 500);

			const { starts, createTask } = setupTaskRecorder();

			const firstTask = scheduler.schedule(createTask(1));
			const secondTask = scheduler.schedule(createTask(2));
			const thirdTask = scheduler.schedule(createTask(3));

			await flushMicrotasks(3);

			expect(starts).toEqual([0]);

			jest.advanceTimersByTime(500);
			jest.setSystemTime(500);

			await flushMicrotasks(1);

			expect(starts).toEqual([0, 500]);

			jest.advanceTimersByTime(500);
			jest.setSystemTime(1000);

			await flushMicrotasks(1);

			expect(starts).toEqual([0, 500, 1000]);

			await expect(
				Promise.all([firstTask, secondTask, thirdTask])
			).resolves.toEqual([1, 2, 3]);
		});
	});
});
