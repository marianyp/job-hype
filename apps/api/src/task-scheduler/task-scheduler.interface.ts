export type Task<T> = (() => T) | (() => Promise<T>);

export interface TaskScheduler {
	schedule<T>(task: Task<T>): Promise<T>;
	destroy(): void;
}
