import { Edit2, Trash2, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Custom scrollbar styles
const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb, rgba(0, 0, 0, 0.2));
    border-radius: 3px;
  }
  
  .dark .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb-dark, rgba(255, 255, 255, 0.15));
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-thumb-hover, rgba(0, 0, 0, 0.3));
  }
  
  .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-thumb-dark-hover, rgba(255, 255, 255, 0.25));
  }
`;

interface Paraphrase {
  id: string;
  paraphrased: string;
}
interface ParaphraseProps {
  variations: string[];
  isLoading?: boolean;
  type?: 'random' | 'select';
}
export default function ParaphraseList(props: ParaphraseProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<Paraphrase | null>(
    null
  );
  const [editText, setEditText] = useState('');

  const [paraphrases, setParaphrases] = useState<Paraphrase[]>(() => {
    // Check if variations exists and is a non-empty array
    const isValidArray =
      Array.isArray(props.variations) && props.variations.length > 0;

    if (isValidArray) {
      return props.variations.map((text: string, index: number) => ({
        id: String(index + 1),
        paraphrased: text,
      }));
    }

    console.log(
      'Creating empty paraphrases array because variations is:',
      Array.isArray(props.variations) ? 'empty array' : typeof props.variations
    );
    return [];
  });
  // Use useEffect to update paraphrases when props.variations changes
  useEffect(() => {
    if (Array.isArray(props.variations) && props.variations.length > 0) {
      setParaphrases(
        props.variations.map((text: string, index: number) => ({
          id: String(index + 1),
          paraphrased: text,
        }))
      );
    }
  }, [props.variations]); // Function to open edit dialog
  const handleEdit = (id: string) => {
    const itemToEdit = paraphrases.find((item) => item.id === id);
    if (itemToEdit) {
      setCurrentEditItem(itemToEdit);
      setEditText(itemToEdit.paraphrased);
      setEditDialogOpen(true);
    }
  };

  // Function to save edits
  const handleSaveEdit = () => {
    if (currentEditItem && editText.trim()) {
      setParaphrases(
        paraphrases.map((item) =>
          item.id === currentEditItem.id
            ? { ...item, paraphrased: editText.trim() }
            : item
        )
      );
      setEditDialogOpen(false);
      setCurrentEditItem(null);
    }
  };

  // Function to handle delete
  const handleDelete = (id: string) => {
    setParaphrases(paraphrases.filter((item) => item.id !== id));
  };
  return (
    <TooltipProvider>
      <style jsx global>
        {scrollbarStyles}
      </style>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        {' '}
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Paraphrase</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea
              className="w-full p-4 border rounded-md min-h-[150px] text-base dark:bg-gray-900 dark:border-gray-700"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Edit your paraphrased text..."
            />
          </div>
          <DialogFooter>
            <button
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md mr-2"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
              onClick={handleSaveEdit}
              disabled={!editText.trim()}
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 flex justify-between text-xs font-medium sticky top-0 z-10">
            <div>Paraphrased Text</div>
            <div>Actions</div>
          </div>
          {props.isLoading ? (
            <div className="px-3 py-8 text-center text-gray-500 text-sm">
              Loading paraphrases...
            </div>
          ) : paraphrases.length === 0 ? (
            <div className="px-3 py-8 text-center text-gray-500 text-sm">
              No paraphrases available.
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {paraphrases.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                    delay: index * 0.08,
                  }}
                >
                  {' '}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1 cursor-help pr-4">
                        {item.paraphrased}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] text-xs">
                      {item.paraphrased}
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex-shrink-0 flex space-x-1">
                    {props.type !== 'random' && (
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-0.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        title="Add One"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="p-0.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-0.5 text-red-600 hover:text-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Delete"
                    >
                      <Trash2 size={14} />{' '}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}{' '}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
