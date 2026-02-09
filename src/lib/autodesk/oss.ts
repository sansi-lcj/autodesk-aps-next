import axios from 'axios';
import { getAuthInstance } from './auth';
import type { APSBucket, APSObject } from '@/types/autodesk';

const OSS_BASE_URL = 'https://developer.api.autodesk.com/oss/v2';

export class APSOSS {
  private getHeaders() {
    return {
      'Authorization': '',
      'Content-Type': 'application/json',
    };
  }

  async listBuckets(limit: number = 25): Promise<APSBucket[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${OSS_BASE_URL}/buckets`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
      params: { limit },
    });
    return response.data.items;
  }

  async getBucket(bucketKey: string): Promise<APSBucket> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${OSS_BASE_URL}/buckets/${bucketKey}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async createBucket(bucketKey: string, policyKey: 'transient' | 'temporary' | 'persistent' = 'transient'): Promise<APSBucket> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${OSS_BASE_URL}/buckets`,
      { bucketKey, policyKey },
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async deleteBucket(bucketKey: string): Promise<void> {
    const token = await getAuthInstance().getToken();
    await axios.delete(`${OSS_BASE_URL}/buckets/${bucketKey}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async listObjects(bucketKey: string, startsWith?: string, limit: number = 25): Promise<APSObject[]> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(`${OSS_BASE_URL}/buckets/${bucketKey}/objects`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
      params: { startsWith, limit },
    });
    return response.data.items;
  }

  async getObjectDetails(bucketKey: string, objectKey: string): Promise<APSObject> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(
      `${OSS_BASE_URL}/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}/details`,
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getSignedUploadUrl(bucketKey: string, objectKey: string, contentType: string, size: number): Promise<{ s3UploadUrl: string; objectId: string }> {
    const token = await getAuthInstance().getToken();
    const response = await axios.post(
      `${OSS_BASE_URL}/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}/signeds3upload`,
      { objectKey, contentType, size },
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async getSignedDownloadUrl(bucketKey: string, objectKey: string): Promise<string> {
    const token = await getAuthInstance().getToken();
    const response = await axios.get(
      `${OSS_BASE_URL}/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}/signeddownload`,
      {
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data.url;
  }

  async deleteObject(bucketKey: string, objectKey: string): Promise<void> {
    const token = await getAuthInstance().getToken();
    await axios.delete(`${OSS_BASE_URL}/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}`, {
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async uploadFile(bucketKey: string, objectKey: string, fileBuffer: Buffer, contentType: string): Promise<APSObject> {
    const token = await getAuthInstance().getToken();

    // Get signed upload URL
    const uploadInfo = await this.getSignedUploadUrl(bucketKey, objectKey, contentType, fileBuffer.length);

    // Upload to S3
    await axios.put(uploadInfo.s3UploadUrl, fileBuffer, {
      headers: {
        'Content-Type': contentType,
      },
    });

    // Return object details
    return this.getObjectDetails(bucketKey, objectKey);
  }
}

export const apsOSS = new APSOSS();
