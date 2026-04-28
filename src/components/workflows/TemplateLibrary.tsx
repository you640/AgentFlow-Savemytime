import React from 'react';
import { motion } from 'motion/react';
import { WORKFLOW_TEMPLATES, WorkflowTemplate } from '../../constants/templates';
import { cn } from '../../lib/utils';
import { ArrowRight, Sparkles } from 'lucide-react';

interface TemplateLibraryProps {
  onSelect: (template: WorkflowTemplate) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-brand-cyan" />
        <h3 className="text-lg font-bold">Standard Blueprints</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WORKFLOW_TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onSelect(template)}
            className="glass-card p-6 cursor-pointer group flex flex-col h-full"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-brand-cyan/10 transition-colors">
              <template.icon className="w-6 h-6 text-white/40 group-hover:text-brand-cyan transition-colors" />
            </div>
            
            <h4 className="font-bold text-white mb-2">{template.name}</h4>
            <p className="text-white/30 text-xs leading-relaxed flex-1">
              {template.description}
            </p>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                {template.nodes.map((node, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-bg-dark border border-white/10 flex items-center justify-center p-1 shadow-lg">
                    <node.icon className="w-3 h-3 text-white/40 font-bold" />
                  </div>
                ))}
              </div>
              <button className="text-[10px] uppercase font-bold text-brand-cyan flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Deploy <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
