import {
  GenericLogic,
  Logic,
  LoggingAgent,
  HttpAgent,
  RailwayError,
  SessionStorageAgent,
} from "@fstnetwork/logic";

@Logic()
export class TestHttp extends GenericLogic {
  async run() {
    LoggingAgent.info("test TestHttp");

    await this.testHttpGet();
    await this.testHttpPost();
    await this.testHttpPut();
    await this.testHttpPatch();
    await this.testHttpDelete();

    LoggingAgent.info("complete TestHttp");
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error.stack}`);
  }

  async testHttpGet() {
    const httpAgent = await HttpAgent?.acquire("test-http-server")!;

    const resp = await httpAgent.fetch("/resource")!;

    let headers: Record<string, string> = {};
    for (let [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson("GET.status", resp.status);
    await SessionStorageAgent.putJson("GET.headers", headers);
    await SessionStorageAgent.putByteArray("GET.body", await resp.text());
  }

  async testHttpPost() {
    const httpAgent = await HttpAgent?.acquire("test-http-server")!;

    const resp = await httpAgent.fetch(
      "/resource",
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: new Uint8Array([123, 34, 97, 34, 58, 51, 51, 125])
      }      
    )!;

    let headers: Record<string, string> = {};
    for (let [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson("POST.status", resp.status);
    await SessionStorageAgent.putJson("POST.headers", headers);
    await SessionStorageAgent.putByteArray("POST.body", await resp.text());
  }

  async testHttpPut() {
    const httpAgent = await HttpAgent?.acquire("test-http-server")!;

    const resp = await httpAgent.fetch(
      "/resource/1",
      {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: new Uint8Array([
          123, 34, 100, 97, 116, 97, 49, 34, 58, 34, 112, 117, 116, 32, 109, 111,
          99, 107, 32, 100, 97, 116, 97, 49, 34, 44, 34, 100, 97, 116, 97, 50, 34,
          58, 34, 112, 117, 116, 32, 109, 111, 99, 107, 32, 100, 97, 116, 97, 50,
          34, 125,
        ])
      }
    )!;

    let headers: Record<string, string> = {};
    for (let [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson("PUT.status", resp.status);
    await SessionStorageAgent.putJson("PUT.headers", headers);
    await SessionStorageAgent.putJson("PUT.body", await resp.json());
  }

  async testHttpPatch() {
    const httpAgent = await HttpAgent?.acquire("test-http-server")!;

    const resp = await httpAgent.fetch(
      "/resource/1",
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: '{"data1":"put mock data1"}'
      }
    )!;

    let headers: Record<string, string> = {};
    for (let [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson("PATCH.status", resp.status);
    await SessionStorageAgent.putJson("PATCH.headers", headers);
    await SessionStorageAgent.putByteArray("PATCH.body", await resp.text());
  }

  async testHttpDelete() {
    const httpAgent = await HttpAgent?.acquire("test-http-server")!;

    const resp = await httpAgent.fetch(
      "/resource/1",
      {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json'
        }
      }
    )!;

    let headers: Record<string, string> = {};
    for (let [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson("DELETE.status", resp.status);
    await SessionStorageAgent.putJson("DELETE.headers", headers);
    await SessionStorageAgent.putByteArray("DELETE.body", await resp.text());
  }
}
