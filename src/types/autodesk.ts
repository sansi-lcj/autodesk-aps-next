// Autodesk API Types

export interface APSAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: string;
}

export interface APSBucket {
  bucketId: string;
  bucketKey: string;
  owner: string;
  created: string;
  policyKey: 'transient' | 'temporary' | 'persistent';
}

export interface APSObject {
  objectId: string;
  objectKey: string;
  bucketKey: string;
  size: number;
  contentType?: string;
  created: string;
  etag?: string;
}

export interface APSDerivativeManifest {
  type: string;
  hasThumbnail: boolean;
  status: 'pending' | 'inprogress' | 'success' | 'failed' | 'timeout';
  progress: string;
  hasExtractedGeometry: boolean;
  derivatives?: APSDerivative[];
}

export interface APSDerivative {
  name: string;
  hasThumbnail: boolean;
  hasExtractedGeometry: boolean;
  status: string;
  progress: string;
  outputs?: APSOutput[];
}

export interface APSOutput {
  type: string;
  status: string;
  progress: string;
}

export interface APSHub {
  id: string;
  type: 'hubs';
  attributes: {
    name: string;
    createdAt: string;
  };
}

export interface APSProject {
  id: string;
  type: 'projects';
  attributes: {
    name: string;
    createdAt: string;
    rootFolderId?: string;
  };
}

export interface APSFolder {
  id: string;
  type: 'folders';
  attributes: {
    name: string;
    createdAt: string;
  };
  relationships?: {
    parent?: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface APSItem {
  id: string;
  type: 'items';
  attributes: {
    name: string;
    createdAt: string;
    displayName?: string;
    fileType?: string;
  };
  relationships?: {
    item?: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface APSVersion {
  id: string;
  type: 'versions';
  attributes: {
    name: string;
    createdAt: string;
    versionNumber: number;
  };
}

export interface TranslationJob {
  input: {
    urn: string;
    rootFilename?: string;
    compressedUrn?: boolean;
  };
  output: {
    formats: TranslationFormat[];
    destination?: {
      region: string;
    };
  };
}

export interface TranslationFormat {
  type: 'svf2' | 'svf' | 'dwg' | 'dxf' | 'ifc' | 'fbx' | 'obj' | 'stl' | 'gltf' | 'glb' | 'step' | '3ds' | 'rvt';
  views?: ('2d' | '3d')[];
  options?: {
    advanced?: {
      modelStructure?: 'separate' | 'combined';
      generateMasterViews?: boolean;
    };
  };
}

export interface Webhook {
  id: string;
  system: string;
  event: string;
  callbackUrl: string;
  status: 'active' | 'inactive';
  created: string;
}
