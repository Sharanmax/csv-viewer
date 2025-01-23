import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";

const FolderTabs = ({ folders, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        onTabChange(folders[newValue]);
    };

    return (
        <Tabs value={activeTab} onChange={handleTabChange}>
            {folders.map((folder, index) => (
                <Tab key={index} label={folder} />
            ))}
        </Tabs>
    );
};

export default FolderTabs;