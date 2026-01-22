import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { SocketEvents } from './types';
import type { AnyAction } from '@reduxjs/toolkit';

// TODO: Make this configurable or pass via context/env
const SOCKET_URL = 'http://localhost:4000';

interface SocketActions {
  onTaskCreated?: (data: any) => void | AnyAction;
  onTaskUpdated?: (data: any) => void | AnyAction;
  onTaskDeleted?: (data: any) => void | AnyAction;
}

export const useSocket = (actions: SocketActions) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    if (actions.onTaskCreated) {
      socket.on(SocketEvents.TASK_CREATED, (data) => {
        const result = actions.onTaskCreated!(data);
        if (result) dispatch(result);
      });
    }

    if (actions.onTaskUpdated) {
      socket.on(SocketEvents.TASK_UPDATED, (data) => {
        const result = actions.onTaskUpdated!(data);
        if (result) dispatch(result);
      });
    }

    if (actions.onTaskDeleted) {
      socket.on(SocketEvents.TASK_DELETED, (data) => {
        const result = actions.onTaskDeleted!(data);
        if (result) dispatch(result);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [dispatch, actions]);
};
