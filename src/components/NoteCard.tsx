import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  index: number;
}

export function NoteCard({ note, index }: NoteCardProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 50,
        scale: 0.9 
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1 
      }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className="glass-card p-6 cursor-pointer relative overflow-hidden group"
    >
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-nebula-purple/0 via-nebula-blue/0 to-nebula-accent/0 group-hover:from-nebula-purple/20 group-hover:via-nebula-blue/20 group-hover:to-nebula-accent/20 transition-all duration-500" />
      
      {/* Mood indicator */}
      {note.mood && (
        <div className="absolute top-4 right-4 text-2xl animate-float">
          {note.mood}
        </div>
      )}
      
      {/* Content */}
      <Link to={`/note/${note.slug}`} className="relative z-10">
        {/* AI-generated subtitle */}
        {note.aiSubtitle && (
          <p className="text-sm text-nebula-accent mb-2 font-medium tracking-wide">
            ✦ {note.aiSubtitle}
          </p>
        )}
        
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 gradient-text line-clamp-2">
          {note.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {note.excerpt}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-nebula-accent/50 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Personality & Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {note.personality && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-nebula-accent" />
              {note.personality}
            </span>
          )}
          <span>{new Date(note.updatedAt).toLocaleDateString('zh-CN')}</span>
        </div>
      </Link>
      
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-nebula-accent/20 via-nebula-glow/20 to-nebula-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}
