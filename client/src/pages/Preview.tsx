import { dummyProjects } from '@/assets/assets';
import ProjectPreview from '@/components/Projects/ProjectPreview';
import LoaderStep from '@/components/Projects/LoaderStep'; 
import type { Project } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import  { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const Preview = () => {
  const { projectId, versionId } = useParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCode = async () => {
    setLoading(true);
  
    // Simulating the architectural build time
    setTimeout(() => {
        const foundCode = dummyProjects.find(p => p.id === projectId)?.current_code;
    
      if (foundCode) {
        setCode(foundCode);
        setLoading(false);
      }
    }, 4000); // Slightly longer to let the LoaderStep show progress
  };

  useEffect(() => {
    fetchCode();
  }, [projectId]);


return (
  <div className="bg-[var(--background)] min-h-screen w-full">
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center min-h-screen"
        >
          <LoaderStep />
        </motion.div>
      ) : (
 <>
          {code && (
            <ProjectPreview 
              project={{ current_code: code } as Project} 
              isGenerating={false} 
              showEditorpanel={false} 
            />
          )}
       </>
      )}
    </AnimatePresence>
  </div>

  );
};

export default Preview;