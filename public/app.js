import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { 
  Target, 
  Users, 
  Map as MapIcon, 
  Activity, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Layers,
  Settings,
  Menu,
  X,
  Info,
  Copy,
  Check,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const App = () => {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetch("./api/servers")
      .then(res => res.json())
      .then(data => {
        setServers(data);
        if (data.length > 0) {
          setSelectedServer(data[0]);
        }
        setLoading(false);
      });
  }, []);

  const copyIp = (id, ip) => {
    navigator.clipboard.writeText(ip);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const onlinePlayersTotal = useMemo(() => {
    return servers.reduce((acc, s) => acc + (s.status === 'online' ? s.players : 0), 0);
  }, [servers]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="bullseye-logo animate-bounce"></div>
          <p className="text-neutral-400 animate-pulse uppercase tracking-[0.2em] text-xs">Loading Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
      {/* Header */}
      <header className="h-14 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-neutral-800 rounded-md transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bullseye-logo"></div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Bullseye<span className="text-brand-500">Gaming</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-neutral-400">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 rounded-full border border-neutral-800">
              <div className="w-2 h-2 rounded-full bg-brand-500 status-pulse"></div>
              <span>{onlinePlayersTotal} PLAYERS</span>
            </div>
          </div>
          <button className="p-2 hover:bg-neutral-800 rounded-md transition-colors">
            <Settings size={18} className="text-neutral-400" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed inset-y-0 left-0 z-40 w-80 bg-neutral-950 border-r border-neutral-800 flex flex-col",
                "lg:relative lg:translate-x-0"
              )}
            >
              <div className="p-4 flex items-center justify-between lg:hidden border-b border-neutral-800">
                <span className="font-bold text-xs uppercase tracking-widest text-neutral-500">Servers</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-neutral-800 rounded">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto sidebar-scroll p-4 space-y-4">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 px-1">
                  Server Network
                </div>
                {servers.map((server) => (
                  <div key={server.id} className="relative group">
                    <button
                      onClick={() => {
                        setSelectedServer(server);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex flex-col gap-3 p-4 rounded-2xl transition-all duration-300 text-left border relative overflow-hidden",
                        selectedServer?.id === server.id
                          ? "bg-brand-500/5 border-brand-500/30 text-white shadow-[0_8px_32px_rgba(237,28,28,0.08)]"
                          : "hover:bg-neutral-900/50 border-neutral-800/50 text-neutral-400 hover:text-neutral-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                          selectedServer?.id === server.id ? "bg-brand-500 text-white" : "bg-neutral-900 text-neutral-600 group-hover:text-neutral-400"
                        )}>
                          <Globe size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate leading-tight mb-1">{server.name}</div>
                          <div className="flex items-center gap-2">
                             <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              server.status === 'online' ? "bg-green-500" : "bg-red-500"
                            )}></div>
                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">
                              {server.status === 'online' ? `${server.players}/${server.maxPlayers} PLAYING` : 'OFFLINE'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} className={cn(
                          "transition-transform opacity-40",
                          selectedServer?.id === server.id ? "rotate-90 opacity-100" : "group-hover:translate-x-1"
                        )} />
                      </div>

                      {/* Quick Actions (Visible when active or hover) */}
                      <div className={cn(
                        "flex items-center gap-2 mt-1 transition-all duration-300",
                        selectedServer?.id === server.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                      )}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyIp(server.id, `${server.id}.bullseyegaming.com`);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] font-bold hover:bg-neutral-800 transition-colors"
                        >
                          {copiedId === server.id ? <Check size={12} className="text-green-500"/> : <Copy size={12}/>}
                          {copiedId === server.id ? "COPIED" : "COPY IP"}
                        </button>
                        <button className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors">
                          <ExternalLink size={12}/>
                        </button>
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-neutral-800 bg-neutral-950/50">
                <div className="bg-neutral-900/50 rounded-2xl p-4 flex items-center gap-3 border border-neutral-800/50">
                  <div className="w-10 h-10 rounded-full border-2 border-brand-500/20 p-0.5">
                    <img src={`https://mc-heads.net/avatar/ThinkAgent/40`} alt="User" className="w-full h-full rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate text-white">ThinkAgent</div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">Member since 2024</div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 relative flex flex-col overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            {selectedServer ? (
              <motion.div 
                key={selectedServer.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 map-container"
              >
                <iframe 
                  src={selectedServer.mapUrl} 
                  title={`${selectedServer.name} BlueMap`}
                  allowFullScreen
                ></iframe>
                
                {/* Floating Map Info Overlay */}
                <div className="absolute top-6 left-6 right-6 pointer-events-none flex justify-between items-start">
                   <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-neutral-950/80 border border-neutral-800 p-5 rounded-[2rem] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto flex items-center gap-5 max-w-sm"
                   >
                     <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                       <Target size={28} />
                     </div>
                     <div>
                       <h2 className="text-base font-black text-white leading-tight mb-1 tracking-tight">{selectedServer.name}</h2>
                       <div className="flex items-center gap-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Users size={14} className="text-brand-500"/> {selectedServer.players} ONLINE</span>
                         <span className="flex items-center gap-1.5"><Layers size={14} className="text-brand-500"/> {selectedServer.version}</span>
                       </div>
                     </div>
                   </motion.div>

                   <div className="flex flex-col gap-3 pointer-events-auto">
                     <button className="w-12 h-12 flex items-center justify-center bg-neutral-950/80 border border-neutral-800 rounded-2xl backdrop-blur-md text-neutral-400 hover:text-white transition-all hover:scale-110 shadow-xl active:scale-95">
                       <ExternalLink size={20} />
                     </button>
                     <button className="w-12 h-12 flex items-center justify-center bg-neutral-950/80 border border-neutral-800 rounded-2xl backdrop-blur-md text-neutral-400 hover:text-white transition-all hover:scale-110 shadow-xl active:scale-95">
                       <Info size={20} />
                     </button>
                   </div>
                </div>

                {/* Legend Overlay (Bottom Right) */}
                <div className="absolute bottom-6 right-6 pointer-events-none">
                  <div className="bg-neutral-950/80 border border-neutral-800 px-4 py-2 rounded-full backdrop-blur-md shadow-2xl pointer-events-auto text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500 status-pulse"></div>
                    BlueMap 3D Engine
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-950">
                <div className="bullseye-logo w-24 h-24 mb-8 opacity-10 scale-150"></div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">System Ready</h3>
                <p className="text-neutral-500 max-w-sm leading-relaxed">Select a terminal from the network directory to initialize the holographic world map projection.</p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
