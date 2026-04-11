import { motion, AnimatePresence } from "framer-motion"
import { Code } from "lucide-react"

type Props = {
  project: any
  projectId?: string
  device: 'phone' | 'tablet' | 'desktop'
  activeTab: 'preview' | 'code'
  deviceWidths: Record<string, string>
}

const RightSode = ({ project, device, activeTab, deviceWidths }: Props) => {
  return (
    <section className="flex-1 flex flex-col p-4 overflow-hidden">
      
      <div className="flex-1 bg-[#0f0f0f] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col">

        {/* Viewport ONLY */}
        <div className="flex-1 overflow-auto flex justify-center items-center p-6 bg-gradient-to-b from-[#0a0a0a] to-[#111]">

          <motion.div 
            layout
            className={`w-full h-full bg-white rounded-xl shadow-2xl transition-all duration-500 overflow-hidden ${deviceWidths[device]}`}
          >
            <AnimatePresence mode="wait">
              
              {activeTab === 'preview' ? (
                <motion.div 
                  key="iframe" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="w-full h-full"
                >
                  {project?.current_code ? (
                    <iframe
                      srcDoc={project.current_code}
                      className="w-full h-full border-none"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
                      <Code size={40} className="text-white/10" />
                      <p className="text-xs text-white/30 uppercase tracking-widest font-mono">
                        Waiting for build...
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="code" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="w-full h-full bg-[#0d0d0d] p-6 font-mono text-[13px] text-emerald-400 overflow-auto"
                >
                  <pre className="whitespace-pre-wrap">
                    {project?.current_code || "// System architect ready..."}
                  </pre>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default RightSode