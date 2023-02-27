interface Metadata {
  resultCode: number;
  resultMessage?: string | null;
}

export class HttpException extends Error {
  public status: number;
  public message: string;
  public metadata: Metadata | null = null;

  constructor(status: number, message: string, metadata?: Metadata | null) {
    super(message);
    this.name = 'HttpException';
    this.status = status;
    this.message = message;
    this.metadata = metadata ?? null;
  }

  toJson() {
    return {
      status: this.status,
      message: this.message,
      metadata: this.metadata,
    };
  }
}
