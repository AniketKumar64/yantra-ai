import { dummyProjects } from '@/assets/assets';
import ProjectPreview from '@/components/Projects/ProjectPreview';
import LoaderStep from '@/components/Projects/LoaderStep'; 
import type { Project, Version } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import  { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '@/Context/axios';
import { authClient } from '@/lib/auth-client';

const Preview = () => {
  const { data: session, isPending } = authClient.useSession();
  const { projectId, versionId } = useParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCode = async () => {
    try{
      const { data } = await api.get(`/api/project/preview/${projectId}`);
      setCode(data.project.current_code);
      if(versionId) {
        data.project.versions.forEach((version: Version) => {
          if(version.id === versionId) {
            setCode(version.code);
          }
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching code:", error);
      setLoading(false);
    }
 };

  useEffect(() => {
    if(!isPending && session?.user) {
      fetchCode();
    } 

  }, [session?.user]);


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