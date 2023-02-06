export const DatabaseAgent = {
  async acquire(configurationName: string): Promise<DatabaseClient> {
    const uid = await Deno.core.opAsync(
      'op_database_agent_acquire',
      configurationName
    );

    return new DatabaseClient(uid);
  },
};

export class DatabaseClientId {
  constructor(readonly dataSourceId: string, readonly connectionId: string) {}
}

export class DatabaseClient {
  constructor(readonly uid: DatabaseClientId) {}

  async query(rawSql: string, params: any[]): Promise<Database.QueryResults> {
    interface QueryResults {
      columns: Database.QueryResultColumn[];
      rows: any[];
    }

    const results: QueryResults = await Deno.core.opAsync(
      'op_database_agent_query',
      {
        uid: this.uid,
        rawSql,
        params,
      }
    );

    results.rows = results.rows.reduce((newRows: any[], row: any) => {
      interface Row {
        [key: string]: any;
      }
      const newRow: Row = {};
      for (let i = 0; i < results.columns.length; i++) {
        const columnName = results.columns[i]?.name;
        if (columnName !== undefined) {
          // eslint-disable-next-line prefer-destructuring
          newRow[columnName] = Object.values(row[i])[0];
        }
      }

      newRows.push(newRow);
      return newRows;
    }, []);

    return results;
  }

  async release(): Promise<void> {
    await Deno.core.opAsync('op_database_agent_release', this.uid);
  }

  async execute(rawSql: string, params: any[]) {
    return Deno.core.opAsync('op_database_agent_execute', {
      uid: this.uid,
      rawSql,
      params,
    });
  }

  async beginTransaction(): Promise<DatabaseClient> {
    await Deno.core.opAsync('op_database_agent_begin_transaction', this.uid);
    return this;
  }

  async commitTransaction(): Promise<void> {
    await Deno.core.opAsync('op_database_agent_commit_transaction', this.uid);
  }

  async rollbackTransaction(): Promise<void> {
    await Deno.core.opAsync('op_database_agent_rollback_transaction', this.uid);
  }
}

export namespace Database {
  export interface QueryResultColumn {
    name: string;
    type: string;
  }

  export interface QueryResults {
    columns: QueryResultColumn[];
    rows: Array<{ [key: string]: any }>;
  }
}
