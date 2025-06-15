
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, ArrowUp, ArrowDown } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagManager = ({ tags, onChange, placeholder = "Adicionar tag...", maxTags = 10 }: TagManagerProps) => {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < maxTags) {
      onChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    onChange(updatedTags);
  };

  const moveTag = (index: number, direction: 'up' | 'down') => {
    const newTags = [...tags];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < tags.length) {
      [newTags[index], newTags[newIndex]] = [newTags[newIndex], newTags[index]];
      onChange(newTags);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-4">
      {/* Add new tag */}
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
        />
        <Button
          type="button"
          onClick={addTag}
          disabled={!newTag.trim() || tags.includes(newTag.trim()) || tags.length >= maxTags}
          className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tags list */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Tags ({tags.length}/{maxTags})</label>
          <div className="space-y-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                <span className="flex-1 text-white">{tag}</span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveTag(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveTag(index, 'down')}
                    disabled={index === tags.length - 1}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(index)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManager;
