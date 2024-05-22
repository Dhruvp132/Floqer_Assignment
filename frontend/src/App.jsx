import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import LineGraph from "./components/LineGraph";
import SwapVertIcon from "@mui/icons-material/SwapVert";

const App = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "year", direction: "ascending" });
  const [selectedYear, setSelectedYear] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [jobSortConfig, setJobSortConfig] = useState({ key: "jobTitle", direction: "ascending" });

  //Ref hook for Explore more table 
  const ref = useRef(null);
  const refClose = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/salaries")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchJobTitles(selectedYear);
    }
  }, [selectedYear]);

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortJobTitles = (key) => {
    let direction = "ascending";
    if (jobSortConfig.key === key && jobSortConfig.direction === "ascending") {
      direction = "descending";
    }
    setJobSortConfig({ key, direction });
  };

  const fetchJobTitles = async (year) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/salaries/jobtitles?year=${year}`
      );
      setJobTitles(response.data);
    } catch (error) {
      console.error("Error fetching job titles:", error);
    }
  };

  const handleRowClick = (year) => {
    ref.current.click();
    setSelectedYear(year);
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const sortedJobTitles = [...jobTitles].sort((a, b) => {
    if (a[jobSortConfig.key] < b[jobSortConfig.key]) {
      return jobSortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[jobSortConfig.key] > b[jobSortConfig.key]) {
      return jobSortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="App">
      <br />
      <h1 style={{textAlign : "center"}}>Floqer’s Assignment for Software Dev Internship Role</h1>
      <h3 style={{ color: "blueviolet" }}>Salaries (2020-2024)</h3>
      <h6 style={{ marginLeft: "40px" }}>
        *Click on any row from Year Column to Explore more.{" "}
      </h6>
      <br />
      <table style={{ padding: "20px" }}>
        <thead>
          <tr>
            <th onClick={() => sortData("year")}>
              {" "}
              Year <SwapVertIcon />
            </th>
            <th onClick={() => sortData("totalJobs")}>
              {" "}
              Total Jobs <SwapVertIcon />
            </th>
            <th onClick={() => sortData("averageSalary")}>
              {" "}
              Average Salary (USD) <SwapVertIcon />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} onClick={() => handleRowClick(row.year)}>
              <td>{row.year}</td>
              <td>{row.totalJobs}</td>
              <td>{row.averageSalary.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <hr />
      <div>
        <h3 style={{ color: "blueviolet" }}>Line Graph</h3>
        <LineGraph />
      </div>

      {/* Explore more table  */}
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={refClose}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Aggregated Job Titles for {selectedYear}</h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedYear && (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => sortJobTitles("jobTitle")}>
                          Job Title <SwapVertIcon />
                        </th>
                        <th onClick={() => sortJobTitles("count")}>
                          Job Appeared <SwapVertIcon />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedJobTitles.map((title, index) => (
                        <tr key={index}>
                          <td>{title.jobTitle}</td>
                          <td>{title.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button-close" data-bs-dismiss="modal"
                aria-label="Close" className="btn btn-danger">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <h5 className="text-center text-gray-500">Made with ❤️ by <a style={{color : "darkviolet"}} target="_blank" href="https://www.linkedin.com/in/dhruvpatel1310/">Dhruv Patel</a></h5>
      </div>
  );
};

export default App;
