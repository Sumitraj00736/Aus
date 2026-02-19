let io = null;

export const setSocket = (socketInstance) => {
  io = socketInstance;
};

export const getSocket = () => io;

export const emitNotification = (payload) => {
  if (!io) return;
  io.emit('admin:notification', payload);
};
