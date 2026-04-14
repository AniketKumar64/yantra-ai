import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Project } from '@/types/index'
import { Code, Globe, User, ExternalLink, Activity } from 'lucide-react'
import AnimatedGridBackground from '../components/Common/AnimatedGridBackground'
import api from '@/Context/axios'

const Community = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  const fetchProjects = async () => {
    try{
      const { data }= await api.get("/api/project/published");

      setProjects(data.projects)
      setLoading(false)

    }
    catch(error) {
      console.error("Error fetching published projects:", error)
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="relative min-h-screen py-24 px-4 md:px-16 lg:px-24 xl:px-32 bg-[var(--background)] overflow-hidden">
      <AnimatedGridBackground />
      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14 flex flex-col items-center text-center gap-6"
        >
          <div onClick={() => navigate("/")} className="cursor-pointer group flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 mb-2">
              <Globe size={14} className="text-[var(--primary)]" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--primary)]">
                Global Network
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-none tracking-tighter text-[var(--foreground)]">
              Community <span className="text-[var(--primary)] font-medium">Showcase</span>
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm md:text-base font-body max-w-lg mt-2">
              Explore sophisticated neural applications developed and deployed by network members worldwide.
            </p>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 w-full h-[40vh]">
            <motion.div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full border border-[var(--border)] border-t-[var(--primary)]"
              />
              <Activity size={14} className="absolute text-[var(--primary)] animate-pulse" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[var(--muted-foreground)] font-mono tracking-[0.1em] text-xs"
            >
              Syncing Network Nodes...
            </motion.p>
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center py-32 gap-6 border border-[var(--border)]/50 rounded-2xl bg-[var(--card)]/30 backdrop-blur-lg"
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/10 flex items-center justify-center">
              <Globe size={24} className="text-[var(--primary)]" />
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-xl font-medium text-[var(--foreground)] tracking-tight font-display mb-2">No public nodes</h2>
              <p className="text-[var(--muted-foreground)] text-sm max-w-sm font-body">
                The global network is silent. Transmit your project to establish the first connection.
              </p>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                }}
                className="group relative bg-[var(--card)]/40 backdrop-blur-xl border border-[var(--border)]/60 hover:border-[var(--primary)]/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-lg bg-[var(--border)]/50 flex items-center justify-center shrink-0 border border-[var(--border)] group-hover:bg-[var(--primary)]/10 group-hover:border-[var(--primary)]/20 transition-colors">
                      <Code size={16} className="text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      Live
                    </span>
                  </div>

                  {/* Preview Region */}
           {project.current_code ? (
  <div className="relative w-full h-96 rounded-xl border border-[var(--border)]/50 bg-black/80 overflow-hidden group transition-colors hover:border-[var(--primary)]/30">
    
    <div className="absolute inset-0 origin-top-left scale-[0.6] w-[166.66%] h-[166.66%] transition-transform duration-500 group-hover:scale-[0.65]">
      <iframe
        srcDoc={project.current_code}
        title={project.name}
        className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)]/80 via-transparent to-transparent pointer-events-none" />
  </div>
) : (
  <div className="w-full h-48 rounded-xl border border-[var(--border)]/50 bg-[var(--muted)]/20 flex flex-col items-center justify-center gap-2 transition-colors hover:border-[var(--primary)]/30">
    <Code size={20} className="text-[var(--muted-foreground)]/30" />
    <span className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest">
      No Preview
    </span>
  </div>
)}

                  {/* Title & Description */}
                  <div>
                    <Link to={`/view/${project.id}`} target="_blank" className="text-lg font-medium tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors capitalize">
                      {project.name}
                    </Link>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed capitalize line-clamp-2 mt-1 font-body">
                      {project.initial_prompt || "Unspecified neural architecture."}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[var(--border)]/50 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
                      <User size={10} className="text-[var(--primary)]" />
                    </div>
                    <span className="text-[11px] font-medium text-[var(--muted-foreground)] font-mono">
                      {project.user?.name ?? "Anonymous"}
                    </span>
                  </div>

                  <Link
                    to={`/view/${project.id}`}
                    target="_blank"
                    className="flex items-center gap-1.5 text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] px-3 py-1.5 rounded-md transition-colors"
                  >
                    <ExternalLink size={12} />
                    View Node
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Community