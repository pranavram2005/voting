import React, { useState, useEffect } from 'react';
import data from './output_with_roof.jsx';
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

// Combine all voting data into one array
const allVoteData = [
  ...data,
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

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalVoters: 0,
    constituencies: 0,
    wards: 0,
    taluks: 0,
    booths: 0,
    streets: 0,
    maleVoters: 0,
    femaleVoters: 0,
    transgenderVoters: 0,
    ageGroups: {
      '18-20': 0,
      '21-25': 0,
      '26-40': 0,
      '41-50': 0,
      '51-70+': 0
    }
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const constituencies = new Set();
    const wards = new Set();
    const taluks = new Set();
    const booths = new Set();
    const streets = new Set();
    
    let maleCount = 0;
    let femaleCount = 0;
    let transgenderCount = 0;
    
    const ageGroups = {
      '18-20': 0,
      '21-25': 0,
      '26-40': 0,
      '41-50': 0,
      '51-70+': 0
    };

    allVoteData.forEach(voter => {
      // Count unique locations
      if (voter.Constituency) constituencies.add(voter.Constituency);
      if (voter.Ward) wards.add(voter.Ward);
      if (voter.Constituency) taluks.add(voter.Constituency); // Using constituency as taluk
      if (voter.Part) booths.add(voter.Part);
      if (voter.Division) streets.add(voter.Division);

      // Count gender
      if (voter.Gender === 'ஆண்') maleCount++;
      else if (voter.Gender === 'பெண்') femaleCount++;
      else transgenderCount++;

      // Count age groups
      const age = parseInt(voter.Age);
      if (age >= 18 && age <= 20) ageGroups['18-20']++;
      else if (age >= 21 && age <= 25) ageGroups['21-25']++;
      else if (age >= 26 && age <= 40) ageGroups['26-40']++;
      else if (age >= 41 && age <= 50) ageGroups['41-50']++;
      else if (age >= 51) ageGroups['51-70+']++;
    });

    setStats({
      totalVoters: allVoteData.length,
      constituencies: constituencies.size,
      wards: wards.size,
      taluks: taluks.size,
      booths: booths.size,
      streets: streets.size,
      nagars: streets.size,
      maleVoters: maleCount,
      femaleVoters: femaleCount,
      transgenderVoters: transgenderCount,
      ageGroups
    });
  };

  const StatCard = ({ number, label, color = '#666', bgColor = '#ffffff', borderColor, variant }) => (
    <div className={`stat-card ${variant === 'compact' ? 'compact' : variant === 'large' ? 'large' : ''}`} style={{ backgroundColor: bgColor, borderColor: borderColor ?? color }}>
      <div className="stat-number" style={{ color }}>{number.toLocaleString()}</div>
      <div className="stat-label" style={{ color }}>{label}</div>
    </div>
  );

  const GenderStat = ({ imageSrc, count, label }) => (
    <div className="gender-stat">
      <div className="gender-icon">
        <img src={imageSrc} alt={label} />
      </div>
      <div className="gender-info">
        <div className="gender-count">{count.toLocaleString()}</div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">

      <div className="stats-grid">
        <StatCard 
          number={stats.constituencies} 
          label="Constituency" 
          color="#e74c3c" 
          bgColor="#ffffff"
          borderColor="#000"
          variant="compact"
        />
        <StatCard 
          number={stats.booths} 
          label="Booths" 
          color="#d68910" 
          bgColor="#ffffff"
          variant="large"
        />
        <StatCard 
          number={stats.wards} 
          label="Ward" 
          color="#e74c3c" 
          bgColor="#ffffff"
          borderColor="#000"
          variant="compact"
        />
        <StatCard 
          number={stats.taluks} 
          label="Nagars" 
          color="#e74c3c" 
          bgColor="#ffffff"
          borderColor="#000"
          variant="compact"
        />
       
        <StatCard 
          number={stats.streets} 
          label="Streets" 
          color="#3498db" 
          bgColor="#ffffff"
          variant="large"
        />
        <StatCard 
          number={stats.totalVoters} 
          label="Voters" 
          color="#8e44ad" 
          bgColor="#ffffff"
          variant="large"
        />
      </div>

      <div className="dashboard-content">
        <div className="gender-section">
          <h3>Gender</h3>
          <div className="gender-stats">
            <GenderStat 
              imageSrc="/i2.png" 
              count={stats.maleVoters} 
              label="Male"
            />
            <GenderStat 
              imageSrc="/i3.png" 
              count={stats.femaleVoters} 
              label="Female"
            />
            <GenderStat 
              imageSrc="/i4.png" 
              count={stats.transgenderVoters} 
              label="Transgender"
            />
          </div>
        </div>

        <div className="chart-section">
          <h3>Voter Age Graph</h3>
          <div className="age-chart">
            <div className="chart-container">
              <div className="y-axis">
                <div className="y-axis-title">No. of Voters</div>
                <div className="y-label">3,000</div>
                <div className="y-label">2,000</div>
                <div className="y-label">1,000</div>
                <div className="y-label">0</div>
              </div>
              <div className="chart-area">
                <svg viewBox="0 0 400 200" className="line-chart">
                  {/* Horizontal grid lines (top to bottom) */}
                  <line x1="0" y1="0" x2="400" y2="0" stroke="#e6e6e6" strokeWidth="1.5" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#e6e6e6" strokeWidth="1.5" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#e6e6e6" strokeWidth="1.5" />
                  {/* X-axis baseline */}
                  <line x1="0" y1="180" x2="400" y2="180" stroke="#000" strokeWidth="1.5" />
                  {/* Data line (shifted up 20px to leave room for x labels) */}
                  <polyline 
                    points="0,130 100,100 200,40 300,80 400,120" 
                    fill="none" 
                    stroke="#3498db" 
                    strokeWidth="3"
                  />
                  {/* Data points */}
                  <circle cx="0" cy="130" r="4" fill="#3498db" />
                  <circle cx="100" cy="100" r="4" fill="#3498db" />
                  <circle cx="200" cy="40" r="4" fill="#3498db" />
                  <circle cx="300" cy="80" r="4" fill="#3498db" />
                  <circle cx="400" cy="120" r="4" fill="#3498db" />
                  {/* X-axis labels inside SVG */}
                  <text x="0" y="197" textAnchor="middle" fontSize="14" fill="#000">18-20</text>
                  <text x="100" y="197" textAnchor="middle" fontSize="14" fill="#000">21-25</text>
                  <text x="200" y="197" textAnchor="middle" fontSize="14" fill="#000">26-40</text>
                  <text x="300" y="197" textAnchor="middle" fontSize="14" fill="#000">41-50</text>
                  <text x="400" y="197" textAnchor="middle" fontSize="14" fill="#000">51-70+</text>
                </svg>
              </div>
            </div>
            <div className="age-ranges">
              <div>Age range</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <p className="dashboard-note">
          Use the navigation menu above to switch between Dashboard and Voters Data views.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;