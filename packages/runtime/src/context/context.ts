import { Task } from "../primitive";

import { Payload } from "../types/payload";

export abstract class AbstractContext {
  #payload?: Payload;
  #task?: Task;

  async payload(): Promise<Payload> {
    if (this.#payload === undefined) {
      this.#payload = await fetchPayload();
    }
    return this.#payload;
  }

  get task(): Task {
    if (this.#task === undefined) {
      this.#task = fetchTask();
    }
    return this.#task;
  }
}

async function fetchPayload(): Promise<Payload> {
  return Deno.core.opAsync("op_fetch_payload");
}

function fetchTask(): Task {
  let task = Deno.core.opSync("op_fetch_task");
  
  // NOTE: update task struct to match `0.7` interface, and we will update the `Task` interface on version `0.8.0`
  task.taskId = {
    id: task.taskKey.taskId,
    executionId: task.taskKey.executionId,
  };
  task.startAt = task.startTimestamp;

  return task
}
