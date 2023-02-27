export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // env
      NODE_ENV: 'development' | 'production' | 'test';
      DEPLOY_GROUP: 'development' | 'production' | 'local';

      // deploy
      AWS_SST_NAME: string;
      AWS_SST_ID: string;
      AWS_SST_STAGE: string;

      // aws
      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_S3_BUCKET: string;
      AWS_CLOUD_FRONT_DISTRIBUTION_ID: string;

      // application
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_API_HOST: string;
      NEXT_PUBLIC_DEPLOY_GROUP: 'local' | 'development' | 'production';

      // next-auth
      NEXTAUTH_SECRET: string;

      // google analytics
      NEXT_PUBLIC_GA_TRACKING_ID: string;

      // sentry
      SENTRY_DSN: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
    }

    interface Global {
      atob: typeof atob;
      btoa: typeof btoa;

      Blob: typeof Blob;
      File: typeof File;

      Headers: typeof Headers;
      Request: typeof Request;
      Response: typeof Response;
      fetch: typeof fetch;
      FormData: typeof FormData;

      ReadableStream: typeof ReadableStream;
      WritableStream: typeof WritableStream;

      AbortController: typeof AbortController;
    }
  }
}
