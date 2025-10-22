import { ReactNode } from 'react';

export type AppId = 'terminal' | 'notes' | 'explorer' | 'music' | 'jsonViewer' | string;

export interface AppMeta {
  id: AppId;
  name: string;
  description?: string;
  category?: 'Productivity' | 'System' | 'Media' | 'Utilities' | 'Games';
  keywords?: string[];
  icon: ReactNode | string;
  canMultiInstance?: boolean;
  defaultPayload?: unknown;
  beta?: boolean;
  hidden?: boolean;
}
