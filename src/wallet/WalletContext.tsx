import React, { createContext, useContext, useEffect, useState } from 'react'
import type { EthereumProvider } from './types'

type WalletContextValue = {
	address: string | null
	isConnecting: boolean
	error: string | null
	isModalOpen: boolean
	openModal: () => void
	closeModal: () => void
	connectMetaMask: () => Promise<void>
	disconnect: () => void
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

    function disconnect() {
        setAddress(null)
        setError(null)
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

    const value: WalletContextValue = {
        address,
        isConnecting,
        error,
        isModalOpen,
        openModal,
        closeModal,
        connectMetaMask,
        disconnect
    }

	return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletContextValue {
	const ctx = useContext(WalletContext)
	if (!ctx) throw new Error('useWallet must be used within WalletProvider')
	return ctx
}

