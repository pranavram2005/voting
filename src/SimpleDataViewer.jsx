import React, { useState, useEffect, useMemo } from "react";
import vote from "./output_with_roof";
import "./styles.css";

const SimpleJsonViewer = () => {
  const [data, setData] = useState([]);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
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
        // House No filter (text search)
        (filters.houseNo === "" || String(item["House No"]).toLowerCase().includes(filters.houseNo.toLowerCase())) &&
        // Serial No filter (text search)
        (filters.serialNo === "" || String(item["S.No"]).toLowerCase().includes(filters.serialNo.toLowerCase())) &&
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
  };

  const handleRowClick = (voter) => {
    setSelectedVoter(voter);
    setShowDetailView(true);
  };

  const closeDetailView = () => {
    setShowDetailView(false);
    setSelectedVoter(null);
  };

  return (
    <div className="viewer-container">
      <h1 className="viewer-title">📘 Electoral Data Viewer</h1>

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
              <th>Electoral ID number</th>
              <th>Serial Number</th>
              <th>Name</th>
              <th>Roof Number</th>
              <th>Roof Running Number</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} onClick={() => handleRowClick(item)} className="clickable-row">
                <td className="electoral-id">{item["ID Code"]}</td>
                <td>{item["S.No"]}</td>
                <td className="name-cell">{item["Name"]}</td>
                <td className="roof-number">{item["One Roof"]}</td>
                <td className="roof-running">{item["One Roof Running Number"]}</td>
                <td>{item["Age"]}</td>
                <td>{item["Gender"] === "ஆண்" ? "M" : "F"}</td>
                <td className="address-cell">
                  {item["House No"]}, {item["Village"]}
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
      </p>

      {/* Voter Detail Modal */}
      {showDetailView && selectedVoter && (
        <div className="modal-overlay" onClick={closeDetailView}>
          <div className="voter-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Voter Details</h2>
              <button className="close-btn" onClick={closeDetailView}>×</button>
            </div>
            <div className="voter-detail-content">
              <div className="detail-section">
                <div className="detail-row">
                  <label>Electoral Number</label>
                  <span>{selectedVoter["ID Code"]}</span>
                </div>
                <div className="detail-row">
                  <label>Name</label>
                  <span>{selectedVoter["Name"]}</span>
                </div>
                <div className="detail-row">
                  <label>Father Name / Husband Name</label>
                  <span>{selectedVoter["Relative Name"]}</span>
                </div>
                <div className="detail-row">
                  <label>Gender</label>
                  <span>{selectedVoter["Gender"] === "ஆண்" ? "Male" : "Female"}</span>
                </div>
                <div className="detail-row">
                  <label>Age</label>
                  <span>{selectedVoter["Age"]}</span>
                </div>
                <div className="detail-row">
                  <label>Door No.</label>
                  <span>{selectedVoter["House No"]}</span>
                </div>
              </div>
              
              <div className="detail-section">
                <div className="detail-row">
                  <label>Address</label>
                  <span>{selectedVoter["Village"]}, {selectedVoter["Division"]}</span>
                </div>
                <div className="detail-row">
                  <label>Taluk</label>
                  <span>{selectedVoter["Division"]}</span>
                </div>
                <div className="detail-row">
                  <label>Ward</label>
                  <span>{selectedVoter["Ward"]?.replace("வார்டு-", "")}</span>
                </div>
                <div className="detail-row">
                  <label>Village</label>
                  <span>{selectedVoter["Village"]}</span>
                </div>
                <div className="detail-row">
                  <label>One Roof</label>
                  <span>{selectedVoter["One Roof"] > 1 ? "Batched" : "Single"}</span>
                </div>
                <div className="detail-row">
                  <label>Position</label>
                  <span>{selectedVoter["Position"]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleJsonViewer;
