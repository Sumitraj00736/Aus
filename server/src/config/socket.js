let io = null;

export const setSocket = (socketInstance) => {
  io = socketInstance;
};

export const getSocket = () => io;

export const emitNotification = (payload) => {
  if (!io) return;
  io.emit('admin:notification', payload);
};

export const emitAdminBlogMessage = (payload) => {
  if (!io) return;
  io.emit('admin:blog-message', payload);
};

export const emitPublicBlogMessage = (blogSlug, payload) => {
  if (!io) return;
  io.emit(`blog:${blogSlug}:message`, payload);
};
