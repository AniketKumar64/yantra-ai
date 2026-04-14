import type { Project } from '../types/index'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FolderOpen, Code, Plus, Trash2, ExternalLink, Zap, TerminalSquare } from 'lucide-react'
import AnimatedGridBackground from '../components/Common/AnimatedGridBackground'
import api from '@/Context/axios'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

const MyProjects = () => {
  const {data: session , isPending} = authClient.useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchProjects = async () => {
   try{
    const { data } = await api.get('/me/projects')
    setProjects(data.projects)
    setLoading(false)
    
   }catch(error) {
    console.error("Error fetching projects:", error)
    toast.error("Failed to load projects. Please try again later.");
    setLoading(false)
   }
  }

  const deleteProject = async (projectId: string) => {
    try{

      const confirm = window.confirm("Are you sure you want to delete this project? This action cannot be undone.")
      if(!confirm) return;
      const { data } = await api.delete(`/api/project/${projectId}`)
      toast.success(data.message || "Project deleted successfully")
      fetchProjects();

    }catch(error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project. Please try again later.")
    }
  }

  useEffect(() => {
    if(!isPending && !session?.user) {
      
      navigate('/')
      toast.error("You need to be logged in to view your projects.")
    } else if(session?.user && !isPending) {
      fetchProjects()
    }
    
  }, [session?.user])

  return (
    <div className="relative min-h-screen py-24 px-4 md:px-16 lg:px-24 xl:px-32 bg-[var(--background)] overflow-hidden">
      <AnimatedGridBackground />
      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div onClick={() => navigate("/")} className="cursor-pointer group flex flex-col gap-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 w-fit mb-2">
              <TerminalSquare size={14} className="text-[var(--primary)]" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--primary)]">
                Dashboard / Workspaces
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-none tracking-tighter text-[var(--foreground)]">
              Your <span className="text-[var(--primary)] font-medium">Projects</span>
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm md:text-base font-body max-w-lg mt-2">
              A highly-structured repository of all your neural-generated applications. Review, manage, and deploy in one place.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/20 transition-all font-body w-fit backdrop-blur-md"
          >
            <Plus size={16} />
            Initialize Project
          </motion.button>
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
              <Code size={14} className="absolute text-[var(--primary)] animate-pulse" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[var(--muted-foreground)] font-mono tracking-[0.1em] text-xs"
            >
              Syncing Neural Data...
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
              <FolderOpen size={24} className="text-[var(--primary)]" />
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-xl font-medium text-[var(--foreground)] tracking-tight font-display mb-2">No projects found</h2>
              <p className="text-[var(--muted-foreground)] text-sm max-w-sm font-body">
                The repository is currently empty. Initialize a new protocol to generate an application.
              </p>
            </div>

            <button
              className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity font-body"
            >
              <Zap size={14} />
              Start Building
            </button>
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
  onClick={()=>navigate(`/project/${project.id}`)}
    key={project.id}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    }}
    className="group relative flex flex-col h-full bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-[0_0_25px_-10px_var(--primary)]"
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]/50 bg-[var(--muted)]/5">
      <div className="flex items-center gap-2">
        <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        <span className="text-[11px] font-medium text-[var(--foreground)]/70 uppercase">
          {project.name}
        </span>
      </div>
      <div className="flex gap-1">
        <div className="h-1 w-1 rounded-full bg-[var(--border)]" />
        <div className="h-1 w-1 rounded-full bg-[var(--border)]" />
      </div>
    </div>

    <div className="relative flex-1 p-5 space-y-4">
      <p className="text-[13px] leading-relaxed text-[var(--muted-foreground)] line-clamp-3">
        {project.initial_prompt || "Standard architectural system deployment."}
      </p>

      <div className="relative aspect-video rounded-lg border border-[var(--border)]/60 bg-black/60 overflow-hidden group-hover:border-[var(--primary)]/30 transition-all">
        
        <div className="absolute top-0 left-0 right-0 h-6 bg-black/70 backdrop-blur flex items-center gap-1 px-2 z-10">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>

        {project.current_code ? (
          <div className="absolute inset-0 pt-6 overflow-hidden">
            
            <div className="absolute inset-0 origin-top-left scale-[0.62] w-[161%] h-96 transition-transform duration-500 group-hover:scale-[0.68]">
              <iframe
                srcDoc={project.current_code}
                title={project.name}
                className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.4))] pointer-events-none" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[var(--border)]" />
              <span className="text-[10px] font-mono text-[var(--muted-foreground)]/40">
                EMPTY_STATE
              </span>
              <div className="h-px w-8 bg-[var(--border)]" />
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="mt-auto px-4 py-3 bg-[var(--muted)]/10 border-t border-[var(--border)]/50 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
          v1.0.4
        </span>
        <span className="text-[var(--border)]">•</span>
        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
          {new Date(project.createdAt).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          })}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Link
          to={`/preview/${project.id}`}
          className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all"
        >
          <ExternalLink size={15} strokeWidth={1.5} />
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteProject(project.id);
          }}
          className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <Trash2 size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  </motion.div>
))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MyProjects