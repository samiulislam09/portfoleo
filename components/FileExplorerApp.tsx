import React, { useState } from 'react';

type FileNode = {
  name: string;
  type: 'folder' | 'file';
  content?: React.ReactNode;
  children?: FileNode[];
};

export function FileExplorerApp() {
  const [currentPath, setCurrentPath] = useState<FileNode[]>([{
    name: "Home",
    type: "folder",
    children: [
      {
        name: "Projects",
        type: "folder",
        children: [
          { name: "system-monitor.js", type: "file", content: "console.log('System Monitor Initialized');" },
          { name: "e-commerce.tsx", type: "file", content: "export default function App() { return <div>Shop</div> }" }
        ]
      },
      {
        name: "Documents",
        type: "folder",
        children: [
          { name: "resume.pdf", type: "file", content: "John Doe - Full Stack Developer. Experience: 5 years." },
          { name: "todo.txt", type: "file", content: "- Build portfolio\n- Learn Rust\n- Deploy server" }
        ]
      },
      { name: "contact.txt", type: "file", content: "Email: john@example.com" }
    ]
  }]);

  const [viewingFile, setViewingFile] = useState<FileNode | null>(null);

  const currentFolder = currentPath[currentPath.length - 1];

  const handleItemClick = (item: FileNode) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item]);
    } else {
      setViewingFile(item);
    }
  };

  const handleBack = () => {
    if (viewingFile) {
      setViewingFile(null);
    } else if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  return (
    <div className="file-explorer-container">
      <div className="file-explorer-toolbar">
        <button className="explorer-btn" onClick={handleBack} disabled={currentPath.length === 1 && !viewingFile}>
          ← Back
        </button>
        <div className="explorer-path">
          /{currentPath.map(p => p.name).join('/')}{viewingFile ? `/${viewingFile.name}` : ''}
        </div>
      </div>
      
      <div className="file-explorer-content">
        {viewingFile ? (
          <div className="file-viewer">
            <pre>{viewingFile.content}</pre>
          </div>
        ) : (
          <div className="file-grid">
            {currentFolder.children?.map(child => (
              <div key={child.name} className="file-item" onClick={() => handleItemClick(child)}>
                <div className="file-icon">{child.type === 'folder' ? '📁' : '📄'}</div>
                <div className="file-name">{child.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
