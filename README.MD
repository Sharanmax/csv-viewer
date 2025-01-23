# Dynamic CSV Viewer Dashboard

This is a **Dynamic CSV Viewer Dashboard** built with **React**, **Next.js**, and **AG Grid**. The application dynamically loads and displays CSV files from a structured folder system, allowing users to view, group, and navigate data efficiently.

## Features
- **Dynamic File Loading**: Automatically scans and loads CSV files from the `public/reports` directory.
- **Grouping**: Group data by specific columns, with options to expand and collapse grouped rows.
- **Pagination**: Adjustable page sizes (20, 50, 100 rows).
- **Responsive UI**: Built with Material-UI for a clean and user-friendly interface.
- **Reset Grouping**: Easily reset the grid to its initial state with the "Remove Grouping" option.

---

## Setup and Installation

### Repository
Find the repository here: [Dynamic CSV Viewer Dashboard](https://github.com/Sharanmax/csv-viewer/).

### Steps to Run
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sharanmax/csv-viewer.git
   cd csv-viewer
   ```
2. **Install dependencies**:
   ```bash
   yarn install
   ```
3. **Start the development server**:
   ```bash
   yarn dev
   ```
3. **Start the development server**:
   ```bash
   yarn dev
   ```

## Dynamic File Loading and Design Choices

### Dynamic File Loading
The application uses **Next.js's `getServerSideProps`** to dynamically scan the `public/reports` folder. It reads the folder structure recursively using the Node.js `fs` module and transforms it into a key-value structure. Each folder becomes a key, and the files inside become an array of values.

Example transformation:
```json
{
  "finance": ["customers-100.csv"],
  "sales": ["organizations-100.csv", "people-100.csv"]
}
