import React, { useRef, useEffect } from 'react';
import { LuBuilding2 } from 'react-icons/lu';
import './searchableDropdown.css';

const SearchableBranchDropdown = ({
  value,
  onChange,
  onSelect,
  loading,
  branches,
  showDropdown,
  setShowDropdown,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="searchable-input-container" ref={dropdownRef}>
      <div className="form__field">
        <span className="form__icon" aria-hidden>
          <LuBuilding2 />
        </span>
        <input
          type="text"
          className="searchable-input"
          placeholder="Search for a branch..."
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onClick={() => setShowDropdown(true)}
          required
        />
      </div>
      
      {showDropdown && (
        <div className="dropdown-menu">
          {loading ? (
            <div className="loading-indicator">Loading branches...</div>
          ) : filteredBranches.length === 0 ? (
            <div className="no-results">No branches found</div>
          ) : (
            filteredBranches.map(branch => (
              <div
                key={branch.branch_id}
                className="dropdown-item"
                onClick={() => {
                  onSelect(branch);
                  setShowDropdown(false);
                }}
              >
                {branch.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableBranchDropdown;