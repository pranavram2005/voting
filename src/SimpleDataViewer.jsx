import React, { useState, useEffect, useMemo } from "react";
import vote from "./output_with_roof";
import "./styles.css";

const SimpleJsonViewer = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    age: "",
    oneRoof: "",
    oneRoofRunning: "",
    relationType: "",
    gender: "",
    constituency: "",
    division: "",
    village: "",
    ward: "",
  });

  useEffect(() => {
    setData(vote);
  }, []);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(
      (col) => !["Photo", "Page", "Part", "Position"].includes(col)
    );
  }, [data]);

  const getUniqueValues = (key) => {
    const values = [...new Set(data.map((item) => item[key]))];
    return values.filter((v) => v !== undefined && v !== null && v !== "");
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (filters.age === "" || item["Age"] === Number(filters.age)) &&
        (filters.oneRoof === "" || item["One Roof"] === Number(filters.oneRoof)) &&
        (filters.oneRoofRunning === "" ||
          item["One Roof Running Number"] === Number(filters.oneRoofRunning)) &&
        (filters.relationType === "" || item["Relation Type"] === filters.relationType) &&
        (filters.gender === "" || item["Gender"] === filters.gender) &&
        (filters.constituency === "" || item["Constituency"] === filters.constituency) &&
        (filters.division === "" || item["Division"] === filters.division) &&
        (filters.village === "" || item["Village"] === filters.village) &&
        (filters.ward === "" || item["Ward"] === filters.ward)
      );
    });
  }, [data, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="viewer-container">
      <h1 className="viewer-title">📘 JSON Viewer Dashboard</h1>

      {/* Filters */}
      <div className="filters-container">
        <input
          type="number"
          placeholder="Filter by Age"
          name="age"
          value={filters.age}
          onChange={handleFilterChange}
        />

        <select name="oneRoof" value={filters.oneRoof} onChange={handleFilterChange}>
          <option value="">One Roof</option>
          {getUniqueValues("One Roof").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select
          name="oneRoofRunning"
          value={filters.oneRoofRunning}
          onChange={handleFilterChange}
        >
          <option value="">One Roof Running No</option>
          {getUniqueValues("One Roof Running Number").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select
          name="relationType"
          value={filters.relationType}
          onChange={handleFilterChange}
        >
          <option value="">Relation Type</option>
          {getUniqueValues("Relation Type").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="gender" value={filters.gender} onChange={handleFilterChange}>
          <option value="">Gender</option>
          {getUniqueValues("Gender").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select
          name="constituency"
          value={filters.constituency}
          onChange={handleFilterChange}
        >
          <option value="">Constituency</option>
          {getUniqueValues("Constituency").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="division" value={filters.division} onChange={handleFilterChange}>
          <option value="">Division</option>
          {getUniqueValues("Division").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="village" value={filters.village} onChange={handleFilterChange}>
          <option value="">Village</option>
          {getUniqueValues("Village").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="ward" value={filters.ward} onChange={handleFilterChange}>
          <option value="">Ward</option>
          {getUniqueValues("Ward").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>{String(item[col] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="entry-count">
        Showing <b>{filteredData.length}</b> of <b>{data.length}</b> entries
      </p>
    </div>
  );
};

export default SimpleJsonViewer;
