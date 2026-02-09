import axios from 'axios';
import { getAuthInstance } from './auth';
import type { Webhook } from '@/types/autodesk';

const WEBHOOKS_BASE_URL = 'https://developer.api.autodesk.com/webhooks/v1';

export class APSWebhooks {
  private getHeaders() {
    return {
      'Authorization': '',
      'Content-Type': 'application/json',
    };
  }

  async listHooks(system: string): Promise<Webhook[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${WEBHOOKS_BASE_URL}/systems/${system}/hooks`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getHook(system: string, hookId: string): Promise<Webhook> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${WEBHOOKS_BASE_URL}/systems/${system}/hooks/${hookId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async createHook(system: string, event: string, callbackUrl: string): Promise<Webhook> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${WEBHOOKS_BASE_URL}/systems/${system}/hooks`,
      {
        data: {
          type: 'hooks',
          attributes: {
            system,
            event,
            callbackUrl,
            status: 'active',
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

  async updateHook(system: string, hookId: string, updates: Partial<Webhook>): Promise<Webhook> {
    const token = await getAuthInstance().getToken();
    const response = await axios.patch(
      `${WEBHOOKS_BASE_URL}/systems/${system}/hooks/${hookId}`,
      {
        data: {
          type: 'hooks',
          id: hookId,
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

  async deleteHook(system: string, hookId: string): Promise<void> {
    const token = await getAuthInstance().getToken();
    await axios.delete(`${WEBHOOKS_BASE_URL}/systems/${system}/hooks/${hookId}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Get delivery history for a hook
  async getDeliveryHistory(system: string, hookId: string): Promise<any[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${WEBHOOKS_BASE_URL}/systems/${system}/hooks/${hookId}/history`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // Retry a failed delivery
  async retryDelivery(system: string, hookId: string, deliveryId: string): Promise<void> {
    const token = await getAuthInstance().getToken();
    await axios.post(
      `${WEBHOOKS_BASE_URL}/systems/${system}/hooks/${hookId}/history/${deliveryId}/retry`,
      {},
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  }
}

export const apsWebhooks = new APSWebhooks();

// Supported webhook systems
export const WEBHOOK_SYSTEMS = {
  DATA: 'data',
  OSS: 'oss',
  DM: 'dm',
  PROJECT: 'project',
} as const;

export const WEBHOOK_EVENTS = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
} as const;
