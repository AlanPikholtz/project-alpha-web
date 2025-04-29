export interface ClientsPerAccount {
  accountId: number;
  accountName: string;
  totalClients: number;
}

export interface Metrics {
  totalClients: number;
  clientsPerAccount: ClientsPerAccount[];
  depositsPerClient: [
    {
      clientId: number;
      clientFullName: string;
      totalDeposits: number;
    }
  ];
  commissionsPerClient: [
    {
      clientId: number;
      clientFullName: string;
      totalCommissions: number;
    }
  ];
  totalDeposits: number;
  totalCommissions: number;
}
