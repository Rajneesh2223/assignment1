'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // PrimeReact theme (you can choose a different theme)
import 'primereact/resources/primereact.min.css'; // PrimeReact core styles

// Define the type for the data from the API
interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  date_display: string;
  image_url: string;
}

const TableComponent: React.FC = () => {
  const [data, setData] = useState<Artwork[]>([]); // Table data
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]); // Selected rows
  const [totalRecords, setTotalRecords] = useState<number>(0); // Total records for pagination
  const [loading, setLoading] = useState<boolean>(false); // Loading state for table

  const fetchData = async (page: number, rows: number) => {
    setLoading(true);

    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page + 1}&limit=${rows}`);
    const result = await response.json();

    setData(result.data); 
    setTotalRecords(result.pagination.total); 
    setLoading(false);
  };

  // Handle page change
  const onPageChange = (event: { page: number; rows: number }) => {
    const { page, rows } = event;
    fetchData(page, rows);
  };


  const onRowSelect = (e: { value: Artwork[] }) => {
    setSelectedRows(e.value);
  };

  useEffect(() => {
    fetchData(0, 10); 
  }, []);

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Artworks from the Art Institute of Chicago</h2>

        <DataTable<Artwork>
          value={data}
          paginator
          rows={10}
          totalRecords={totalRecords}
          lazy
          loading={loading}
          onPage={onPageChange}
          selection={selectedRows} 
          onSelectionChange={onRowSelect}
          dataKey="id" 
          responsiveLayout="scroll"
          className="custom-table"
        >
       
          <Column selectionMode="multiple" style={{ width: '3em' }} />

          <Column field="title" header="Title" sortable className="text-lg text-gray-700" />
          <Column field="artist_display" header="Artist" sortable className="text-lg text-gray-700" />
          <Column field="place_of_origin" header="Place of Origin" sortable className="text-lg text-gray-700" />
          <Column field="inscriptions" header="Inscriptions" sortable className="text-lg text-gray-700" />
          <Column field="date_start" header="Start Date" sortable className="text-lg text-gray-700" />
          <Column field="date_end" header="End Date" sortable className="text-lg text-gray-700" />


          <Column
            header="Image"
            body={(rowData: Artwork) => (
              <img
                src={rowData.image_url || '/placeholder-image.png'} // Handle missing images
                alt={rowData.title}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default TableComponent;
