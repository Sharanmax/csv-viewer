Dynamic CSV Viewer Dashboard
This project is a Dynamic CSV Viewer Dashboard built using React, Next.js, and AG Grid. The application dynamically loads CSV files from a structured folder system, allowing users to view, group, and navigate reports easily.

Features
Dynamically reads and loads CSV files from a folder structure in the public/reports directory.
Allows users to group data by specific columns with expandable and collapsible groups.
Provides pagination and adjustable page sizes (20, 50, 100 rows).
Includes options to remove grouping and reset the grid to its initial state.
Fully responsive with an intuitive Material-UI-based interface.
Setup and Installation
Steps to Run
Clone the Repository

bash
Copy
Edit
git clone <your-repo-url>
cd <project-folder>
Install Dependencies

bash
Copy
Edit
yarn install
Start the Development Server

bash
Copy
Edit
yarn dev
Access the Application Open your browser and navigate to http://localhost:3000.

Short Write-Up
Dynamic File Loading
The application scans the public/reports directory dynamically using server-side rendering (getServerSideProps). It reads the folder structure using Node.js fs and path modules and transforms the folder hierarchy into a format suitable for rendering.

Each folder is displayed as a tab, and the files inside are listed for selection.
When a CSV file is selected, the application dynamically fetches and parses it using PapaParse, generating grid data and column definitions on the fly.
Design Choices
Dynamic Folder Handling: The folder and file structure dynamically adapt to changes, ensuring scalability.
Material-UI for UI: Ensures a clean and responsive user interface.
AG Grid: Chosen for its robust features, such as grouping, filtering, sorting, and pagination.
This design makes the dashboard highly scalable, responsive, and user-friendly, enabling dynamic report management and viewing.

