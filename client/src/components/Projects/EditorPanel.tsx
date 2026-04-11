import { useEffect, useState } from "react";
import { X, Palette, Layout, Terminal, Maximize2, Move, Box, Hash } from "lucide-react";
import { motion } from "framer-motion";

interface ElementStyles {
  padding: string;
  margin: string;
  color: string;
  backgroundColor: string;
  fontSize: string;
}

interface SelectedElement {
  tagName: string;
  className: string;
  text: string;
  styles: ElementStyles;
}

interface EditorPanelProps {
  selectedElement: SelectedElement | null;
  onUpdate: (updates: Partial<SelectedElement>) => void;
  onClose: () => void;
}

const EditorPanel = ({
  selectedElement,
  onUpdate,
  onClose,
}: EditorPanelProps) => {
  const [values, setValues] = useState<SelectedElement | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "style">("content");

  useEffect(() => {
    if (selectedElement) {
      setValues(selectedElement);
    }
  }, [selectedElement]);

  const handleChange = (field: keyof Omit<SelectedElement, "styles">, value: string) => {
    if (!values) return;
    const updatedValues = { ...values, [field]: value };
    setValues(updatedValues);
    onUpdate({ [field]: value });
  };

  const handleStyleChange = (styleName: keyof ElementStyles, value: string) => {
    if (!values) return;
    const updatedStyles = { ...values.styles, [styleName]: value };
    const updatedValues = { ...values, styles: updatedStyles };
    setValues(updatedValues);
    onUpdate({ styles: updatedStyles });
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : hex;
  };

  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith("#")) return rgb;
    if (rgb === "rgba(0,0,0,0)") return "#ffffff";
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return "#ffffff";
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  if (!selectedElement || !values) return null;

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-24 right-8 w-80 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl z-[60] overflow-hidden flex flex-col ring-1 ring-[var(--foreground)]/5"
    > 
      {/* Header - Using --muted for a subtle lift */}
      <div className="px-4 py-3.5 flex items-center justify-between bg-[var(--muted)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="bg-[var(--primary)]/10 p-1.5 rounded-md">
            <Terminal size={14} className="text-[var(--primary)]" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground)]">Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] p-1 rounded-md transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Selector Tag */}
      <div className="px-4 py-2 bg-[var(--card)] flex items-center gap-2">
         <span className="text-[10px] font-mono font-medium text-[var(--primary)]">node:</span>
         <span className="text-[10px] font-mono text-[var(--foreground)] px-1.5 py-0.5 bg-[var(--secondary)] rounded border border-[var(--border)]">
           {values.tagName.toLowerCase()}
         </span>
      </div>

      {/* Tab Switcher - Segmented Control */}
      <div className="px-4 py-2">
        <div className="flex p-1 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
              activeTab === "content" 
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" 
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Layout size={13} /> Content
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
              activeTab === "style" 
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" 
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Palette size={13} /> Style
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5 overflow-y-auto max-h-[60vh] custom-scrollbar">
        {activeTab === "content" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest">Text Value</label>
              <textarea
                value={values.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full h-24 bg-[var(--input)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest">Tailwind Classes</label>
              <div className="relative">
                <Hash size={12} className="absolute left-3 top-3 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  value={values.className || ""}
                  onChange={(e) => handleChange("className", e.target.value)}
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--primary)] font-mono focus:border-[var(--primary)] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase">Background</label>
                <div className="flex items-center bg-[var(--input)] border border-[var(--border)] rounded-lg p-1.5 gap-2 focus-within:ring-1 ring-[var(--primary)]">
                  <input
                    type="color"
                    value={rgbToHex(values.styles.backgroundColor)}
                    onChange={(e) => handleStyleChange("backgroundColor", hexToRgb(e.target.value))}
                    className="w-5 h-5 bg-transparent border-none cursor-pointer overflow-hidden rounded-sm"
                  />
                  <span className="text-[10px] font-mono text-[var(--foreground)] uppercase">{rgbToHex(values.styles.backgroundColor)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase">Text Color</label>
                <div className="flex items-center bg-[var(--input)] border border-[var(--border)] rounded-lg p-1.5 gap-2 focus-within:ring-1 ring-[var(--primary)]">
                  <input
                    type="color"
                    value={rgbToHex(values.styles.color)}
                    onChange={(e) => handleStyleChange("color", hexToRgb(e.target.value))}
                    className="w-5 h-5 bg-transparent border-none cursor-pointer overflow-hidden rounded-sm"
                  />
                  <span className="text-[10px] font-mono text-[var(--foreground)] uppercase">{rgbToHex(values.styles.color)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase"><Maximize2 size={12}/> Size</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={parseInt(values.styles.fontSize) || 16}
                        onChange={(e) => handleStyleChange("fontSize", `${e.target.value}px`)}
                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                      />
                      <span className="absolute right-3 top-2.5 text-[9px] text-[var(--muted-foreground)] font-bold">PX</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase"><Move size={12}/> Margin</label>
                    <input
                      type="text"
                      value={values.styles.margin}
                      onChange={(e) => handleStyleChange("margin", e.target.value)}
                      className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase"><Box size={12}/> Padding</label>
                 <input
                    type="text"
                    value={values.styles.padding}
                    onChange={(e) => handleStyleChange("padding", e.target.value)}
                    className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                 />
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-[var(--muted)] border-t border-[var(--border)] flex justify-end">
     <motion.button
          whileHover={{ scale: 1.02,  }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-5 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-[11px] font-bold rounded-lg transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EditorPanel;