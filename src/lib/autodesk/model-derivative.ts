import axios from 'axios';
import { getAuthInstance } from './auth';
import type { APSDerivativeManifest, TranslationJob } from '@/types/autodesk';

const MODEL_DERIVATIVE_BASE_URL = 'https://developer.api.autodesk.com/modelderivative/v2/designdata';

export class APSModelDerivative {
  private getHeaders() {
    return {
      'Authorization': '',
      'Content-Type': 'application/json',
    };
  }

  async translateModel(job: TranslationJob): Promise<{ urn: string }> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${MODEL_DERIVATIVE_BASE_URL}/job`,
      job,
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
          'x-ads-force': 'true',
        },
      }
    );
    return { urn: response.data.urn };
  }

  async getManifest(urn: string): Promise<APSDerivativeManifest> {
    const token = await getAuthInstance().getToken();
    const encodedUrn = Buffer.from(urn).toString('base64').replace(/=/g, '');
    const response = await axios.get(
      `${MODEL_DERIVATIVE_BASE_URL}/${encodedUrn}/manifest`,
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getMetadata(urn: string): Promise<{ data: { type: string; metadata: Record<string, any> } }> {
    const token = await getAuthInstance().getToken();
    const encodedUrn = Buffer.from(urn).toString('base64').replace(/=/g, '');
    const response = await axios.get(
      `${MODEL_DERIVATIVE_BASE_URL}/${encodedUrn}/metadata`,
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getModelMetadata(urn: string, guid: string): Promise<any> {
    const token = await getAuthInstance().getToken();
    const encodedUrn = Buffer.from(urn).toString('base64').replace(/=/g, '');
    const response = await axios.get(
      `${MODEL_DERIVATIVE_BASE_URL}/${encodedUrn}/metadata/${guid}`,
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getModelProperties(urn: string, guid: string): Promise<any> {
    const token = await getAuthInstance().getToken();
    const encodedUrn = Buffer.from(urn).toString('base64').replace(/=/g, '');
    const response = await axios.get(
      `${MODEL_DERIVATIVE_BASE_URL}/${encodedUrn}/metadata/${guid}/properties`,
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getThumbnail(urn: string, width: number = 400, height: number = 400): Promise<Buffer> {
    const token = await getAuthInstance().getToken();
    const encodedUrn = Buffer.from(urn).toString('base64').replace(/=/g, '');
    const response = await axios.get(
      `${MODEL_DERIVATIVE_BASE_URL}/${encodedUrn}/thumbnail?width=${width}&height=${height}`,
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      }
    );
    return Buffer.from(response.data);
  }

  async pollForCompletion(urn: string, intervalMs: number = 2000, maxAttempts: number = 60): Promise<APSDerivativeManifest> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const manifest = await this.getManifest(urn);

      if (manifest.status === 'success') {
        return manifest;
      }

      if (manifest.status === 'failed' || manifest.status === 'timeout') {
        throw new Error(`Translation failed with status: ${manifest.status}`);
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error('Translation timed out');
  }
}

export const apsModelDerivative = new APSModelDerivative();
