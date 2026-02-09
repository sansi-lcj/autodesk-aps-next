import axios from 'axios';
import { getAuthInstance } from './auth';

const DESIGN_AUTOMATION_BASE_URL = 'https://developer.api.autodesk.com/designautomation/v2';

export interface APSApp {
  id: string;
  name: string;
  description?: string;
  created: string;
  allowedCallbackUrls?: string[];
}

export interface APSActivity {
  id: string;
  name: string;
  description?: string;
  engine: string;
  created: string;
  commandLine?: string;
  parameters?: Record<string, any>;
}

export interface APSWorkItem {
  id: string;
  status: 'pending' | 'inprogress' | 'success' | 'failed' | 'cancelled';
  created: string;
  activity: string;
  inputs?: any[];
  outputs?: any[];
}

export interface CreateWorkItemInput {
  activityId: string;
  inputs?: {
    url: string;
    pathInZip?: string;
    storageProvider?: string;
  }[];
  outputs?: {
    url: string;
    pathInZip?: string;
    storageProvider?: string;
  }[];
}

export class APSDesignAutomation {
  private getHeaders() {
    return {
      'Authorization': '',
      'Content-Type': 'application/json',
    };
  }

  // App Management
  async listApps(): Promise<APSApp[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DESIGN_AUTOMATION_BASE_URL}/apps`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getApp(appId: string): Promise<APSApp> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DESIGN_AUTOMATION_BASE_URL}/apps/${appId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async createApp(name: string, description?: string): Promise<APSApp> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${DESIGN_AUTOMATION_BASE_URL}/apps`,
      {
        data: {
          type: 'applications',
          attributes: {
            name,
            description,
          },
        },
      },
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  async deleteApp(appId: string): Promise<void> {
    const token = await getAuthInstance().getToken();
    await axios.delete(`${DESIGN_AUTOMATION_BASE_URL}/apps/${appId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Activity Management
  async listActivities(): Promise<APSActivity[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DESIGN_AUTOMATION_BASE_URL}/activities`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getActivity(activityId: string): Promise<APSActivity> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DESIGN_AUTOMATION_BASE_URL}/activities/${activityId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async createActivity(name: string, engine: string, commandLine?: string, description?: string): Promise<APSActivity> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${DESIGN_AUTOMATION_BASE_URL}/activities`,
      {
        data: {
          type: 'activities',
          attributes: {
            name,
            engine,
            commandLine,
            description,
          },
        },
      },
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  async deleteActivity(activityId: string): Promise<void> {
    const token = await getAuthInstance().getToken();
    await axios.delete(`${DESIGN_AUTOMATION_BASE_URL}/activities/${activityId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Work Items
  async createWorkItem(input: CreateWorkItemInput): Promise<APSWorkItem> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${DESIGN_AUTOMATION_BASE_URL}/workitems`,
      {
        data: {
          type: 'workitems',
          attributes: {
            activityId: input.activityId,
          },
          relationships: {
            inputs: {
              data: input.inputs?.map((input, index) => ({
                type: 'objects',
                id: input.url,
                attributes: {
                  pathInZip: input.pathInZip,
                },
              })),
            },
            outputs: {
              data: input.outputs?.map((output) => ({
                type: 'objects',
                id: output.url,
                attributes: {
                  pathInZip: output.pathInZip,
                },
              })),
            },
          },
        },
      },
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  async getWorkItem(workItemId: string): Promise<APSWorkItem> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DESIGN_AUTOMATION_BASE_URL}/workitems/${workItemId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async listWorkItems(): Promise<APSWorkItem[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DESIGN_AUTOMATION_BASE_URL}/workitems`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async pollForCompletion(workItemId: string, intervalMs: number = 5000, maxAttempts: number = 60): Promise<APSWorkItem> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const workItem = await this.getWorkItem(workItemId);

      if (workItem.status === 'success') {
        return workItem;
      }

      if (workItem.status === 'failed' || workItem.status === 'cancelled') {
        throw new Error(`Work item failed with status: ${workItem.status}`);
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error('Work item processing timed out');
  }
}

// Supported engines
export const ENGINES = {
  AUTOCAD: 'Autodesk.AutoCAD',
  INVENTOR: 'Autodesk.Inventor',
  REVIT: 'Autodesk.Revit',
  MAX: 'Autodesk.3dsMax',
  FUSION360: 'Autodesk.Fusion360',
} as const;
