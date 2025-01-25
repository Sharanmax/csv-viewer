import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import Papa, { ParseResult } from "papaparse";
import Box from "@mui/material/Box";
import { FormControl, InputLabel, MenuItem, Select, Button, SelectChangeEvent } from "@mui/material";

interface CSVRow {
    [key: string]: string | undefined;
}

interface CSVViewerProps {
    filePath: string;
}

const CSVViewer: React.FC<CSVViewerProps> = ({ filePath }) => {
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const [rowData, setRowData] = useState<CSVRow[]>([]);
    const [pageSize, setPageSize] = useState(50);
    const [groupColumn, setGroupColumn] = useState<string | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const loadCSVData = async () => {
            try {
                const response = await fetch(filePath);
                const csvData = await response.text();

                Papa.parse<CSVRow>(csvData, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result: ParseResult<CSVRow>) => {
                        const normalizeData = (data: CSVRow[]) =>
                            data.map((row) => {
                                const normalizedRow: CSVRow = {};
                                Object.keys(row).forEach((key) => {
                                    const value = row[key];
                                    normalizedRow[key] =
                                        typeof value === "string" ? value.trim() : value;
                                });
                                return normalizedRow;
                            });

                        const columns: ColDef[] = Object.keys(result.data[0]).map((key) => ({
                            field: key,
                            headerName: key,
                            sortable: true,
                            filter: true,
                        }));

                        setColumnDefs(columns);
                        setRowData(normalizeData(result.data));
                    },
                    error: (error: unknown) => {
                        if (error instanceof Error) {
                            console.error("Error parsing CSV:", error.message);
                        } else {
                            console.error("Error parsing CSV:", error);
                        }
                    },
                });
            } catch (error) {
                console.error("Error loading CSV file:", error);
            }
        };

        loadCSVData();
    }, [filePath]);

    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        setPageSize(Number(event.target.value));
    };

    const handleGroupColumnChange = (event: SelectChangeEvent<string>) => {
        setGroupColumn(event.target.value);
        setExpandedGroups({});
    };

    const handleRemoveGrouping = () => {
        setGroupColumn(null);
        setExpandedGroups({});
    };

    const toggleGroup = (groupKey: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupKey]: !prev[groupKey],
        }));
    };

    const processDataForGrouping = (data: CSVRow[], groupByColumn: string) => {
        const groupedData: CSVRow[] = [];
        const groups: Record<string, CSVRow[]> = {};

        data.forEach((row) => {
            const groupKey = row[groupByColumn] || "Unknown";
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(row);
        });

        Object.entries(groups).forEach(([groupKey, groupRows]) => {
            groupedData.push({ [groupByColumn]: groupKey, isGroup: true, groupRows } as any);
            if (expandedGroups[groupKey]) {
                groupedData.push(...groupRows);
            }
        });

        return groupedData;
    };

    const dynamicRowData = groupColumn
        ? processDataForGrouping(rowData, groupColumn)
        : rowData;

    const isGroupRow = (params: any) => {
        return params.data && params.data.isGroup === true;
    };

    const dynamicColumnDefs = columnDefs.map((col) => ({
        ...col,
        cellRenderer: (params: any) => {
            if (isGroupRow(params)) {
                const groupKey = params.data[groupColumn!];
                return (
                    <span
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                        onClick={() => toggleGroup(groupKey)}
                    >
                        {expandedGroups[groupKey] ? "▼" : "▶"} {groupKey} ({params.data.groupRows.length} items)
                    </span>
                );
            }
            return params.value || "";
        },
        sortable: col.field !== groupColumn,
        filter: col.field !== groupColumn,
    }));

    return (
        <Box sx={{ py: "24px" }}>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                    <InputLabel id="groupColumn-label">Group by</InputLabel>
                    <Select
                        labelId="groupColumn-label"
                        value={groupColumn || ""}
                        onChange={handleGroupColumnChange}
                        label="Group by"
                    >
                        {columnDefs.map((col) => (
                            <MenuItem key={col.field} value={col.field}>
                                {col.headerName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                    <InputLabel id="pageSize-label">Rows per page</InputLabel>
                    <Select
                        labelId="pageSize-label"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        label="Rows per page"
                    >
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    sx={{ bgcolor: 'darkblue' }}
                    color="secondary"
                    onClick={handleRemoveGrouping}
                    disabled={!groupColumn}
                >
                    Remove Grouping
                </Button>
            </div>
            <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
                <AgGridReact
                    columnDefs={dynamicColumnDefs}
                    rowData={dynamicRowData}
                    pagination
                    paginationPageSize={pageSize}
                    rowModelType="clientSide"
                />
            </div>
        </Box>
    );
};

export default CSVViewer;