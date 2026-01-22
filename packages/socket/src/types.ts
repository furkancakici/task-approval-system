import type { Task } from '@repo/types';

export enum SocketEvents {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
}

export type SocketPayloads = {
  [SocketEvents.TASK_CREATED]: Task;
  [SocketEvents.TASK_UPDATED]: Task;
  [SocketEvents.TASK_DELETED]: { id: string };
};
