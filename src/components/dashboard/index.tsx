import React, { useState } from "react";
import { Box } from "@mui/material";
import FolderTabs from "@components/folderTab";
import CSVViewer from "@components/csvViewer";

interface DashboardProps {
    folders: Record<string, string[]>; 
}

const Dashboard: React.FC<DashboardProps> = ({ folders }) => {
    const folderKeys = Object.keys(folders); 
    const [activeFolder, setActiveFolder] = useState(folderKeys[0] || ""); 
    const [activeFile, setActiveFile] = useState(
        folderKeys[0] && folders[folderKeys[0]].length > 0
            ? `/reports/${folderKeys[0]}/${folders[folderKeys[0]][0]}`
            : ""
    );

    const handleFolderChange = (folder: string) => {
        setActiveFolder(folder);
        const defaultFile = folders[folder]?.[0];
        if (defaultFile) {
            setActiveFile(`/reports/${folder}/${defaultFile}`);
        }
    };

    const handleFileChange = (file: string) => {
        setActiveFile(`/reports/${activeFolder}/${file}`);
    };

    return (
        <Box sx={{ p: "24px" }}>
            <h1>Reports Dashboard</h1>

            {/* Folder Tabs */}
            <FolderTabs folders={folderKeys} onTabChange={handleFolderChange} />

            {/* File List */}
            <Box>
                <h2>{activeFolder}</h2>
                <ul>
                    {folders[activeFolder]?.length > 0 ? (
                        folders[activeFolder].map((file, index) => (
                            <li
                                key={index}
                                style={{
                                    cursor: "pointer",
                                    fontWeight: activeFile === `/reports/${activeFolder}/${file}` ? "bold" : "normal",
                                }}
                                onClick={() => handleFileChange(file)}
                            >
                                {file}
                            </li>
                        ))
                    ) : (
                        <li>No files found for this folder</li>
                    )}
                </ul>
            </Box>

            {/* CSV Viewer */}
            {activeFile ? (
                <CSVViewer filePath={activeFile} />
            ) : (
                <p style={{ color: "#000" }}>Select a file to view its content.</p>
            )}
        </Box>
    );
};

export default Dashboard;