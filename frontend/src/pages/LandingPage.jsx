import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@chakra-ui/react';
import {
    FiZap,
    FiSettings,
    FiLock,
    FiCheckCircle,
    FiShield,
    FiUsers,
    FiTrendingUp,
    FiUser,
    FiPaperclip,
    FiSend
} from 'react-icons/fi';
import {
    ArrowForwardIcon
} from '@chakra-ui/icons';
import {
    MdDiamond,
    MdBusiness,
    MdHandshake
} from 'react-icons/md';

import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="dark bg-background-dark font-display text-gray-100 antialiased selection:bg-primary selection:text-white min-h-screen relative overflow-x-hidden">
            {/* Noise texture overlay */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-[0.03]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>

            {/* Gradient blurs */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10 opacity-60"></div>
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 opacity-40"></div>

            {/* Navigation */}
            <nav className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4">
                <div className="backdrop-blur-xl border border-white/5 bg-gradient-to-b from-white/5 to-white/[0.01] rounded-full px-6 py-3 flex items-center justify-between gap-12 shadow-2xl shadow-black/20 max-w-5xl w-full">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-300">
                            <Icon as={MdDiamond} boxSize={4} />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">Vesper</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a className="hover:text-white transition-colors duration-200" href="#features">Features</a>
                        <a className="hover:text-white transition-colors duration-200" href="#experience">The Experience</a>
                        <a className="hover:text-white transition-colors duration-200" href="#compliance">Compliance</a>
                    </div>
                    {isAuthenticated ? (
                        <Link to={user.role === 'admin' ? "/admin" : "/chat"} className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-full text-sm font-medium border border-white/10 transition-all duration-300 flex items-center gap-2 group shadow-glow">
                            <span>{user.role === 'admin' ? 'Dashboard' : 'Open Chat'}</span>
                            <ArrowForwardIcon className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    ) : (
                        <Link to="/login" className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full text-sm font-medium border border-white/10 transition-all duration-300 flex items-center gap-2 group">
                            <span>Access Portal</span>
                            <ArrowForwardIcon className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 px-6 container mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1 text-center lg:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            The Standard in Vendor Relations
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                            Secure <span className="bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent">Vendor-Client</span> <br />Infrastructure.
                        </h1>
                        <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                            A premium end-to-end communication platform facilitating seamless business relationships with Telegram authentication and total administrative sovereignty.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {isAuthenticated ? (
                                <Link to={user.role === 'admin' ? "/admin" : "/chat"} className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-glow flex items-center gap-3 group w-full sm:w-auto justify-center">
                                    <span>{user.role === 'admin' ? 'Go to Dashboard' : 'Open Messenger'}</span>
                                    <ArrowForwardIcon className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            ) : (
                                <Link to="/login" className="bg-[#2AABEE] hover:bg-[#229ED9] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 flex items-center gap-3 group w-full sm:w-auto justify-center">
                                    <svg className="w-5 h-5 fill-current group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg>
                                    <span>Login via Telegram</span>
                                </Link>
                            )}
                            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-medium transition-all duration-300 backdrop-blur-sm flex items-center gap-2 group w-full sm:w-auto justify-center">
                                <span>Business Demo</span>
                                <ArrowForwardIcon className="text-gray-400 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <Icon as={FiShield} className="text-green-400" boxSize={4} />
                                <span>Client-side Encryption</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon as={FiCheckCircle} className="text-green-400" boxSize={4} />
                                <span>Private Infrastructure</span>
                            </div>
                        </div>
                    </div>

                    {/* Phone Mockup */}
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full scale-75 group-hover:scale-90 transition-transform duration-700"></div>
                        <div className="relative z-20">
                            <div className="relative rounded-[2.5rem] bg-[#1a1a1a] border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden aspect-[9/16] max-w-sm mx-auto">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2a2a2a] rounded-b-xl z-30"></div>
                                <div className="h-full w-full bg-background-dark flex flex-col relative">
                                    <div className="p-6 pt-12 flex items-center justify-between border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white text-xs font-bold shadow-lg">VH</div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Vendor Portal</div>
                                                <div className="text-[10px] text-green-400 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Active Session
                                                </div>
                                            </div>
                                        </div>
                                        <Icon as={FiSettings} className="text-gray-400" boxSize={5} />
                                    </div>
                                    <div className="flex-1 p-4 space-y-4">
                                        <div className="flex gap-3 max-w-[85%]">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                                            <div className="bg-surface-dark p-3 rounded-2xl rounded-tl-none border border-white/5">
                                                <p className="text-xs text-gray-300">The shipment manifest for Client #4092 has been uploaded and encrypted.</p>
                                                <span className="text-[10px] text-gray-500 mt-1 block">12:01 PM</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0"></div>
                                            <div className="bg-primary p-3 rounded-2xl rounded-tr-none shadow-glow">
                                                <p className="text-xs text-white">Perfect. Initiate client notification via Telegram portal.</p>
                                                <span className="text-[10px] text-white/60 mt-1 block text-right">12:05 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-white/5 bg-background-dark/90 backdrop-blur-md">
                                        <div className="bg-surface-dark rounded-full px-4 py-2 flex items-center gap-3 border border-white/5">
                                            <Icon as={FiPaperclip} className="text-gray-500" boxSize={4} />
                                            <div className="flex-1 text-xs text-gray-500">Secure message...</div>
                                            <Icon as={FiSend} className="text-primary" boxSize={4} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-4 top-1/4 bg-surface-dark/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl animate-bounce duration-[3000ms]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                        <Icon as={MdHandshake} boxSize={6} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">Client Status</div>
                                        <div className="text-sm font-bold text-white">Verified Partner</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 relative z-10" id="features">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <span className="text-primary font-medium tracking-wider uppercase text-sm mb-2 block">Enterprise Pillars</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for High-Stakes Operations.</h2>
                        <p className="text-gray-400 font-light">
                            Secure your vendor-client relationships with infrastructure that prioritizes privacy, efficiency, and compliance.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="backdrop-blur-xl border border-white/5 bg-gradient-to-b from-white/5 to-white/[0.01] p-8 rounded-[2rem] hover:bg-white/5 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Icon as={FiZap} className="text-primary" boxSize={8} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Frictionless Client Onboarding</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Eliminate registration drop-off. Authenticate your clients instantly through their existing Telegram accounts with zero setup required.
                            </p>
                        </div>
                        <div className="backdrop-blur-xl border border-white/5 bg-gradient-to-b from-white/5 to-white/[0.01] p-8 rounded-[2rem] hover:bg-white/5 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Icon as={MdBusiness} className="text-blue-400" boxSize={8} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Private Business Operations</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Maintain absolute sovereignty over your communication. Your data remains hosted on your private cloud, invisible to third-party providers.
                            </p>
                        </div>
                        <div className="backdrop-blur-xl border border-white/5 bg-gradient-to-b from-white/5 to-white/[0.01] p-8 rounded-[2rem] hover:bg-white/5 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Icon as={FiLock} className="text-purple-400" boxSize={8} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Total Oversight & Compliance</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Audit logs, message management, and granular permission sets ensure your business operations meet the strictest compliance standards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-24 relative overflow-hidden" id="experience">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Two Worlds. One Seamless Connection.</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-light">Experience the dual-sided architecture designed specifically for professional service provision.</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                        {/* Vendor Card */}
                        <div className="backdrop-blur-xl border border-white/5 bg-gradient-to-b from-white/5 to-white/[0.01] rounded-[2.5rem] p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 text-8xl font-black text-white pointer-events-none">VENDOR</div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                        <Icon as={FiTrendingUp} className="text-white" boxSize={6} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white leading-tight">Vendor Management Suite</h4>
                                        <p className="text-xs text-primary font-medium tracking-widest uppercase">Executive Dashboard</p>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    <li className="flex items-center gap-3">
                                        <Icon as={FiCheckCircle} className="text-primary" boxSize={5} />
                                        Bulk messaging & broadcasting
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icon as={FiCheckCircle} className="text-primary" boxSize={5} />
                                        Real-time client activity stream
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icon as={FiCheckCircle} className="text-primary" boxSize={5} />
                                        Automated invoice generation
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Client Card */}
                        <div className="backdrop-blur-xl border border-white/5 bg-gradient-to-b from-white/5 to-white/[0.01] rounded-[2.5rem] p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 text-8xl font-black text-white pointer-events-none">CLIENT</div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <Icon as={FiUser} className="text-blue-400" boxSize={6} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white leading-tight">Client Access Portal</h4>
                                        <p className="text-xs text-blue-400 font-medium tracking-widest uppercase">Member Experience</p>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    <li className="flex items-center gap-3">
                                        <Icon as={FiZap} className="text-blue-400" boxSize={5} />
                                        Instant Telegram login (No password)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icon as={FiZap} className="text-blue-400" boxSize={5} />
                                        Direct vendor secure channel
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icon as={FiZap} className="text-blue-400" boxSize={5} />
                                        Private file vault access
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Global Banner */}
                    <div className="mt-12 text-center p-12 bg-gradient-to-br from-primary/15 to-primary/5 rounded-[3rem] border border-primary/20">
                        <h3 className="text-3xl md:text-4xl font-bold text-white">Global reach. Business privacy.</h3>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden" id="compliance">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Deploy your own vendor ecosystem.</h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto font-light">
                        Take command of your client relationships with the most secure infrastructure available.
                    </p>
                    <div className="flex flex-col items-center gap-6">
                        <Link to="/login" className="bg-[#2AABEE] hover:bg-[#229ED9] text-white px-10 py-5 rounded-full text-lg font-medium transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-cyan-500/30 flex items-center gap-3 transform hover:-translate-y-1">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg>
                            <span>Launch with Telegram</span>
                        </Link>
                        <p className="text-xs text-gray-500">Professional licensing includes <a className="text-gray-400 underline decoration-gray-600 hover:text-white" href="#">Managed Setup</a>.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 relative z-10 bg-background-dark">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                            <Icon as={MdDiamond} boxSize={3} />
                        </div>
                        <span className="text-sm font-semibold text-gray-400">Vesper Infrastructure</span>
                    </div>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <a className="hover:text-primary transition-colors" href="#">Security Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">API Docs</a>
                        <Link to="/login" className="hover:text-primary transition-colors">Client Portal</Link>
                    </div>
                    <div className="text-xs text-gray-600">
                        © 2023 Vesper Inc. Private Business Infrastructure.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
