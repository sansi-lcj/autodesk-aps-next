import axios from 'axios';
import { getAuthInstance } from './auth';
import type { APSHub, APSProject, APSFolder, APSItem, APSVersion } from '@/types/autodesk';

const PROJECT_BASE_URL = 'https://developer.api.autodesk.com/project/v1';
const DATA_BASE_URL = 'https://developer.api.autodesk.com/data/v1';
const SCHEMA_BASE_URL = 'https://developer.api.autodesk.com/schema/v1';
const SEARCH_BASE_URL = 'https://developer.api.autodesk.com/search/v1';

export class APSDataManagement {
  private getHeaders() {
    return {
      'Authorization': '',
      'Content-Type': 'application/json',
    };
  }

  // Hub APIs
  async listHubs(): Promise<APSHub[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${PROJECT_BASE_URL}/hubs`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getHub(hubId: string): Promise<APSHub> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${PROJECT_BASE_URL}/hubs/${hubId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // Project APIs
  async listProjects(hubId: string): Promise<APSProject[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${PROJECT_BASE_URL}/hubs/${hubId}/projects`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getProject(hubId: string, projectId: string): Promise<APSProject> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${PROJECT_BASE_URL}/hubs/${hubId}/projects/${projectId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getTopFolders(hubId: string, projectId: string): Promise<APSFolder[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${PROJECT_BASE_URL}/hubs/${hubId}/projects/${projectId}/topFolders`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // Folder APIs
  async getFolder(projectId: string, folderId: string): Promise<APSFolder> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DATA_BASE_URL}/projects/${projectId}/folders/${folderId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getFolderContents(projectId: string, folderId: string): Promise<(APSFolder | APSItem)[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DATA_BASE_URL}/projects/${projectId}/folders/${folderId}/contents`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // Item APIs
  async getItem(projectId: string, itemId: string): Promise<APSItem> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DATA_BASE_URL}/projects/${projectId}/items/${itemId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getItemVersions(projectId: string, itemId: string): Promise<APSVersion[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${DATA_BASE_URL}/projects/${projectId}/items/${itemId}/versions`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async createItem(projectId: string, folderId: string, item: { name: string; displayName?: string }): Promise<APSItem> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${DATA_BASE_URL}/projects/${projectId}/folders/${folderId}/items`,
      {
        data: {
          type: 'items',
          attributes: {
            name: item.name,
            displayName: item.displayName || item.name,
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

  async uploadNewVersion(projectId: string, itemId: string, fileUrn: string): Promise<APSVersion> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${DATA_BASE_URL}/projects/${projectId}/items/${itemId}/versions`,
      {
        data: {
          type: 'versions',
          attributes: {
            name: 'New Version',
          },
          relationships: {
            item: {
              data: {
                type: 'items',
                id: itemId,
              },
            },
            storage: {
              data: {
                type: 'objects',
                id: fileUrn,
              },
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

  async updateItem(projectId: string, itemId: string, updates: Partial<{ name: string; displayName: string }>): Promise<APSItem> {
    const token = await getAuthInstance().getToken();
    const response = await axios.patch(
      `${DATA_BASE_URL}/projects/${projectId}/items/${itemId}`,
      {
        data: {
          type: 'items',
          id: itemId,
          attributes: updates,
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

  async deleteItem(projectId: string, itemId: string): Promise<void> {
    const token = await getAuthInstance().getToken();
    await axios.delete(`${DATA_BASE_URL}/projects/${projectId}/items/${itemId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Schema APIs
  async listSchemas(): Promise<any[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${SCHEMA_BASE_URL}/schemas`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getSchema(schemaId: string): Promise<any> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${SCHEMA_BASE_URL}/schemas/${schemaId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // Search APIs
  async search(query: string): Promise<any> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${SEARCH_BASE_URL}/search`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
      params: { q: query },
    });
    return response.data;
  }
}

export const apsDataManagement = new APSDataManagement();
