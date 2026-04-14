import { dummyProjects } from '@/assets/assets';
import ProjectPreview from '@/components/Projects/ProjectPreview';
import LoaderStep from '@/components/Projects/LoaderStep'; 
import type { Project } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '@/Context/axios';

const View = () => {
  const { projectId } = useParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCode = async () => {
    try{
      const { data } = await api.get(`/api/project/published/${projectId}`);
      setCode(data.code);
      setLoading(false);
    }
    catch(error) {
      console.error("Error fetching code:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCode();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <LoaderStep />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            {code && (
              <ProjectPreview 
                project={{ current_code: code } as Project} 
                isGenerating={false} 
                showEditorpanel={false} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default View;