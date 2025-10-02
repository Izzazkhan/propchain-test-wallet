import React from 'react'
import { useWallet } from './WalletContext'

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<a href={href} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
			{children}
		</a>
	)
}

export function WalletModal() {
	const { isModalOpen, closeModal, connectMetaMask, error, isConnecting, address, disconnect } = useWallet()
	if (!isModalOpen) return null

	const hasMetaMask = typeof (window as any).ethereum !== 'undefined'

	return (
		<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={closeModal}>
			<div onClick={e => e.stopPropagation()} style={{ width: 420, background: '#fff', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
				<div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', fontWeight: 600 }}>Connect Wallet</div>
				<div style={{ padding: 20, display: 'grid', gap: 12 }}>
					{address ? (
					<div>
						<div style={{ marginBottom: 6 }}>Connected address</div>
						<div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>{address}</div>
						<div style={{ marginTop: 12 }}>
							<button onClick={disconnect} style={{ padding: '8px 10px', background: '#ef4444', color: '#fff', borderRadius: 6, border: 0, cursor: 'pointer' }}>Disconnect</button>
						</div>
					</div>
					) : (
						<>
							{hasMetaMask ? (
								<button onClick={connectMetaMask} disabled={isConnecting} style={{ padding: '10px 12px', background: '#f6851b', color: '#fff', borderRadius: 8, border: 0, cursor: 'pointer' }}>{isConnecting ? 'Connecting…' : 'MetaMask'}</button>
							) : (
								<div>
									<p style={{ marginTop: 0 }}>MetaMask not detected. Please install it to continue.</p>
									<ExternalLink href="https://metamask.io/download/">Install MetaMask</ExternalLink>
								</div>
							)}
							{error && <div style={{ color: '#dc2626' }}>{error}</div>}
						</>
					)}
				</div>
				<div style={{ padding: '12px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
					<button onClick={closeModal} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Close</button>
				</div>
			</div>
		</div>
	)
}

