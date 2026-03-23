import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import type { Editor } from '@tiptap/react';
import { useEffect, useState, useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Write something...' }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-emerald max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
      handleDrop: (_view, event, _slice, moved) => {
        // Handle image drop/paste
        if (!moved && event.dataTransfer?.files?.length) {
          const files = Array.from(event.dataTransfer.files);
          const imageFile = files.find(file => file.type.startsWith('image/'));
          if (imageFile) {
            event.preventDefault();
            handleImageUpload(imageFile);
            return true;
          }
        }
        return false;
      },
    },
    editable: true,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!editor || !file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Get token from localStorage (use same key as authApi.ts)
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login first');
        return;
      }

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }

      const result = await response.json();
      const imageUrl = result.data.url;

      // Insert image into editor
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <Toolbar 
        editor={editor} 
        onImageUpload={() => fileInputRef.current?.click()}
        isUploading={isUploading}
      />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {/* Editor Content */}
      <div className="border-t border-outline-variant">
        <EditorContent editor={editor} />
      </div>
      
      {/* Upload indicator */}
      {isUploading && (
        <div className="absolute bottom-4 right-4 bg-primary text-on-primary px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}

interface ToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
  isUploading: boolean;
}

function Toolbar({ editor, onImageUpload, isUploading }: ToolbarProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const addLink = () => {
    const existingUrl = editor.getAttributes('link').href;
    setLinkUrl(existingUrl || '');
    setShowLinkModal(true);
  };

  const confirmLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkModal(false);
    setLinkUrl('');
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-outline-variant bg-surface-container-low" onMouseDown={(e) => e.preventDefault()}>
      {/* Headings */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-on-primary' : ''}`}
        title="Heading 1"
      >
        <span className="material-symbols-outlined text-sm">title</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-on-primary' : ''}`}
        title="Heading 2"
      >
        <span className="material-symbols-outlined text-sm">subtitle</span>
      </button>
      
      <div className="w-px h-6 bg-outline-variant/50 mx-1"></div>
      
      {/* Text Formatting */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('bold') ? 'bg-primary text-on-primary' : ''}`}
        title="Bold"
      >
        <span className="material-symbols-outlined text-sm">format_bold</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('italic') ? 'bg-primary text-on-primary' : ''}`}
        title="Italic"
      >
        <span className="material-symbols-outlined text-sm">format_italic</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('strike') ? 'bg-primary text-on-primary' : ''}`}
        title="Strikethrough"
      >
        <span className="material-symbols-outlined text-sm">format_strikethrough</span>
      </button>
      
      <div className="w-px h-6 bg-outline-variant/50 mx-1"></div>
      
      {/* Lists */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('bulletList') ? 'bg-primary text-on-primary' : ''}`}
        title="Bullet List"
      >
        <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('orderedList') ? 'bg-primary text-on-primary' : ''}`}
        title="Numbered List"
      >
        <span className="material-symbols-outlined text-sm">format_list_numbered</span>
      </button>
      
      <div className="w-px h-6 bg-outline-variant/50 mx-1"></div>
      
      {/* Blocks */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('blockquote') ? 'bg-primary text-on-primary' : ''}`}
        title="Quote"
      >
        <span className="material-symbols-outlined text-sm">format_quote</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('codeBlock') ? 'bg-primary text-on-primary' : ''}`}
        title="Code Block"
      >
        <span className="material-symbols-outlined text-sm">code</span>
      </button>
      
      <div className="w-px h-6 bg-outline-variant/50 mx-1"></div>
      
      {/* Media */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onImageUpload();
        }}
        disabled={isUploading}
        className="p-2 rounded hover:bg-surface-container disabled:opacity-30"
        title="Upload Image"
      >
        <span className="material-symbols-outlined text-sm">image</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          addLink();
        }}
        className={`p-2 rounded hover:bg-surface-container ${editor.isActive('link') ? 'bg-primary text-on-primary' : ''}`}
        title="Link"
      >
        <span className="material-symbols-outlined text-sm">link</span>
      </button>
      
      <div className="w-px h-6 bg-outline-variant/50 mx-1"></div>
      
      {/* Undo/Redo */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-surface-container disabled:opacity-30"
        title="Undo"
      >
        <span className="material-symbols-outlined text-sm">undo</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-surface-container disabled:opacity-30"
        title="Redo"
      >
        <span className="material-symbols-outlined text-sm">redo</span>
      </button>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div 
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">link</span>
              Insert Link
            </h3>
            
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  confirmLink();
                } else if (e.key === 'Escape') {
                  setShowLinkModal(false);
                }
              }}
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="flex-1 px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLink}
                className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editor.getAttributes('link').href ? 'Update' : 'Insert'} Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
