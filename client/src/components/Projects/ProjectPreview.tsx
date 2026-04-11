import { forwardRef, use, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Project } from '@/types/index'
import { iframeScript } from '@/assets/assets';
import EditorPanel from './EditorPanel';


interface projectPreviewprops {
    project: Project;
    isGenerating: boolean;
    device?: 'phone' | 'tablet' | 'desktop';
    showEditorpanel?: boolean;  
}

export interface projectPreviewRef {
    getCode: () => string | undefined;
}

const ProjectPreview = forwardRef<projectPreviewRef, projectPreviewprops>
    (({ project, isGenerating, device = 'desktop', showEditorpanel = true }, ref) => {

        const iframeref = useRef<HTMLIFrameElement>(null);

        const resolution = {
            phone: 'w-[412px]',
            tablet: 'w-[768px]',
            desktop: 'w-full'
        }

        const [selectedElement, setSelectedElement] = useState<any>(null);

        const injectPreview = (html: string) => {
            if (!html) return '';
            if (!showEditorpanel) return html;

            if (html.includes('</body>')) {
                return html.replace('</body>', iframeScript + '</body>');
            } else {
                return html + iframeScript;
            }
        }

        const handleUpdate = (updates: any) => {
            if (iframeref.current?.contentWindow) {
                iframeref.current.contentWindow.postMessage({ type: 'UPDATE_ELEMENT', payload: updates }, '*')
            }
        }

        const handleClose = () => {
            setSelectedElement(null);
            if (iframeref.current?.contentWindow) {
                iframeref.current.contentWindow.postMessage({ type: 'CLEAR_SELECTION_REQUEST' }, '*')
            }
        }

        // useImperativeHandle(ref, () => ({
        //     getCode: () => {
        //         const doc = iframeref.current?.contentDocument;
        //         if (!doc) return undefined;

        //         // remove our selstion class

        //         doc.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach((el) => {
        //             el.classList.remove('ai-selected-element');
        //             el.removeAttribute('data-ai-selected');
        //             (el as HTMLElement).style.outline = '';
        //          });

        //         //  remove our injected script
        //         const previewScript = doc.getElementById('ai-preview-script');
        //         if (previewScript) previewScript.remove()
                    
        //             const previewStyles = doc.getElementById('ai-preview-styles');
        //         if (previewStyles) previewStyles.remove()


        //             // serialize the cleaned document

        //             const html = doc.documentElement.outerHTML;
        //             return html;
                

        //     }
        // }))

        useImperativeHandle(ref, () => ({
    getCode: () => {
        const doc = iframeref.current?.contentDocument;
        if (!doc) return undefined;

        try {
            // Clone the document to avoid modifying the original
            const clonedDoc = doc.cloneNode(true) as Document;
            
            // Remove selection classes and attributes
            clonedDoc.querySelectorAll('.ai-selected-element, [data-ai-selected]').forEach((el) => {
                el.classList.remove('ai-selected-element');
                el.removeAttribute('data-ai-selected');
                (el as HTMLElement).style.outline = '';
            });

            // Remove injected script
            const previewScript = clonedDoc.getElementById('ai-preview-script');
            if (previewScript) {
                previewScript.remove();
            }
            
            // Remove injected styles
            const previewStyles = clonedDoc.getElementById('ai-preview-styles');
            if (previewStyles) {
                previewStyles.remove();
            }

            // Serialize the cleaned document
            const html = clonedDoc.documentElement.outerHTML;
            return html;
        } catch (error) {
            console.error('Error getting code:', error);
            return undefined;
        }
    }
}))






        useEffect(() => {
            const handleMessage = (event: MessageEvent) => {
                if (event.data.type === 'ELEMENT_SELECTED') {
                    setSelectedElement(event.data.payload);
                } else if (event.data.type === 'clear_selection') {
                    setSelectedElement(null);
                }
            };

            window.addEventListener('message', handleMessage);

            return () => {
                window.removeEventListener('message', handleMessage);
            };
        }, [])

        return (
  <div className="relative h-screen w-full bg-[var(--background)] overflow-hidden">      {
                    project.current_code ? (
                        <>
                            <iframe
                                title="Project Preview"
                                ref={iframeref}
                                srcDoc={injectPreview(project.current_code)}
                                className={`h-full max-sm:w-full ${resolution[device]} mx-auto transition-all duration-300 border-0`}
                            />
                            {showEditorpanel && selectedElement && (
                                <EditorPanel
                                    selectedElement={selectedElement}
                                    onUpdate={handleUpdate}
                                    onClose={handleClose}
                                />
                            )}
                        </>
                    ) : isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                <div className="text-white text-lg font-medium">Generating preview...</div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    })

ProjectPreview.displayName = 'ProjectPreview';

export default ProjectPreview