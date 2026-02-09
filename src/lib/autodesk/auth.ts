import axios from 'axios';
import type { APSAuthToken } from '@/types/autodesk';

const AUTH_BASE_URL = 'https://developer.api.autodesk.com/authentication/v2';

export class APSAuth {
  private clientId: string;
  private clientSecret: string;
  private token: APSAuthToken | null = null;
  private tokenExpiresAt: number = 0;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getToken(): Promise<string> {
    // Check if token is still valid (with 5 minute buffer)
    if (this.token && Date.now() < this.tokenExpiresAt - 300000) {
      return this.token.access_token;
    }

    const response = await axios.post<APSAuthToken>(
      `${AUTH_BASE_URL}/token`,
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
        scope: 'data:read data:write bucket:read bucket:create bucket:delete viewables:read'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    this.token = response.data;
    this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);

    return response.data.access_token;
  }

  async revokeToken(): Promise<void> {
    if (this.token) {
      await axios.post(`${AUTH_BASE_URL}/logout`, null, {
        params: {
          token: this.token.access_token,
        },
      });
      this.token = null;
    }
  }
}

let authInstance: APSAuth | null = null;

export function getAuthInstance(): APSAuth {
  if (!authInstance) {
    const clientId = process.env.APS_CLIENT_ID;
    const clientSecret = process.env.APS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('APS_CLIENT_ID and APS_CLIENT_SECRET must be set');
    }

    authInstance = new APSAuth(clientId, clientSecret);
  }

  return authInstance;
}
