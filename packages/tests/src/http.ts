import {
  GenericLogic,
  Logic,
  LoggingAgent,
  HttpAgent,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export default class TestHttp extends GenericLogic {
  async run() {
    LoggingAgent.info('test TestHttp');

    await this.testHttpGet();
    await this.testHttpPost();
    await this.testHttpPut();
    await this.testHttpPatch();
    await this.testHttpDelete();

    LoggingAgent.info('complete TestHttp');
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error.stack}`);
  }

  async testHttpGet() {
    const httpAgent = await HttpAgent?.acquire('test-http-server');

    const resp = await httpAgent.fetch('/resource');

    const headers: Record<string, string> = {};
    for (const [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson('GET.status', resp.status);
    await SessionStorageAgent.putJson('GET.headers', headers);
    await SessionStorageAgent.putByteArray('GET.body', await resp.text());
  }

  async testHttpPost() {
    const httpAgent = await HttpAgent?.acquire('test-http-server');

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const resp = await httpAgent.fetch('/resource', {
      method: 'POST',
      headers: myHeaders,
      body: new Uint8Array([123, 34, 97, 34, 58, 51, 51, 125]),
    });

    const headers: Record<string, string> = {};
    for (const [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson('POST.status', resp.status);
    await SessionStorageAgent.putJson('POST.headers', headers);
    await SessionStorageAgent.putByteArray('POST.body', await resp.text());
  }

  async testHttpPut() {
    const httpAgent = await HttpAgent?.acquire('test-http-server');

    const request = new Request('/resource/1', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: '{"data1":"put mock data1","data2":"put mock data2"}',
    });
    const resp = await httpAgent.fetch(request);

    const headers: Record<string, string> = {};
    for (const [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson('PUT.status', resp.status);
    await SessionStorageAgent.putJson('PUT.headers', headers);
    await SessionStorageAgent.putJson('PUT.body', await resp.json());
  }

  async testHttpPatch() {
    const httpAgent = await HttpAgent?.acquire('test-http-server');

    const resp = await httpAgent.fetch('/resource/1', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: '{"data1":"put mock data1"}',
    });

    const headers: Record<string, string> = {};
    for (const [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson('PATCH.status', resp.status);
    await SessionStorageAgent.putJson('PATCH.headers', headers);
    await SessionStorageAgent.putByteArray('PATCH.body', await resp.text());
  }

  async testHttpDelete() {
    const httpAgent = await HttpAgent?.acquire('test-http-server');

    const resp = await httpAgent.fetch('/resource/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        userName: 'test@gmail.com',
        password: 'Password!',
        grant_type: 'password',
      }),
    });

    const headers: Record<string, string> = {};
    for (const [key, value] of resp.headers) {
      headers[key] = value;
    }

    await SessionStorageAgent.putJson('DELETE.status', resp.status);
    await SessionStorageAgent.putJson('DELETE.headers', headers);
    await SessionStorageAgent.putByteArray('DELETE.body', await resp.text());
  }
}
