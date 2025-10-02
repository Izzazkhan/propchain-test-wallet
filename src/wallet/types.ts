export interface EthereumProvider {
	request(args: { method: string; params?: unknown[] | object }): Promise<unknown>
	on?(event: 'accountsChanged', handler: (accounts: string[]) => void): void
	removeListener?(event: 'accountsChanged', handler: (accounts: string[]) => void): void
}

export type WalletState = {
	address: string | null
	isConnecting: boolean
	error: string | null
	isModalOpen: boolean
}

