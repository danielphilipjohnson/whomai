export interface MusicPlayerPayload {
  fileId: string;
  name: string;
  path: string;
}

export interface JsonViewerPayload {
  fileId: string;
  name: string;
  content: string;
  path: string;
}

export interface SystemAlertPayload {
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'error';
}
