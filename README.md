# Autodesk Platform Services (APS) Next.js Dashboard

![Autodesk APS](https://img.shields.io/badge/Autodesk-APS-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge)

A comprehensive Next.js dashboard for integrating Autodesk Platform Services (formerly Forge) APIs.

## 🚀 Features

- **Dashboard** - Overview of your APS usage and quick actions
- **File Manager** - Upload, manage, and organize your files in OSS
- **Model Viewer** - Convert and view 3D models in the browser
- **Projects Browser** - Browse and manage your Autodesk projects
- **Full API Coverage** - Complete SDK for all APS APIs

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **API Integration**: Autodesk Platform Services SDK

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd autodesk-aps-next
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Autodesk credentials:

```env
APS_CLIENT_ID=your_client_id_here
APS_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APS_CALLBACK_URL=http://localhost:3000/api/auth/callback
```

4. **Run development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Getting Autodesk Credentials

1. Go to [APS Dashboard](https://aps.autodesk.com/dashboard)
2. Sign in with your Autodesk account
3. Click "Create Application"
4. Fill in the application details
5. Copy the Client ID and Client Secret
6. Add the callback URL: `http://localhost:3000/api/auth/callback`

## 📁 Project Structure

```
autodesk-aps-next/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API Routes
│   │   │   └── autodesk/       # Autodesk API endpoints
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx            # Home page (Dashboard)
│   ├── components/             # React components
│   │   └── Providers.tsx       # React Query provider
│   ├── lib/                    # Core SDK modules
│   │   └── autodesk/           # APS SDK
│   │       ├── auth.ts         # Authentication
│   │       ├── oss.ts          # Object Storage Service
│   │       ├── model-derivative.ts  # Model Derivative API
│   │       ├── data-management.ts    # Data Management API
│   │       ├── webhooks.ts           # Webhooks API
│   │       └── design-automation.ts # Design Automation API
│   └── types/                  # TypeScript types
│       └── autodesk.ts          # Autodesk API types
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vercel.json                 # Vercel deployment config
```

## 🔌 API Reference

### Authentication

```typescript
import { getAuthInstance } from '@/lib/autodesk';

const token = await getAuthInstance().getToken();
```

### OSS (Object Storage)

```typescript
import { apsOSS } from '@/lib/autodesk';

// List buckets
const buckets = await apsOSS.listBuckets();

// Upload file
const object = await apsOSS.uploadFile(bucketKey, fileName, fileBuffer, contentType);
```

### Model Derivative

```typescript
import { apsModelDerivative } from '@/lib/autodesk';

// Translate model
await apsModelDerivative.translateModel({
  input: { urn: base64Urn },
  output: { formats: [{ type: 'svf2', views: ['2d', '3d'] }] }
});

// Poll for completion
const manifest = await apsModelDerivative.pollForCompletion(urn);
```

### Data Management

```typescript
import { apsDataManagement } from '@/lib/autodesk';

// List hubs
const hubs = await apsDataManagement.listHubs();

// List projects
const projects = await apsDataManagement.listProjects(hubId);
```

## 🚀 Deployment to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import your repository
4. Add environment variables:
   - `APS_CLIENT_ID`
   - `APS_CLIENT_SECRET`
5. Click "Deploy"

## 📊 Pricing & Limits

| API | Free Tier | Paid Plans |
|-----|-----------|------------|
| Authentication | Unlimited | Unlimited |
| OSS Storage | 5 GB | Custom |
| Model Derivative | 100 simple files/month | Custom |
| Data Management | 1,000 calls/month | Custom |

See [Autodesk Pricing](https://aps.autodesk.com/pricing) for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Autodesk Platform Services](https://aps.autodesk.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)

---

Built with ❤️ using Autodesk Platform Services
