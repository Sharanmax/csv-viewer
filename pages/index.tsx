import React from "react";
import { Typography } from "@mui/material";
import Dashboard from "@components/dashboard";
import { Header } from "@components/css";
import fs from "fs";
import path from "path";

interface Folder {
  name: string;
  type: "directory" | "file";
  children?: Folder[] | null;
}

interface HomeProps {
  folders: Record<string, string[]>;
}

const Home: React.FC<HomeProps> = ({ folders }) => {


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Dashboard  folders={folders}/>
    </div>
  );
};

export const getServerSideProps = async () => {
  const reportsPath = path.join(process.cwd(), "public", "reports");

  const readFolderContents = (folderPath: string): Folder[] => {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.name !== ".DS_Store")
      .map((entry) => {
        const fullPath = path.join(folderPath, entry.name);
        const isDirectory = entry.isDirectory();

        return {
          name: entry.name,
          type: isDirectory ? "directory" : "file",
          children: isDirectory ? readFolderContents(fullPath) : null, 
        };
      });
  };

  // Transform the `reports` structure into the expected `folders` format
  const transformToFolders = (reports: any[]): Record<string, string[]> => {
    const folders: Record<string, string[]> = {};

    reports.forEach((item) => {
      if (item.type === "directory") {
        folders[item.name] = item.children ? item.children.map((child: any) => child.name) : [];
      }
    });

    return folders;
  };

  let reports = [];
  let folders = {};

  try {
    reports = readFolderContents(reportsPath); 
    folders = transformToFolders(reports);
    console.log("Folders structure:", folders);
  } catch (error) {
    console.error("Error reading reports folder:", error);
  }

  return {
    props: {
      folders, 
    },
  };
};


export default Home;