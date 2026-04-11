import type { Project } from '@/types/index'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Sparkles, Smartphone, Tablet, Monitor, Save, Download, MoreVertical, RefreshCw, Code, Eye, Trash2, Copy, ExternalLink, X, MessageSquare } from 'lucide-react'
import { dummyConversations, dummyProjects, dummyVersion } from '@/assets/assets'
import Leftside from '@/components/Projects/Leftside'
import RightSide from '@/components/Projects/RightSode'
import ProjectPreview from '@/components/Projects/ProjectPreview'
import type { projectPreviewRef } from '@/components/Projects/ProjectPreview'
import { downloadCode } from '@/utils/download'
import LoaderStep from '@/components/Projects/LoaderStep'

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const [isGenerating, setIsGenerating] = useState(false)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const [isSaving, setIsSaving] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false);

  const previewRef = useRef<projectPreviewRef>(null);

  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

const fetchProject = async () => {
  const project = dummyProjects.find(project => project.id === projectId)
  setTimeout(() => {
    if(project) {
      setProject({...project, conversation: dummyConversations, versions: dummyVersion});
      setLoading(false)
      setIsGenerating(project.current_code ? false : true)
    }
  },2000)
}









const handleSave = () => {
  console.log("Saving project...")
}

const handlePublish = () => {
  console.log("Publishing project...")
}

const handleUnpublish = () => {
  console.log("Unpublishing project...")
}

// for code
const handleCopy = () => {
  const code = previewRef.current?.getCode() || project?.current_code ;
  if(!code) {
    if(isGenerating) {
     return;
    }
    return alert("No code available to copy!");
  }

  const element = document.createElement('a');
  const file = new Blob([code], { type: 'text/html' });
  element.href = URL.createObjectURL(file);
  element.download = 'index.html';
  document.body.appendChild(element);
  element.click();
  // document.body.removeChild(element);
}

const handlereactDownload = () => {
  const code = previewRef.current?.getCode();

  if (!code) {
    alert("No code to download");
    return;
  }

  downloadCode(code, {
    filename: 'YantraComponent',
    format: 'jsx',
    projectName: 'yantraai'
  });
};


const handleDelete = () => {
  console.log("Deleting project...")
}


  useEffect(() => { fetchProject() }, [projectId])

  const deviceWidths = {
    phone: 'max-w-[375px]',
    tablet: 'max-w-[768px]',
    desktop: 'max-w-full',
  }



  return project ?(
     <div className="h-screen bg-[var(--background)] flex flex-col overflow-hidden text-[var(--foreground)]">
      
      {/* --- ELITE HEADER --- */}
    <header className="h-14 border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-xl flex items-center justify-between px-3 md:px-4 z-50">

  <div className="flex items-center gap-2 md:gap-4">

    <button 
      onClick={() => navigate('/projects')}
      className="p-2 hover:bg-[var(--foreground)]/5 rounded-lg transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
    >
      <ChevronLeft size={18} />
    </button>

    <div className="hidden md:block h-4 w-px bg-[var(--border)]" />

    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
        <Sparkles size={14} />
      </div>

      <span className="text-sm font-semibold truncate max-w-[120px] md:max-w-[200px]">
        {project?.name}
      </span>

      {/* Status Badge */}
      <span className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold 
        ${project?.isPublished 
          ? 'bg-emerald-500/10 text-emerald-400' 
          : 'bg-yellow-500/10 text-yellow-400'
        }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {project?.isPublished ? "Published" : "Draft"}
      </span>
    </div>
  </div>

  {/* CENTER (DEVICE SWITCHER - HIDDEN ON SMALL) */}
  <div className="hidden md:flex items-center bg-[var(--muted)]/20 p-1 rounded-xl border border-[var(--border)]">
    {[
      { key: 'phone', icon: Smartphone },
      { key: 'tablet', icon: Tablet },
      { key: 'desktop', icon: Monitor },
    ].map((d) => (
      <button
        key={d.key}
        onClick={() => setDevice(d.key as any)}
        className={`p-1.5 rounded-lg transition-all ${
          device === d.key
            ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm'
            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
        }`}
      >
        <d.icon size={16} />
      </button>
    ))}
  </div>

  {/* RIGHT */}
  <div className="flex items-center gap-1 md:gap-2">

    {/* MOBILE DEVICE SWITCH */}
    <div className="flex md:hidden items-center bg-[var(--muted)]/20 p-1 rounded-lg border border-[var(--border)]">
      {[Smartphone, Tablet, Monitor].map((Icon, i) => (
        <button key={i} className="p-1 text-[var(--muted-foreground)]">
          <Icon size={14} />
        </button>
      ))}
    </div>

    {/* TAB SWITCHER */}
    <div className="hidden sm:flex items-center p-1 bg-[var(--muted)]/20 rounded-xl border border-[var(--border)]">
      <button 
        onClick={() => setActiveTab('preview')}
        className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-lg text-xs font-medium transition-all ${
          activeTab === 'preview'
            ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
            : 'text-[var(--muted-foreground)]'
        }`}
      >
        <Eye size={12} /> <Link to={`/preview/${project?.id}`} className="hidden md:inline">Preview</Link>
      </button>

      <button 
        onClick={() => setActiveTab('code')}
        className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-lg text-xs font-medium transition-all ${
          activeTab === 'code'
            ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
            : 'text-[var(--muted-foreground)]'
        }`}
      >
        <Code size={12} /> <span className="hidden md:inline">Code</span>
      </button>
    </div>

    {/* SAVE BUTTON */}
    <button 
      onClick={handleSave}
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--foreground)]/5 transition-all"
    >
      <Save size={14} />
      <span className="hidden md:inline">Save</span>
    </button>

    {/* PUBLISH / UNPUBLISH */}
    <button 
      onClick={project?.isPublished ? handleUnpublish : handlePublish}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
        project?.isPublished
          ? 'bg-red-500 text-white hover:opacity-90 shadow-red-500/20'
          : 'bg-[var(--primary)] text-white hover:opacity-90 shadow-[var(--primary)]/20'
      }`}
    >
      {project?.isPublished ? <ExternalLink size={14} /> : <Download size={14} />}
      <span className="hidden sm:inline">
        {project?.isPublished ? "Unpublish" : "Publish"}
      </span>
    </button>

    {/* MENU */}
    <div className="relative">
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 hover:bg-[var(--foreground)]/5 rounded-lg text-[var(--muted-foreground)]"
      >
        <MoreVertical size={18} />
      </button>

  <AnimatePresence>
  {isMenuOpen && (
   <motion.div 
  initial={{ opacity: 0, y: 10 }} 
  animate={{ opacity: 1, y: 0 }} 
  exit={{ opacity: 0, y: 10 }}
  className="absolute right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-xl p-1.5 shadow-2xl z-50"
>

  {/* Copy */}
  <button
    onClick={handleCopy}
    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-[var(--muted-foreground)] hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
  >
    <Copy size={14} />
    Copy Source
  </button>

  {/* Reset */}
<button
  onClick={handlereactDownload}
  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-[var(--muted-foreground)] hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
>
  <RefreshCw
    size={14}
    className={loading ? "animate-spin" : ""}
  />
  {loading ? "Downloading..." : "React Download"}
</button>

  {/* Divider */}
  <div className="h-px bg-[var(--border)] my-1" />

  {/* Delete */}
  <button
    onClick={handleDelete}
    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-red-400 hover:bg-red-500/10"
  >
    <Trash2 size={14} />
    Delete Project
  </button>

</motion.div>
  )}
</AnimatePresence>
    </div>

  </div>
</header>

      {/* --- MAIN CONTENT --- */}
   <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[var(--background)]">

  <AnimatePresence>
  {isChatOpen && (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-[var(--background)]"
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-[var(--border)]">
        <span className="text-sm font-semibold">AI Chat</span>
        <button onClick={() => setIsChatOpen(false)}>
          <X size={18} />
        </button>
      </div>

      {/* Chat Content */}
      <Leftside
        isMenuOpen={isMenuOpen}
        setProject={(p)=> setProject(p)}
        project={project!}
        isGenerating={isGenerating}
        setisGenerating={setIsGenerating}
      />
    </motion.div>
  )}
</AnimatePresence>

   <Leftside 
    isMenuOpen={isMenuOpen} 
    setProject={(p)=> setProject(p)} 
    project={project!} 
    isGenerating={isGenerating}
    setisGenerating={setIsGenerating}
   />
   <div className="flex-1 p-2 pl-0">
    <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} />
   </div>
<div className="fixed md:hidden bottom-4 right-4 z-50">
  
  <button
    onClick={() => setIsChatOpen(true)}
    className="
      flex items-center gap-2
      px-4 py-3
      rounded-full 
      bg-[var(--primary)] text-white 
      shadow-lg shadow-[var(--primary)]/30
      active:scale-95
      transition-all duration-200
    "
  >
    <MessageSquare size={18} />
    <span className="text-sm font-medium">
      Edit Page
    </span>
  </button>

</div>
    {/* <RightSide
      project={project!}
      device={device}
      activeTab={activeTab}
      deviceWidths={deviceWidths}
    /> */}


</main>
    </div>
  ):( 
    <>
    <LoaderStep />
    </>
  )
}

export default Projects;