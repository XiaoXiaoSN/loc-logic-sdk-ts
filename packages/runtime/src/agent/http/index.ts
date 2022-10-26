/// <reference path="./lib.deno_fetch.d.ts" />
/// <reference path="./internal.d.ts" />

export const HttpAgent = {
  async acquire(configurationName: string): Promise<HttpAgentClient> {
    const configurationId = await Deno.core.opAsync(
      "op_http_agent_acquire",
      configurationName
    );

    return new HttpAgentClient(configurationId);
  },
};

export class HttpAgentClient {
  constructor(readonly configurationId: string) {}

  async fetch(
    input: Request | string,
    init?: RequestInit,
  ): Promise<Response> {
    return fetch(this.configurationId, input, init);
  }
}

export namespace Http {
  export class Config {
    acceptInvalidCerts: boolean;

    constructor(acceptInvalidCerts: boolean = false) {
      this.acceptInvalidCerts = acceptInvalidCerts;
    }
  }
}
