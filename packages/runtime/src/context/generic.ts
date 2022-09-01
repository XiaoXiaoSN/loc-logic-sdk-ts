import { AbstractContext } from "./context";
import {
  DatabaseAgent,
  EventAgent,
  FileStorageAgent,
  HttpAgent,
  LocalStorageAgent,
  LoggingAgent,
  SessionStorageAgent,
  MailAgent,
} from "../agent";

export class GenericAgents {
  readonly sessionStorage: SessionStorageAgent;
  readonly logging: LoggingAgent;

  readonly eventStore: EventAgent;
  readonly localStorage?: LocalStorageAgent;
  readonly http?: HttpAgent;
  readonly fileStorage?: FileStorageAgent;
  readonly database?: DatabaseAgent;
  readonly mail?: MailAgent;

  constructor() {
    this.sessionStorage = new SessionStorageAgent();
    this.logging = new LoggingAgent();

    this.eventStore = new EventAgent();
    this.http = new HttpAgent();
    this.fileStorage = new FileStorageAgent();
    this.localStorage = new LocalStorageAgent();
    this.database = new DatabaseAgent();
    this.mail = new MailAgent();
  }
}

export class GenericContext extends AbstractContext {
  readonly agents: GenericAgents;

  constructor() {
    super();

    this.agents = new GenericAgents();
  }
}
