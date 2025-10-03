import React from 'react'
import { WalletProvider, useWallet } from './wallet/WalletContext'
import { WalletModal } from './wallet/WalletModal'

function Header() {
	const { address, openModal, balance, isLoadingBalance } = useWallet()
	const label = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'
	return (
		<nav className="navbar">
			<div className="navbar-inner">
				<div className="brand">
					<span style={{ display: 'inline-flex', width: 22, height: 22, alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: '#0ea5e9', color: 'white', fontSize: 14 }}>🏠</span>
					<span>PropChain</span>
				</div>
				<div className="nav-links">
					<a className="active" href="#home">Home</a>
					<a href="#listings">Listings</a>
					<a href="#favorites">Favorites</a>
					<a href="#dashboard">Dashboard</a>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					{address && balance && (
						<div style={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: 6, 
							padding: '6px 12px', 
							background: '#f8fafc', 
							borderRadius: 8, 
							border: '1px solid #e2e8f0',
							fontSize: 14
						}}>
							<span style={{ color: '#64748b' }}>Balance:</span>
							<span style={{ 
								fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
								fontWeight: 600,
								color: '#1e293b'
							}}>
								{isLoadingBalance ? '...' : `${balance} ETH`}
							</span>
						</div>
					)}
					<button onClick={openModal} className="wallet-btn">{label}</button>
				</div>
			</div>
		</nav>
	)
}

function Hero() {
	return (
		<section className="hero">
			<div className="hero-inner">
				<div className="eyebrow">Real Estate Platform with Wallet</div>
				<h1>
					Find Your Dream Property <br />
					<span className="accent">On The Blockchain</span>
				</h1>
				<p>Discover luxury real estate with blockchain technology. Secure, transparent, and revolutionary property investments.</p>
				<div className="cta">
					<button className="btn-primary">Explore Properties</button>
					<button className="btn-secondary">Learn More</button>
				</div>
			</div>
		</section>
	)
}

export function App() {
	return (
		<WalletProvider>
			<Header />
			<Hero />
			<WalletModal />
		</WalletProvider>
	)
}

