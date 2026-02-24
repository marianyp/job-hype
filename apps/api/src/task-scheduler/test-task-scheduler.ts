import { Task, TaskScheduler } from "./task-scheduler.interface";

export class TestTaskScheduler implements TaskScheduler {
	public async schedule<T>(task: Task<T>): Promise<T> {
		return Promise.resolve().then(() => task());
	}

	public destroy(): void {}
}
