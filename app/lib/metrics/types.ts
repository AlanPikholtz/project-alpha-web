export interface ClientsPerAccount {
  accountId: number;
  accountName: string;
  totalClients: number;
}

export interface DepositsPerClient {
  clientId: number;
  clientFullName: string;
  totalDeposits: number;
}

export interface CommissionsPerClient {
  clientId: number;
  clientFullName: string;
  totalCommissions: number;
}

export interface Metrics {
  totalClients: number;
  clientsPerAccount: ClientsPerAccount[];
  depositsPerClient: DepositsPerClient[];
  commissionsPerClient: CommissionsPerClient[];
  totalDeposits: string;
  totalCommissions: string;
  unassignedDeposits: string;
}
