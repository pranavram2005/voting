import React, { useState, useEffect, useMemo } from "react";
import vote from "./output_with_roof";
import vote_AC002284 from "./voting/AC002284_with_roof";
import vote_AC005242 from "./voting/AC005242_with_roof";
import vote_AC005243 from "./voting/AC005243_with_roof";
import vote_AC005244 from "./voting/AC005244_with_roof";
import vote_AC005245 from "./voting/AC005245_with_roof";
import vote_AC005246 from "./voting/AC005246_with_roof";
import vote_AC005247 from "./voting/AC005247_with_roof";
import vote_AC005248 from "./voting/AC005248_with_roof";
import vote_AC005249 from "./voting/AC005249_with_roof";
import vote_AC005250 from "./voting/AC005250_with_roof";
import vote_AC005251 from "./voting/AC005251_with_roof";
import vote_AC005252 from "./voting/AC005252_with_roof";
import vote_AC005253 from "./voting/AC005253_with_roof";
import vote_AC005254 from "./voting/AC005254_with_roof";
import vote_AC005255 from "./voting/AC005255_with_roof";
import vote_AC005256 from "./voting/AC005256_with_roof";
import vote_AC005257 from "./voting/AC005257_with_roof";
import vote_AC005258 from "./voting/AC005258_with_roof";
import vote_AC005259 from "./voting/AC005259_with_roof";
import vote_AC005260 from "./voting/AC005260_with_roof";
import "./styles.css";

// Combine all voting data into one array
const allVoteData = [
  ...vote,
  ...vote_AC002284,
  ...vote_AC005242,
  ...vote_AC005243,
  ...vote_AC005244,
  ...vote_AC005245,
  ...vote_AC005246,
  ...vote_AC005247,
  ...vote_AC005248,
  ...vote_AC005249,
  ...vote_AC005250,
  ...vote_AC005251,
  ...vote_AC005252,
  ...vote_AC005253,
  ...vote_AC005254,
  ...vote_AC005255,
  ...vote_AC005256,
  ...vote_AC005257,
  ...vote_AC005258,
  ...vote_AC005259,
  ...vote_AC005260,
];

const SimpleJsonViewer = () => {
  const [data, setData] = useState([]);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showRoofMembers, setShowRoofMembers] = useState(false);
  const [roofMembers, setRoofMembers] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  
  const [filters, setFilters] = useState({
    constituency: "",
    villages: [], // Nagar
    streets: [],  // Street (Division)
    booths: [],   // Booth (Part)
    wards: [],    // Ward
    voterId: "",
    houseNo: "",
    serialNo: "",
    name: "",
    relation: "",
    relativeName: "",
    ageFrom: "",
    ageTo: "",
    gender: "",
    pdfNo: "",
    oneRoof: "",
    oneRoofRunning: "",
  });
  const [suggestions, setSuggestions] = useState({
    names: [],
    pdfNos: [],
  });

  useEffect(() => {
    setData(allVoteData);
    // Initialize suggestions
    const names = [...new Set(allVoteData.map(item => item.Name))].filter(n => n).sort();
    const pdfNos = [...new Set(allVoteData.map(item => item.Page))].filter(p => p).sort();
    setSuggestions({ names, pdfNos });
  }, []);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    // Define the order of columns for better display
    const orderedColumns = [
      "S.No",
      "Position", 
      "Name",
      "One Roof",
      "One Roof Running Number",
      "Relation Type",
      "Relative Name",
      "House No",
      "Age",
      "Gender",
      "ID Code",
      "Page",
      "Constituency",
      "Division", 
      "Village",
      "Ward",
      "Part"
    ];
    
    const availableColumns = Object.keys(data[0]).filter(col => !["Photo"].includes(col));
    
    // Return columns in the specified order, then any additional columns
    const result = orderedColumns.filter(col => availableColumns.includes(col));
    const additional = availableColumns.filter(col => !orderedColumns.includes(col));
    
    return [...result, ...additional];
  }, [data]);

  const normalizeRelationType = (relationType) => {
    if (!relationType) return "";
    const normalized = relationType.trim();
    // Normalize father relations to full version
    if (normalized === "தந்தையின் பெயர்" || normalized === "தந்தையின்") {
      return "தந்தையின் பெயர்";
    }
    // Normalize husband relations to full version
    if (normalized === "கணவர் பெயர்" || normalized === "கணவர்") {
      return "கணவர் பெயர்";
    }
    return normalized;
  };

  const normalizeGender = (gender) => {
    if (!gender) return "ஆண்";
    const g = gender.trim().toLowerCase();
    // Female variations
    if (g.includes("பெண்") || g.includes("female") || g.includes("f") || g.includes("woman") || g.includes("பெ")) {
      return "பெண்";
    }
    // Default to Male for all other cases
    return "ஆண்";
  };

  const getUniqueValues = (key) => {
    const values = [...new Set(data.map((item) => item[key]))];
    return values.filter((v) => v !== undefined && v !== null && v !== "").sort();
  };

  const getUniqueRelationTypes = () => {
    const values = [...new Set(data.map((item) => normalizeRelationType(item["Relation Type"])))];
    return values.filter((v) => v !== undefined && v !== null && v !== "").sort();
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        // Constituency filter
        (filters.constituency === "" || item["Constituency"] === filters.constituency) &&
        // Village filter (multiple selection)
        (filters.villages.length === 0 || filters.villages.includes(item["Village"])) &&
        // Street filter (multiple selection) - using Division as Street
        (filters.streets.length === 0 || filters.streets.includes(item["Division"])) &&
        // Booth filter (multiple selection) using Part
        (filters.booths.length === 0 || filters.booths.includes(item["Part"])) &&
        // Ward filter (multiple selection)
        (filters.wards.length === 0 || filters.wards.includes(item["Ward"])) &&
        // Voter ID filter (substring match, case-insensitive)
        (filters.voterId === "" || String(item["ID Code"]).trim().toLowerCase().includes(filters.voterId.trim().toLowerCase())) &&
        // House No filter (exact match)
        (filters.houseNo === "" || String(item["House No"]).toLowerCase() === filters.houseNo.toLowerCase()) &&
        // Serial No filter (exact match)
        (filters.serialNo === "" || String(item["S.No"]) === filters.serialNo) &&
        // Name filter (text search)
        (filters.name === "" || String(item["Name"]).toLowerCase().includes(filters.name.toLowerCase())) &&
        // Relation filter (with normalization)
        (filters.relation === "" || normalizeRelationType(item["Relation Type"]) === normalizeRelationType(filters.relation)) &&
        // Relative Name filter (shown only when relation selected)
        (filters.relativeName === "" || String(item["Relative Name"]).toLowerCase().includes(filters.relativeName.toLowerCase())) &&
        // Age range filter
        (filters.ageFrom === "" || Number(item["Age"]) >= Number(filters.ageFrom)) &&
        (filters.ageTo === "" || Number(item["Age"]) <= Number(filters.ageTo)) &&
        // Gender filter (with normalization)
        (filters.gender === "" || normalizeGender(item["Gender"]) === filters.gender) &&
        // PDF No filter exact match (Page)
        (filters.pdfNo === "" || String(item["Page"]).toLowerCase() === filters.pdfNo.toLowerCase()) &&
        // One Roof filter (exact match)
        (filters.oneRoof === "" || String(item["One Roof"]) === filters.oneRoof) &&
        // One Roof Running Number filter (exact match)
        (filters.oneRoofRunning === "" || String(item["One Roof Running Number"]) === filters.oneRoofRunning)
      );
    });
  }, [data, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(item => item !== value)
        : [...prev[filterName], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      constituency: "",
      villages: [],
      streets: [],
      booths: [],
      wards: [],
      voterId: "",
      houseNo: "",
      serialNo: "",
      name: "",
      relation: "",
      relativeName: "",
      ageFrom: "",
      ageTo: "",
      gender: "",
      pdfNo: "",
      oneRoof: "",
      oneRoofRunning: "",
    });
    // Also clear selection when clearing filters
    setSelectedRowIndex(null);
    setSelectedVoter(null);
  };

  const handleRowClick = (voter, index) => {
    setSelectedVoter(voter);
    setSelectedRowIndex(index);
    setShowDetailView(true);
  };

  const closeDetailView = () => {
    setShowDetailView(false);
    setSelectedVoter(null);
    // Keep the row selected even after closing modal
    // setSelectedRowIndex(null); // Uncomment this if you want to deselect on close
  };

  const handleRoofClick = (roofNumber) => {
    const members = data
      .filter(voter => voter["One Roof"] === roofNumber)
      .sort((a, b) => Number(a["One Roof Running Number"]) - Number(b["One Roof Running Number"]));
    setRoofMembers(members);
    setShowRoofMembers(true);
  };

  const closeRoofView = () => {
    setShowRoofMembers(false);
    setRoofMembers([]);
  };

  const handleElectoralIdClick = (voterId) => {
    // Open electoral details or external link
    window.open(`https://electoralsearch.in/search?id=${voterId}`, '_blank');
  };

  return (
    <div className="viewer-container">
      {/* Filters */}
      <div className="filters-container">
        {/* Row 1: Reordered Location Filters */}
        <div className="filter-row">
          {/* Left column: Constituency, Booth, Ward */}
          <div className="filter-column">
            {/* 1. Constituency */}
            <div className="filter-group">
              <label>1. Constituency:</label>
              <select name="constituency" value={filters.constituency} onChange={handleFilterChange}>
                <option value="">Select Constituency</option>
                {getUniqueValues("Constituency").map(val => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            
            {/* 2. Booth (Part) multi-select */}
            <div className="filter-group">
              <label>2. Booth (Part) (Multiple):</label>
              <div className="multi-select-container">
                {getUniqueValues("Part").map(part => (
                  <label key={part} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.booths.includes(part)}
                      onChange={() => handleMultiSelectChange('booths', part)}
                    />
                    {part}
                  </label>
                ))}
              </div>
            </div>
            {/* 3. Ward multi-select */}
            <div className="filter-group">
              <label>3. Ward (Multiple):</label>
              <div className="multi-select-container">
                {getUniqueValues("Ward").map(ward => (
                  <label key={ward} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.wards.includes(ward)}
                      onChange={() => handleMultiSelectChange('wards', ward)}
                    />
                    {ward}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Nagar (Village), Street (Division) */}
          <div className="filter-column">
             <div className="filter-group">
             <div className="box"></div>
            </div>
            {/* 4. Nagar (Village) multi-select */}
            <div className="filter-group">
              <label>4. Nagar (Village) (Multiple):</label>
              <div className="multi-select-container">
                {getUniqueValues("Village").map(village => (
                  <label key={village} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.villages.includes(village)}
                      onChange={() => handleMultiSelectChange('villages', village)}
                    />
                    {village}
                  </label>
                ))}
              </div>
            </div>
            
            {/* 5. Street (Division) multi-select */}
            <div className="filter-group">
              <label>5. Street (Division) (Multiple):</label>
              <div className="multi-select-container">
                {getUniqueValues("Division").map(street => (
                  <label key={street} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.streets.includes(street)}
                      onChange={() => handleMultiSelectChange('streets', street)}
                    />
                    {street}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Search Filters */}
        <div className="filter-row">
          <div className="filter-group">
            <label>1. Voter ID:</label>
            <input
              type="text"
              placeholder="Search Voter ID"
              name="voterId"
              value={filters.voterId}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>2. House No:</label>
            <input
              type="text"
              placeholder="Search House No"
              name="houseNo"
              value={filters.houseNo}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>3. Serial No (S.No):</label>
            <input
              type="text"
              placeholder="Search Serial No"
              name="serialNo"
              value={filters.serialNo}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>4. Name (Auto Suggest):</label>
            <input
              type="text"
              placeholder="Search Name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              list="names-list"
            />
            <datalist id="names-list">
              {suggestions.names
                .filter(name => name.toLowerCase().includes(filters.name.toLowerCase()))
                .slice(0, 20)
                .map(name => (
                  <option key={name} value={name} />
                ))}
            </datalist>
          </div>
        </div>

        {/* Row 3: Additional Filters */}
        <div className="filter-row">
          <div className="filter-group">
            <label>5. Relation:</label>
            <select name="relation" value={filters.relation} onChange={handleFilterChange}>
              <option value="">Select Relation</option>
              {getUniqueRelationTypes().map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          {filters.relation && (
            <div className="filter-group">
              <label>5a. Relative Name:</label>
              <input
                type="text"
                placeholder="Search Relative Name"
                name="relativeName"
                value={filters.relativeName}
                onChange={handleFilterChange}
              />
            </div>
          )}

          <div className="filter-group">
            <label>6. Age Range:</label>
            <div className="age-range">
              <input
                type="number"
                placeholder="From"
                name="ageFrom"
                value={filters.ageFrom}
                onChange={handleFilterChange}
                style={{ width: '45%' }}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="To"
                name="ageTo"
                value={filters.ageTo}
                onChange={handleFilterChange}
                style={{ width: '45%' }}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>7. Gender:</label>
            <select name="gender" value={filters.gender} onChange={handleFilterChange}>
              <option value="">Select Gender</option>
              <option value="ஆண்">ஆண் (Male)</option>
              <option value="பெண்">பெண் (Female)</option>
            </select>
          </div>

          <div className="filter-group">
            <label>PDF No (Auto Suggest):</label>
            <input
              type="text"
              placeholder="Search PDF No"
              name="pdfNo"
              value={filters.pdfNo}
              onChange={handleFilterChange}
              list="pdf-list"
            />
            <datalist id="pdf-list">
              {suggestions.pdfNos
                .filter(pdf => String(pdf).toLowerCase().includes(filters.pdfNo.toLowerCase()))
                .slice(0, 20)
                .map(pdf => (
                  <option key={pdf} value={pdf} />
                ))}
            </datalist>
          </div>
        </div>

        {/* Row 4: One Roof Filters */}
        <div className="filter-row">
          <div className="filter-group">
            <label>One Roof:</label>
            <input
              type="text"
              placeholder="Search One Roof"
              name="oneRoof"
              value={filters.oneRoof}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>One Roof Running Number:</label>
            <input
              type="text"
              placeholder="Search One Roof Running Number"
              name="oneRoofRunning"
              value={filters.oneRoofRunning}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-btn">Clear All Filters</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="electoral-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Electoral ID</th>
              <th>Name</th>
              <th>Relation Type</th>
              <th>Relation Name</th>              
              <th>Age</th>
              <th>G</th>
              <th>Address</th>
              <th>RN</th>
              <th>RR</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr 
                key={idx} 
                onClick={() => handleRowClick(item, startIndex + idx)} 
                className={`clickable-row `}
              >
                <td>{parseInt(item["S.No"]) - 1}</td>
                <td className="electoral-id">
                  {item["ID Code"]}
                </td>
                <td className="name-cell">{item["Name"]}</td>
                <td className="name-cell">{item["Relation Type"]}</td>
                <td className="name-cell">{item["Relative Name"]}</td>
                  <td>{item["Age"]}</td>
                <td>{normalizeGender(item["Gender"]) === "ஆண்" ? "M" : "F"}</td>
                <td className="address-cell">
                  {/* Display order: constituency → street → village → booth → ward → door no */}
                  {item["Division"]} → {item["Village"]} → {item["Ward"]} → {item["House No"]}
                </td>
                 <td className="roof-number" >
                  {item["One Roof"]}
                </td>
                <td className="roof-running">{item["One Roof Running Number"]}</td>
             
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '10px 0',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Show:</span>
          <select 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange}
            style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
          <span>per page</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button 
            onClick={() => goToPage(1)} 
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: currentPage === 1 ? '#e9ecef' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ⏮ First
          </button>
          <button 
            onClick={() => goToPage(currentPage - 1)} 
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: currentPage === 1 ? '#e9ecef' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ◀ Prev
          </button>
          
          <span style={{ padding: '0 15px', fontWeight: 'bold' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={() => goToPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: currentPage === totalPages ? '#e9ecef' : '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next ▶
          </button>
          <button 
            onClick={() => goToPage(totalPages)} 
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: currentPage === totalPages ? '#e9ecef' : '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Last ⏭
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>Go to:</span>
          <input 
            type="number" 
            min="1" 
            max={totalPages}
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            style={{ 
              width: '60px', 
              padding: '5px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              textAlign: 'center'
            }}
          />
        </div>
      </div>

      <p className="entry-count">
        Showing <b>{startIndex + 1}-{Math.min(endIndex, filteredData.length)}</b> of <b>{filteredData.length}</b> filtered entries (Total: {data.length})
        {data.length > 0 && (
          <span style={{marginLeft: '20px', fontSize: '14px', color: '#888'}}>
            Columns: {8}
          </span>
        )}
        {selectedRowIndex !== null && selectedVoter && (
          <span style={{marginLeft: '20px', fontSize: '16px', color: '#000', fontWeight: 'bold'}}>
            Selected: {selectedVoter["Name"]} (ID: {selectedVoter["ID Code"]})
            <button 
              onClick={() => {setSelectedRowIndex(null); setSelectedVoter(null);}} 
              style={{
                marginLeft: '10px', 
                padding: '4px 8px', 
                fontSize: '12px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Selection
            </button>
          </span>
        )}
      </p>

      {/* Voter Detail Modal */}
      {showDetailView && selectedVoter && (
        <div className="modal-overlay" onClick={closeDetailView}>
          <div className="voter-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Voters Full Details</h2>
              <button className="modal-close-btn" onClick={closeDetailView}>×</button>
            </div>
            <div className="voter-detail-grid">
  {/* 1️⃣ Electoral No */}
  <div className="grid-row">
    <div className="grid-label">Electoral Number</div>
    <div
      className="grid-value"
    >
      {selectedVoter["ID Code"]}
    </div>
    <div className="grid-spacer"></div>

    {/* 2️⃣ Part */}
    <div className="grid-label">Booth / Part</div>
    <div className="grid-value">{selectedVoter["Part"]}</div>
  </div>

  {/* 3️⃣ Ward */}
  <div className="grid-row">
    <div className="grid-label">Ward</div>
    <div className="grid-value">{selectedVoter["Ward"]}</div>
    <div className="grid-spacer"></div>

    {/* 4️⃣ Serial No */}
    <div className="grid-label">Serial Number</div>
    <div className="grid-value">{selectedVoter["S.No"]}</div>
  </div>

  {/* 5️⃣ Name */}
  <div className="grid-row">
    <div className="grid-label">Name</div>
    <div className="grid-value">{selectedVoter["Name"]}</div>
    <div className="grid-spacer"></div>

    {/* 6️⃣ Relation Type */}
    <div className="grid-label">Relation Type</div>
    <div className="grid-value">{selectedVoter["Relation Type"]}</div>
  </div>

  {/* 7️⃣ Relative Name */}
  <div className="grid-row">
    <div className="grid-label">Relative Name</div>
    <div className="grid-value">{selectedVoter["Relative Name"]}</div>
    <div className="grid-spacer"></div>

    {/* 8️⃣ Gender */}
    <div className="grid-label">Gender</div>
    <div className="grid-value">
      {normalizeGender(selectedVoter["Gender"]) === "ஆண்" ? "Male (ஆண்)" : "Female (பெண்)"}
    </div>
  </div>

  {/* 9️⃣ Age */}
  <div className="grid-row">
    <div className="grid-label">Age</div>
    <div className="grid-value">{selectedVoter["Age"]} years</div>
    <div className="grid-spacer"></div>

    {/* 🔟 Door No */}
    <div className="grid-label">Door Number</div>
    <div className="grid-value">{selectedVoter["House No"]}</div>
  </div>

  {/* 11️⃣ Address */}
  <div className="grid-row">
    <div className="grid-label">Address</div>
    <div className="grid-value">{selectedVoter["Division"]}</div>
    <div className="grid-spacer"></div>

    {/* 12️⃣ Village */}
    <div className="grid-label">Village</div>
    <div className="grid-value">{selectedVoter["Village"]}</div>
  </div>
</div>

          </div>
        </div>
      )}

      {showRoofMembers && roofMembers && roofMembers.length > 0 && (
        <div className="modal-overlay" onClick={closeRoofModal}>
          <div className="voter-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👪 Family Members ({roofMembers.length} members under same roof)</h2>
              <button className="close-btn" onClick={closeRoofModal}>×</button>
            </div>
            <div className="roof-members-content">
              <div className="roof-members-table">
                <div className="roof-table-header">
                  <div>Serial No</div>
                  <div>Electoral ID</div>
                  <div>Name</div>
                  <div>Relation</div>
                  <div>Age</div>
                  <div>Gender</div>
                  <div>Action</div>
                </div>
                {roofMembers.map((member, index) => (
                  <div key={index} className="roof-table-row">
                    <div>{member["S.No"]}</div>
                    <div className="clickable-link" onClick={() => handleElectoralIdClick(member["ID Code"])}>
                      {member["ID Code"]}
                    </div>
                    <div>{member["Name"]}</div>
                    <div>{member["Relation Type"]}</div>
                    <div>{member["Age"]}</div>
                    <div>{normalizeGender(member["Gender"]) === "ஆண்" ? "Male" : "Female"}</div>
                    <div>
                      <button 
                        className="view-details-btn" 
                        onClick={() => {
                          setSelectedVoter(member);
                          setShowRoofMembers(false);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleJsonViewer;
