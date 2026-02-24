export class TaskSchedulerDestroyedError extends Error {
	public constructor(message = "Task Scheduler destroyed") {
		super(message);
		this.name = "SchedulerDestroyedError";
	}
}
