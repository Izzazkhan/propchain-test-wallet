import React, { createContext, useContext, useEffect, useState } from 'react'
import type { EthereumProvider } from './types'

type WalletContextValue = {
	address: string | null
	isConnecting: boolean
	error: string | null
	isModalOpen: boolean
	balance: string | null
	isLoadingBalance: boolean
	openModal: () => void
	closeModal: () => void
	connectMetaMask: () => Promise<void>
	disconnect: () => void
	fetchBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

function getEthereum(): EthereumProvider | undefined {
    const win = window as unknown as { ethereum?: EthereumProvider }
    return win.ethereum
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
	const [address, setAddress] = useState<string | null>(null)
	const [isConnecting, setIsConnecting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [balance, setBalance] = useState<string | null>(null)
	const [isLoadingBalance, setIsLoadingBalance] = useState(false)

    function openModal() { setIsModalOpen(true) }
    function closeModal() { setIsModalOpen(false) }

    async function connectMetaMask() {
		setError(null)
		const ethereum = getEthereum()
		if (!ethereum) {
			setError('MetaMask not detected')
			return
		}
		try {
			setIsConnecting(true)
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            if (Array.isArray(accounts) && typeof accounts[0] === 'string') {
                setAddress(accounts[0] as string)
            }
        } catch (e: unknown) {
            const err = e as { code?: number; message?: string }
            if (typeof err?.code === 'number' && err.code === 4001) setError('Connection request rejected')
            else setError(err?.message ?? 'Failed to connect')
		} finally {
			setIsConnecting(false)
		}
    }

    async function fetchBalance() {
        if (!address) {
            setBalance(null)
            return
        }
        
        const ethereum = getEthereum()
        if (!ethereum) {
            setError('Ethereum provider not available')
            return
        }

        try {
            setIsLoadingBalance(true)
            const balanceHex = await ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
            }) as string
            
            // Convert from wei to ETH
            const balanceWei = BigInt(balanceHex)
            const balanceEth = Number(balanceWei) / Math.pow(10, 18)
            const formattedBalance = balanceEth.toFixed(4)
            
            console.log('Balance fetched:', {
                address,
                balanceHex,
                balanceWei: balanceWei.toString(),
                balanceEth,
                formattedBalance
            })
            
            setBalance(formattedBalance)
        } catch (e: unknown) {
            const err = e as { message?: string }
            setError(err?.message ?? 'Failed to fetch balance')
        } finally {
            setIsLoadingBalance(false)
        }
    }

    function disconnect() {
        setAddress(null)
        setError(null)
        setBalance(null)
    }

	useEffect(() => {
        const ethereum = getEthereum()
        if (!ethereum || typeof ethereum.on !== 'function') return

		const handleAccountsChanged = (accounts: string[]) => {
			if (Array.isArray(accounts) && accounts.length > 0) {
				setAddress(accounts[0])
			} else {
				setAddress(null)
			}
		}

        ethereum.on?.('accountsChanged', handleAccountsChanged)
		return () => {
            ethereum.removeListener?.('accountsChanged', handleAccountsChanged)
		}
	}, [])

    useEffect(() => {
        const ethereum = getEthereum()
        if (!ethereum) return
        let active = true
        ;(async () => {
            try {
                const accounts = await ethereum.request({ method: 'eth_accounts' })
                if (!active) return
                if (Array.isArray(accounts) && typeof accounts[0] === 'string') {
                    setAddress(accounts[0] as string)
                }
            } catch {}
        })()
        return () => { active = false }
    }, [])

    // Fetch balance when address changes
    useEffect(() => {
        if (address) {
            fetchBalance()
        } else {
            setBalance(null)
        }
    }, [address])

    const value: WalletContextValue = {
        address,
        isConnecting,
        error,
        isModalOpen,
        balance,
        isLoadingBalance,
        openModal,
        closeModal,
        connectMetaMask,
        disconnect,
        fetchBalance
    }

	return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletContextValue {
	const ctx = useContext(WalletContext)
	if (!ctx) throw new Error('useWallet must be used within WalletProvider')
	return ctx
}

