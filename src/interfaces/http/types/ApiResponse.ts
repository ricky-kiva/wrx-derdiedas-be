type ApiResponse<T = unknown> =
  | { status: 'success'; data: T }
  | { status: 'fail' | 'error'; message: string };

export default ApiResponse;
