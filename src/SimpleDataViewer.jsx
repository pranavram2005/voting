import React, { useState, useEffect, useMemo } from "react";
import vote from "./output_with_roof";
import "./styles.css";

const SimpleJsonViewer = () => {
  const [data, setData] = useState([]);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showRoofMembers, setShowRoofMembers] = useState(false);
  const [roofMembers, setRoofMembers] = useState([]);
  const [filters, setFilters] = useState({
    constituency: "",
    villages: [],
    streets: [],
    booths: [],
    voterId: "",
    houseNo: "",
    serialNo: "",
    name: "",
    relation: "",
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
    setData(vote);
    // Initialize suggestions
    const names = [...new Set(vote.map(item => item.Name))].filter(n => n).sort();
    const pdfNos = [...new Set(vote.map(item => item.Page))].filter(p => p).sort();
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

  const getUniqueValues = (key) => {
    const values = [...new Set(data.map((item) => item[key]))];
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
        // Booth filter (multiple selection) - using Ward as Booth
        (filters.booths.length === 0 || filters.booths.includes(item["Ward"])) &&
        // Voter ID filter (text search)
        (filters.voterId === "" || String(item["ID Code"]).toLowerCase().includes(filters.voterId.toLowerCase())) &&
        // House No filter (starts with search)
        (filters.houseNo === "" || String(item["House No"]).toLowerCase().startsWith(filters.houseNo.toLowerCase())) &&
        // Serial No filter (exact match)
        (filters.serialNo === "" || String(item["S.No"]) === filters.serialNo) &&
        // Name filter (text search)
        (filters.name === "" || String(item["Name"]).toLowerCase().includes(filters.name.toLowerCase())) &&
        // Relation filter
        (filters.relation === "" || item["Relation Type"] === filters.relation) &&
        // Age range filter
        (filters.ageFrom === "" || Number(item["Age"]) >= Number(filters.ageFrom)) &&
        (filters.ageTo === "" || Number(item["Age"]) <= Number(filters.ageTo)) &&
        // Gender filter
        (filters.gender === "" || item["Gender"] === filters.gender) &&
        // PDF No filter (text search) - using Page as PDF No
        (filters.pdfNo === "" || String(item["Page"]).toLowerCase().includes(filters.pdfNo.toLowerCase())) &&
        // One Roof filter (text search)
        (filters.oneRoof === "" || String(item["One Roof"]).toLowerCase().includes(filters.oneRoof.toLowerCase())) &&
        // One Roof Running Number filter (text search)
        (filters.oneRoofRunning === "" || String(item["One Roof Running Number"]).toLowerCase().includes(filters.oneRoofRunning.toLowerCase()))
      );
    });
  }, [data, filters]);

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
      voterId: "",
      houseNo: "",
      serialNo: "",
      name: "",
      relation: "",
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
        {/* Row 1: Location Filters */}
        <div className="filter-row">
          <div className="filter-group">
            <label>1. Constituency:</label>
            <select name="constituency" value={filters.constituency} onChange={handleFilterChange}>
              <option value="">Select Constituency</option>
              {getUniqueValues("Constituency").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>2. Village [Division] (Multiple):</label>
            <div className="multi-select-container">
              {getUniqueValues("Village").map((village) => (
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

          <div className="filter-group">
            <label>3. Street [Division] (Multiple):</label>
            <div className="multi-select-container">
              {getUniqueValues("Division").map((street) => (
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

          <div className="filter-group">
            <label>4. Booth - Pagam [Ward] (Multiple):</label>
            <div className="multi-select-container">
              {getUniqueValues("Ward").map((booth) => (
                <label key={booth} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.booths.includes(booth)}
                    onChange={() => handleMultiSelectChange('booths', booth)}
                  />
                  {booth}
                </label>
              ))}
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
              {getUniqueValues("Relation Type").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

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
              {getUniqueValues("Gender").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
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
              <th>Roof Number</th>
              <th>Roof Running</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr 
                key={idx} 
                onClick={() => handleRowClick(item, idx)} 
                className={`clickable-row `}
              >
                <td>{item["S.No"]}</td>
                <td className="electoral-id" onClick={(e) => {e.stopPropagation(); handleElectoralIdClick(item["ID Code"]);}}>
                  {item["ID Code"]}
                </td>
                <td className="name-cell">{item["Name"]}</td>
                <td className="roof-number" >
                  {item["One Roof"]}
                </td>
                <td className="roof-running">{item["One Roof Running Number"]}</td>
                <td>{item["Age"]}</td>
                <td>{item["Gender"] === "ஆண்" ? "M" : "F"}</td>
                <td className="address-cell">
                  {/* Display order: constituency → street → village → booth → ward → door no */}
                  {item["Constituency"]} → {item["Division"]} → {item["Village"]} → {item["Ward"]} → {item["House No"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="entry-count">
        Showing <b>{filteredData.length}</b> of <b>{data.length}</b> entries
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
      {selectedVoter["Gender"] === "ஆண்" ? "Male (ஆண்)" : "Female (பெண்)"}
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
                    <div>{member["Gender"] === "ஆண்" ? "Male" : "Female"}</div>
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
